import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/commons/dtos/core-output.dto';

export class UpdateUserInput extends PartialType(User) { }


export class UpdateUserOutput extends CoreOutput { }
