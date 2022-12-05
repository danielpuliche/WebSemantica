import { Injectable } from '@nestjs/common';
import { FilmEntity } from '../entities/film.entity';
import { InjectRepository} from '@nestjs/typeorm';
import { MongoRepository, InsertResult, UpdateResult} from 'typeorm';

@Injectable()
export class FilmService {
constructor(
  @InjectRepository(FilmEntity)
  private repository: MongoRepository<FilmEntity>
) {}

  // Método para obtener la lista de películas
  public async list(): Promise<FilmEntity[]> {
    return await this.repository.find();
  }

  // Método para crear una película
  public async create(film: FilmEntity): Promise<InsertResult> {
    const newFilm = await this.repository.insert(film);
    return newFilm;
  }

  // Método para actualizar la película con el id dado
  public async update(film: FilmEntity, id: number): Promise<UpdateResult> {    
    const updatedFilm = await this.repository.update(id, film);
    return updatedFilm
  }

  // Método para eliminar la película con el id dado
  public async delete(id: number): Promise<Boolean> {
    const deleResult = await this.repository.delete(id)
    return deleResult.affected > 0;
  }

  // Método para actualizar el nombre de la película con el id dado
  public async updateName(name: String, id: number): Promise<UpdateResult>{
    const updatedFilm = await this.repository.update(id, {name: name});
    return updatedFilm;
  }
}
