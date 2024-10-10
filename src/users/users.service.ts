import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { LoginOutput, LoginInput } from './dto/login-user.dto';
// import { ResendService } from 'nestjs-resend';
// import { Verification } from './entities/verification.entity';
import { ResendService } from 'nestjs-resend';
import { EmailToken } from './entities/emailToken.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { UpdateUserInput, UpdateUserOutput } from './dto/update-user.dto';
// import { ResendService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // @InjectRepository(Verification)
    // private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(EmailToken)
    private readonly emailTokenrepository: Repository<EmailToken>,
    private readonly resendService: ResendService,
    private readonly dataSource: DataSource,
    private readonly jwtServices: JwtService,
  ) { }

  async create(input: CreateUserInput): Promise<CreateUserOutput> {
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // console.log(process.env.MY_URL);
    try {
      // console.log(process.env.RESEND_API);
      // verificar si el usuario ya existe
      const existe = await this.userRepository.findOneBy({ email: input.email });
      if (existe) {
        if (!existe.verificated) {
          const verificationEmail = await this.generateEmailVerificationToken(input.email);
          const confirmLink = `${process.env.MY_URL}/users/verification?token=${verificationEmail.token}`;
          await this.resendService.send({
            from: 'indrive <onboarding@resend.dev>',
            to: input.email,
            subject: 'wellcome to indrive',
            html: `<p>click here <a href='${confirmLink}'>Confirm your account here</a></p>`
          });
          return { ok: false, msg: 'Se volvío a enviar un email con el link de activacion a tu correo' };
        }
        return { ok: false, msg: 'El usuario ya existe', error: 'El email ya esta registrado, pruebe con otro' };
      }

      const phoneExiste = await this.userRepository.findOneBy({ phone: input.phone });
      if (phoneExiste) return { ok: false, msg: 'El teléfono ya existe', error: 'El teléfono ya esta registrado, pruebe con otro' };

      const newUser = this.userRepository.create({
        email: input.email,
        fullname: input.fullname,
        password: input.password,
        phone: input.phone,
      });

      const token = crypto.randomUUID();
      const expires = new Date(new Date().getTime() + 3600 * 1000);
      const confirmLink = `${process.env.MY_URL}/users/verification?token=${token}`;
      // const confirmLink = `${domain}/verification?token=${token}`;
      // console.log(confirmLink);
      const verificationToken = this.emailTokenrepository.create({
        token,
        expires,
        email: input.email,
      });

      const p1 = await this.userRepository.save(newUser);
      const p3 = await this.emailTokenrepository.save(verificationToken);
      const p2 = await this.resendService.send({
        from: 'indrive <onboarding@resend.dev>',
        to: input.email,
        subject: 'wellcome to indrive',
        html: `<p>click here <a href='${confirmLink}'>Confirm your account here</a></p>`
      });
      this.dataSource.createEntityManager()
      await this.dataSource.manager.transaction(async () => {
        Promise.all([p1, p2, p3]).then((values) => {
          // console.log(values);
        })
          .catch((reason) => {
            return { ok: false, msg: 'Ocurrio un error al crear el usuario' };
          });
      })
      // console.log(userCreate);
      return { ok: true, msg: 'Se envio un Link de verificación a su correo' };
    } catch (e) {
      // console.log(e);
      return { ok: false, msg: 'Error en el servidor' };
    }
  }

  async findById(input: UserProfileInput): Promise<UserProfileOutput> {
    const { userId } = input;
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      return {
        ok: true,
        msg: 'Usuario encontrado',
        user,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, msg: 'Error on server', error: 'User Not Found' };
    }
  }

  async login(input: LoginInput): Promise<LoginOutput> {
    try {
      const existe = await this.userRepository.findOneBy({ email: input.email });
      if (!existe) return { ok: false, msg: 'Usuario o Password incorrectos' };
      // verificar el password
      console.log(existe);
      const password = await existe.checkPassword(input.password);
      if (!password) return { ok: false, msg: 'Usuario o password incorrectos' };
      const payload = { id: existe.id, name: existe.fullname };
      const token = this.jwtServices.sign(payload);
      return { ok: true, msg: `Hola ${existe.fullname}, Bienvenido nuevamente`, token };
    } catch (e) {
      return { ok: false, msg: 'Error on server', error: 'Error en el servidor' };
    }
  }

  async confirmEmailWithToken(token: string) {
    try {
      // verificar si el token existe
      const existeToken = await this.emailTokenrepository.findOneBy({ token });
      if (!existeToken) return { ok: false, msg: 'El token no existe' };
      const hasExpired = new Date(existeToken.expires) < new Date();
      if (hasExpired) return { ok: false, msg: 'El token a expirado' };
      // verificar si el usuario existe
      const usuario = await this.userRepository.findOneBy({ email: existeToken.email });
      if (!usuario) return { ok: false, msg: 'El usuario no existe' };
      await this.emailTokenrepository.delete({ email: usuario.email });
      await this.userRepository.save({
        id: usuario.id,
        verificated: true,
        email: existeToken.email,
      })
      return { ok: true, msg: 'Su correo fue validado' };
    } catch (e) {
      return { ok: false, msg: 'Error en el servidor, intentolo mas tarde' };
    }
  }

  async generateEmailVerificationToken(email: string) {
    try {
      const token = crypto.randomUUID();
      const expires = new Date(new Date().getTime() + 3600 * 1000);

      const existingToken = await this.getVerificationTokenByEmail(email);

      if (existingToken) {
        await this.emailTokenrepository.delete({ id: existingToken.id });
      }

      const emailToken = this.emailTokenrepository.create({
        token,
        expires,
        email,
      });
      const verificationToken = await this.emailTokenrepository.save(emailToken);
      return verificationToken;
    } catch (e) {
      return null;
    }
  }

  getVerificationTokenByEmail = async (email: string) => {
    try {
      const verificationToken = await this.emailTokenrepository.findOneBy({ email });
      return verificationToken;
    } catch (error) {
      return null;
    }
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  async update(id: string, input: UpdateUserInput): Promise<UpdateUserOutput> {
    if (input.id) {
      delete input.id;
    }
    try {
      // verificar si el usuario existe
      const existe = await this.userRepository.findBy({ id });
      if (!existe) return { ok: false, msg: `El usuario con el ${id} no existe` };

      const updatedUser = Object.assign(existe, input);

      await this.userRepository.save({
        id,
        ...updatedUser,
      })

    } catch (e) {
      return { ok: false, msg: 'Error en el servidor' };
    }
  }

  async updateWithImage(id: string, input: UpdateUserInput): Promise<UpdateUserOutput> {
    if (input.id) {
      delete input.id;
    }
    try {
      // verificar si el usuario existe
      const existe = await this.userRepository.findBy({ id });
      if (!existe) return { ok: false, msg: `El usuario con el ${id} no existe` };

      const updatedUser = Object.assign(existe, input);

      await this.userRepository.save({
        id,
        ...updatedUser,
      })

    } catch (e) {
      return { ok: false, msg: 'Error en el servidor' };
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
