import { Column, Entity } from "typeorm";
import { CoreEntity } from "src/commons/entities/core.entity";


@Entity()
export class TwoFactorToken extends CoreEntity {
    @Column()
    token: string;
    @Column()
    expires: Date;
    @Column()
    email: string;
    @Column()
    userID: string;
}