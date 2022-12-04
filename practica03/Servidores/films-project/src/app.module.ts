import { Module } from '@nestjs/common';
import { FilmService } from './films/domain/services/film.service';
import { FilmsController } from './films/adapters/controllers/films.controller';

@Module({
  imports: [],
  controllers: [FilmsController],
  providers: [FilmService],
})
export class AppModule {}
