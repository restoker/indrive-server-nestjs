import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";


export class LoginInput extends PickType(User, ['email', 'password']) { }

export class LoginOutput extends CoreOutput {
    // user?: User;
}