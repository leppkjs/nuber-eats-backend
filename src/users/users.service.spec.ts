import {Test} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {JwtService} from 'src/jwt/jwt.service';
import {MailService} from 'src/mail/mail.service';
import {User} from './entities/user.entity';
import {Verification} from './entities/verification.entity';
import {UsersService} from './users.service';
import {Repository} from 'typeorm';
import {UserRole} from './enum/UserRole';

const mockRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn()
});

const mockJwtService = {
    sign: jest.fn(() => 'fake token.'),
    verify: jest.fn(),
};

const mockMailService = {
    sendVerificationEmail: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
    let usersService: UsersService;
    let mailService: MailService;
    let jwtService: JwtService;
    let usersRepository: MockRepository<User>;
    let verificationsRepository: MockRepository<Verification>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(Verification),
                    useValue: mockRepository(),
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: MailService,
                    useValue: mockMailService,
                },
            ],
        }).compile();
        usersService = module.get<UsersService>(UsersService);
        mailService = module.get<MailService>(MailService);
        jwtService = module.get<JwtService>(JwtService);
        usersRepository = module.get(getRepositoryToken(User));
        verificationsRepository = module.get(getRepositoryToken(Verification));
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
    });

    describe('createAccount', () => {
        const createAccountArgs = {
            email: 'test@test.com', password: '12345', role: UserRole.Client
        };

        const user: Partial<User> = createAccountArgs;

        it('should fail if user exists', async () => {
            usersRepository.findOne.mockResolvedValue({
                id: 1,
                email: 'test@test.com'
            });

            const result = await usersService.createAccount(createAccountArgs);

            expect(result).toMatchObject({ok: false, error: 'There is a user with that email already'});
        });

        it('should create a new user', async () => {
            usersRepository.findOne.mockResolvedValue(undefined);
            usersRepository.create.mockReturnValue(user);
            usersRepository.save.mockResolvedValue(user);
            verificationsRepository.create.mockReturnValue({code: 'code', user});
            verificationsRepository.save.mockResolvedValue({code: 'code', user});

            const result = await usersService.createAccount(createAccountArgs);

            expect(usersRepository.create).toHaveBeenCalledTimes(1);
            expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

            expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
            expect(verificationsRepository.create).toHaveBeenCalledWith({user});
            expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
            expect(verificationsRepository.save).toHaveBeenCalledWith({code: 'code', user});

            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String)
            );

            expect(result).toEqual({ok: true});

        });

        it('should fail on exception', async () => {
            usersRepository.findOne.mockRejectedValue(new Error(''));
            const result = await usersService.createAccount(createAccountArgs);

            expect(result).toEqual({ok: false, error: "Couldn't create account"});
        });
    });

    describe('login', () => {
        const loginArgs = {email: 'test@test.com', password: '12345'};

        it('should fail if user does not exists', async () => {
            usersRepository.findOne.mockResolvedValue(undefined);

            const user = await usersService.login(loginArgs);

            expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object)
            );

            expect(user).toMatchObject({
                ok: false,
                error: 'User not found',
            });

        });

        it('should fail if the password is wrong', async () => {
            const mockUser: Partial<User> = {
                id: 1,
                checkPassword: jest.fn(() => Promise.resolve(false))
            };

            usersRepository.findOne.mockResolvedValue(mockUser);

            const user = await usersService.login(loginArgs);

            expect(user).toStrictEqual({
                ok: false,
                error: 'Wrong password',
            });
        });

        it('should return token if password correct', async () => {
            const mockUser: Partial<User> = {
                id: 1,
                checkPassword: jest.fn(() => Promise.resolve(true))
            };

            usersRepository.findOne.mockResolvedValue(mockUser);

            const user = await usersService.login(loginArgs);

            expect(jwtService.sign).toHaveBeenCalledTimes(1);
            expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
            expect(user).toStrictEqual({
                ok: true,
                token: 'fake token.',
            });
        });
    });

    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
});