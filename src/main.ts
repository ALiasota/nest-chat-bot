import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configEnv = app.get(ConfigService);
  const PORT = configEnv.get<number>('PORT') || 5001;
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
