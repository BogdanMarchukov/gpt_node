import { Module } from '@nestjs/common';
import { GptModule } from './modules/gpt/gpt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/User.model';
import { UserModule } from './modules/user/user.module';
import { UserChat } from './models/UserChat';
import { RootKeys } from './common/config-types';

@Module({
  imports: [
    GptModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get(RootKeys.Database).dialect,
        host: configService.get(RootKeys.Database).host,
        port: configService.get(RootKeys.Database).port,
        username: configService.get(RootKeys.Database).username,
        password: configService.get(RootKeys.Database).password,
        database: configService.get(RootKeys.Database).database,
        models: [User, UserChat],
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
