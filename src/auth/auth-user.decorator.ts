// https://www.trpkovski.com/2022/10/10/nestjs-current-user-custom-decorator
// https://stackoverflow.com/questions/65028137/nestjs-createparamdecorator-return-undefined

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // console.log(request);
    const user = request['user'];
    return user;
});