import {InputType, ObjectType, PickType} from '@nestjs/graphql';
import {Verification} from '../entities/verification.entity';
import {CoreOutput} from '../../common/dtos/output.dto';

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) {}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}
