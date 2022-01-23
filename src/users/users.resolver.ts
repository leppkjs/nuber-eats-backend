import {User} from './entities/user.entity';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UsersService} from './users.service';
import {CreateAccountInput, CreateAccountOutput,} from './dtos/create-account.dto';
import {LoginInput, LoginOutput} from './dtos/login.dto';
import {UseGuards} from '@nestjs/common';
import {AuthGuard} from '../auth/auth.guard';
import {AuthUser} from '../auth/auth-user.decorator';
import {UserProfileInput, UserProfileOutput} from './dtos/user-profile.dto';
import {EditProfileInput, EditProfileOutput} from './dtos/edit-profile.dto';
import {VerifyEmailInput, VerifyEmailOutput} from './dtos/verify-email.dto';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(returns => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return await this.usersService.login(loginInput);
  }

  @Query(returns => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
      return authUser;
  }

  @UseGuards(AuthGuard)
  @Query(returns => UserProfileOutput)
  async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
      return await this.usersService.findById(userProfileInput.userId);
  }

  @Mutation(returns => EditProfileOutput)
  @UseGuards(AuthGuard)
  async editProfile(
      @AuthUser() authUser: User,
      @Args('input') editProfileInput: EditProfileInput
  ): Promise<EditProfileOutput> {
    return await this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation(returns => VerifyEmailOutput)
  async verifyEmail(@Args('input') {code}: VerifyEmailInput) {
      return await this.usersService.verifyEmail(code);
  }

}
