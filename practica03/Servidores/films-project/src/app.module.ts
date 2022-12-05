import { Module } from '@nestjs/common';
import { FilmService } from './films/domain/services/film.service';
import { FilmsController } from './films/adapters/controllers/films.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [FilmsController],
  providers: [FilmService],
})
export class AppModule {}
