import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import { DuplicationException } from '../common/exceptions/duplicationException';
import { CommonException } from '../common/exceptions/commonException';

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
    try {
      const exists = await this.users.findOne({ email });

      if (exists) {
        throw new DuplicationException(
          'There is a user with that email already',
        );
      }

      await this.users.save(this.users.create({ email, password, role }));
    } catch (error) {
      if (error instanceof DuplicationException) throw error;

      throw new CommonException(`Couldn't create account`);
    }
  }
}
