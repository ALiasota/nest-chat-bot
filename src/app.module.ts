import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
