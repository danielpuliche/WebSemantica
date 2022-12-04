import { Injectable } from '@nestjs/common';
import { Film } from '../models/film.model';

@Injectable()
export class FilmService {

  // A falta de base de datos se emplea variable en memoria
  private films: Film[] = [
    {
      name: "Titanic",
      genre: "Epic romance - Disaster",
      runningTime: 195,
      releaseYear: 1997
    }
  ]

  // Método para obtener la lista de películas
  list(): Film[] {
    return this.films;
  }

  // Método para crear una película
  create(film: Film): Film {
    this.films.push(film)
    return film
  }

  // Método para actualizar la película con el id dado
  update(film: Film, id: number): Boolean {    
    return (this.films[id] = film)? true : false
  }

  // Método para eliminar la película con el id dado
  delete(id: number): Boolean {
    const lenFilms = this.films.length

    this.films = this.films.filter((val, index) => index != id)
    return (lenFilms == this.films.length? false: true)
  }

  // Método para actualizar el nombre de la película con el id dado
  updateName(name: String, id: number): Boolean {
    return (this.films[id].name = name)? true : false
  }
}
