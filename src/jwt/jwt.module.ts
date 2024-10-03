import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModuleOptions } from './jwt.interface';
import { CONFIG_OPTIONS } from 'src/commons/common.constants';

@Global()
@Module({})
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      imports: [UsersModule],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options
        },
        JwtService,
      ],
      exports: [JwtService],
      module: JwtModule,
    }
  }
}
