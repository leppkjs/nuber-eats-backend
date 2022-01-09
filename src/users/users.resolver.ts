import { User } from './entities/user.entity';
import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => Boolean)
  hi(): boolean {
    return true;
  }
}
