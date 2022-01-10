import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import { DuplicationException } from '../common/exceptions/duplicationException';
import { LoginInput } from './dtos/login.dto';
import { NotfoundException } from '../common/exceptions/notfoundException';
import { IncorrectPassword } from '../common/exceptions/incorrectPassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
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

    return {
      ok: true,
      token: 'make ....jwt.... ',
    };
  }
}
