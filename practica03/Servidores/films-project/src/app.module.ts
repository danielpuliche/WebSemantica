import { Module } from '@nestjs/common';
import { FilmService } from './films/domain/services/film.service';
import { FilmsController } from './films/adapters/controllers/films.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './films/domain/entities/film.entity';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://daniel:pass123@filmscluster.yojwcvu.mongodb.net/?retryWrites=true&w=majority',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([FilmEntity])
  ],
  controllers: [FilmsController],
  providers: [FilmService],
})

export class AppModule {}