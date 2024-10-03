import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/commons/common.constants';
import { JwtModuleOptions } from './jwt.interface';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTIONS)
        private readonly options: JwtModuleOptions,
    ) { }

    sign(payload: object): string {
        // console.log(payload);
        return jwt.sign(
            payload,
            this.options.privateKey,
            { expiresIn: '2hr' }
        );
    }

    verify(token: string) {
        try {
            return jwt.verify(token, this.options.privateKey);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return false;
            }
            throw error
        }
    }
}
