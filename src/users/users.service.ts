import {InjectRepository} from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import {User} from './entities/user.entity';
import {Injectable} from '@nestjs/common';
import {CreateAccountInput} from './dtos/create-account.dto';
import {DuplicationException} from '../common/exceptions/duplicationException';
import {LoginInput} from './dtos/login.dto';
import {NotfoundException} from '../common/exceptions/notfoundException';
import {IncorrectPassword} from '../common/exceptions/incorrectPassword';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '../jwt/jwt.service';
import {EditProfileInput} from './dtos/edit-profile.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<void> {
    const exists = await this.users.findOne({ email });

    if (exists) {
      throw new DuplicationException('There is a user with that email already');
    }

    await this.users.save(this.users.create({ email, password, role }));
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    const user = await this.users.findOne({ email });
    if (!user) {
      throw new NotfoundException('User not found');
    }

    const passwordCorrect = await user.checkPassword(password);
    if (!passwordCorrect) {
      throw new IncorrectPassword('Wrong password');
    }

    const token = this.jwtService.sign(user.id);
    return {
      ok: true,
      token,
    };
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({id})
  }

  async editProfile(userId: number, {email, password}: EditProfileInput): Promise<UpdateResult> {
      const user = await this.findById(userId);

      if(email) {
         user.email = email;
      }

      if(password) {
          user.password = password;
      }

      return this.users.update(userId, user);
  }
}
