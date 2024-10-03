import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Rol } from 'src/roles/entities/role.entity';
// import { Verification } from './entities/verification.entity';
import { EmailToken } from './entities/emailToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol, EmailToken])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
