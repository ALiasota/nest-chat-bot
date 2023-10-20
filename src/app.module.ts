import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TaskEntity } from './task.entity';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([TaskEntity]),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        return {
          middlewares: [sessions.middleware()],
          token: configService.get<string>('TELEGRAM_TOKEN'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          port: configService.get<number>('POSTGRES_PORT'),
          database: configService.get<string>('POSTGRES_DB'),
          username: configService.get<string>('POSTGRES_USER'),
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          migrations: [join(__dirname, '**', '*.migration.{ts,js}')],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
