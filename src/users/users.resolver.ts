import {User} from './entities/user.entity';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UsersService} from './users.service';
import {CreateAccountInput, CreateAccountOutput,} from './dtos/create-account.dto';
import {LoginInput, LoginOutput} from './dtos/login.dto';
import {DuplicationException} from '../common/exceptions/duplicationException';
import {UseGuards} from '@nestjs/common';
import {AuthGuard} from '../auth/auth.guard';
import {AuthUser} from '../auth/auth-user.decorator';
import {UserProfileInput, UserProfileOutput} from './dtos/user-profile.dto';
import {NotfoundException} from '../common/exceptions/notfoundException';
import {EditProfileInput, EditProfileOutput} from './dtos/edit-profile.dto';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(returns => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      await this.usersService.createAccount(createAccountInput);

      return {
        ok: true,
      };
    } catch (error) {
      let message: string = `Couldn't create account`;
      if (error instanceof DuplicationException) message = error.message;

      return {
        ok: false,
        error: message,
      };
    }
  }

  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return await this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  @Query(returns => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
      return authUser;
  }

  @UseGuards(AuthGuard)
  @Query(returns => UserProfileOutput)
  async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);

      if(!user)
        throw new NotfoundException();

      return {
        ok: true,
        user
      }

    }catch (e) {
      return {
        ok: false,
        error: 'User Not Found',
      }
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => EditProfileOutput)
  async editProfile(
      @AuthUser() authUser: User,
      @Args('input') editProfileInput: EditProfileInput
  ): Promise<EditProfileOutput> {
    try{
      await this.usersService.editProfile(authUser.id, editProfileInput);

      return {
        ok: true
      }

    }catch (error) {
      return {
        ok: false,
        error
      }
    };

  }

}
