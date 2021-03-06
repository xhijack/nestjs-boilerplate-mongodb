import { Module } from '@nestjs/common';
import { AuthMailService } from './verification/send-verification.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './authentication/hash.service';
import { jwtConstants, JwtStrategy } from './authentication/jwt.strategy';
import { LocalStrategy } from './authentication/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy } from './facebook-auth/facebook.strategy';
import { GoogleStrategy } from './google-auth/google.strategy';
import { MailModule } from '../mail/mail.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports:[
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    MailModule,
    ProfileModule
    ],
  controllers:[AuthController],
  providers: [
    AuthService,
    HashService,
    AuthMailService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports:[AuthService]
})
export class AuthModule {}
