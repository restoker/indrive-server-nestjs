import { IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/commons/entities/core.entity";
// import { Rol } from "src/roles/entities/role.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany } from "typeorm";
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from "@nestjs/common";

export enum UserRole {
    client = 'client',
    driver = 'driver',
    admin = 'admin',
}

@Entity()
export class User extends CoreEntity {

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    @Column()
    fullname: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @Column('varchar', { unique: true })
    email: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(9, 9)
    @Column({ unique: true })
    phone: string;

    @IsOptional()
    @Column({ nullable: true })
    image?: string;

    @IsNotEmpty()
    @Length(4, 50)
    @IsString()
    @Column()
    password: string;

    @IsBoolean()
    @IsOptional()
    @Column({ default: false })
    verificated?: boolean;

    @IsBoolean()
    @IsOptional()
    @Column({ default: true })
    isActive?: boolean;

    @IsOptional()
    @Column({ nullable: true })
    notification_token?: string;
    // role?: UserRole[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const encripPasssword = await bcrypt.hash(String(this.password), salt);
                this.password = encripPasssword;
                return;
            } catch (e) {
                console.log(e);
                throw new InternalServerErrorException('Error al encriptar el password');
            }
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    checkEmailIsLowerCase() {
        this.email = this.email.trim().toLowerCase();
    }

    async checkPassword(password: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(password, this.password);
            return ok;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException('Error en el servidor');
        }
    }

    // @ManyToMany(() => Rol, (rol) => rol.users, { cascade: true })
    // @JoinTable({
    //     name: 'user_has_roles',
    //     joinColumn: {
    //         name: 'id_user',
    //     },
    //     inverseJoinColumn: {
    //         name: 'id_rol',
    //     }
    // })
    // roles: Rol[]
}
