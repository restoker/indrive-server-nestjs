import { IsEmail, IsNotEmpty, IsNumberString, IsString, IsUUID } from "class-validator";
import { CoreEntity } from "src/commons/entities/core.entity";
import { Column, Entity } from "typeorm";


@Entity()
export class EmailToken extends CoreEntity {

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Column()
    token: string;

    @IsNotEmpty()
    @Column()
    expires: Date;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Column()
    email: string;
}