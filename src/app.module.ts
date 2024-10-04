import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonsModule } from './commons/commons.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { Rol } from './roles/entities/role.entity';
import { ResendModule } from 'nestjs-resend';
import { EmailToken } from './users/entities/emailToken.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true, }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: '123456',
      database: process.env.DB_NAME,
      entities: [User, Rol, EmailToken],
      // migrationsRun: false,
      // synchronize: true,//remove for production
    }),
    UsersModule,
    CommonsModule,
    AuthModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    RolesModule,
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
