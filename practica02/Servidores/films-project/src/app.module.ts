import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { FilmsController } from './films/films.controller';

@Module({
  imports: [],
  controllers: [FilmsController],
  providers: [AppService],
})
export class AppModule {}
