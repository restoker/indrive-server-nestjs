import { PickType } from "@nestjs/mapped-types";
import { CoreOutput } from "src/commons/dtos/core-output.dto";
import { User } from "../entities/user.entity";

export class CreateUserInput extends PickType(User, ['fullname', 'phone', 'email', "password", "image", 'notification_token']) { }

export class CreateUserOutput extends CoreOutput { }
