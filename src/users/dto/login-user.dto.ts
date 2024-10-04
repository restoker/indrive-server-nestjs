import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";
import { IsJWT, IsString } from "class-validator";


export class LoginInput extends PickType(User, ['email', 'password']) { }

export class LoginOutput extends CoreOutput {
    // user?: User;
    @IsString()
    @IsJWT()
    token?: string;
}