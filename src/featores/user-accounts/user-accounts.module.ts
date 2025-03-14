import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { CryptoService } from './application/crypto.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { BasicStrategy } from './guards/basic/basic.strategy';
import { DeviceController } from './api/security.controller';
import { DevicesService } from './application/devices.service';
import { DevicesRepository } from './infrastructure/devices.repository';
import { DeviceQueryRepository } from './infrastructure/query/device.query-repository';
import { LoginUseCase } from './use-cases/loginUseCase';
import { SendPasswordRecoveryCodeUseCase } from './use-cases/sendPasswordRecoveryCode';
import { ResendConfirmationCodeUseCase } from './use-cases/resendConfirmationUseCase';
import { RefreshTokenUseCase } from './use-cases/refreshTokenUseCase';
import { LogoutUseCase } from './use-cases/logoutUseCase';
import { ConfirmEmailUseCase } from './use-cases/confirmEmailUseCase';
import { ValidateUserUseCase } from './use-cases/validateUserUseCase';
import { ChangePasswordUseCase } from './use-cases/changePasswordUseCase';
import { CqrsModule } from '@nestjs/cqrs';

const useCases = [
  ValidateUserUseCase,
  ChangePasswordUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
  ConfirmEmailUseCase,
  LoginUseCase,
  SendPasswordRecoveryCodeUseCase,
  ResendConfirmationCodeUseCase,
];
const adapters = [];

@Module({
  imports: [
    //TypeOrmModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: 'access-token-secret',
      // signOptions: { expiresIn: '6m' },
    }),
    NotificationsModule,
    CqrsModule,
  ],
  controllers: [UsersController, AuthController, DeviceController],
  providers: [
    UsersService,
    DevicesService,
    DevicesRepository,
    DeviceQueryRepository,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    AuthService,
    ...useCases,
    CryptoService,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
  ],
  exports: [JwtStrategy, UsersRepository],
})
export class UserAccountsModule {}
