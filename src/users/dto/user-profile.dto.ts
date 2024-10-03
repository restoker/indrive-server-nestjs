import { IsEmpty, IsOptional, IsUUID } from "class-validator";
import { User } from "../entities/user.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";


export class UserProfileInput {
    @IsUUID()
    userId: string;
}

export class UserProfileOutput extends CoreOutput {
    @IsOptional()
    // @Field(type => User, { nullable: true, defaultValue: null })
    user?: User;
}