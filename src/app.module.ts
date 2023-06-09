import { Module } from '@nestjs/common';
import { GptModule } from './modules/gpt/gpt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/User.model';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { UserChat } from './models/UserChat';

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
        dialect: configService.get('database.dialect') || 'postgres',
        host: configService.get('database.host') || '127.0.0.1',
        port: +configService.get('database.port') || 5433,
        username: configService.get('database.userName') || 'postgres',
        password: configService.get('database.password') || 'mysecretpassword',
        database: configService.get('database.database') || 'postgres',
        models: [User, UserChat],
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
