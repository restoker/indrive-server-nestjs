import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CoreEntity } from "src/commons/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Verification extends CoreEntity {

    @IsDate()
    @Column()
    expires: Date;

    @IsEmail()
    @Column()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    code: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    // @BeforeInsert()
    // createCode(): void {
    //     const token = crypto.randomUUID();
    //     this.expires = new Date(new Date().getTime() + 3600 * 1000);
    //     this.code = token;
    // }
}