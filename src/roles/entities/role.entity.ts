import { IsEnum, IsString } from "class-validator";
import { CoreEntity } from "src/commons/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany } from "typeorm";

export enum RolEnumType {
    admin = "admin",
    driver = "driver",
    user = "user",
}

@Entity()
export class Rol extends CoreEntity {

    @IsString()
    @Column({ unique: true })
    name: string;

    @IsString()
    @Column()
    image: string;

    @IsString()
    @Column()
    route: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[]
}
