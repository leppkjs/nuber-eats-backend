import {BeforeInsert, BeforeUpdate, Column, Entity} from 'typeorm';
import {CoreEntity} from '../../common/entities/core.entity';
import {Field, InputType, ObjectType, registerEnumType,} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import {IsEmail, IsEnum} from 'class-validator';
import {UserRole} from '../enum/UserRole';

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column({select: false})
  @Field(type => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({default: false})
  @Field(type => Boolean)
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if(this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.error('At the User.hashPassword :', e);
        throw e;
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    return await bcrypt.compare(aPassword, this.password);
  }
}
