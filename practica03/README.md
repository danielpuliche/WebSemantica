# Práctica 03: Seguridad y calidad

Como implementar la calidad del software para que funcione en el futuro.

---

## Desarrollo de la práctica

A continuación se presentan los pasos realizados durante el desarrollo de la práctica:

1. Arquitectura hexagonal

    A partir del proyecto realizado en la practica 2 buscamos implementar la arquitectura hexagonal para mejorarlo. Primeramente, creamos una rama `hexagonal` a partir de la rama `main` del proyecto.

        git checkout -b hexagonal main

    Ahora para empezar a aplicar la arquitectura hexagonal, modificamos la estructura de nuestros archivos para que quede de esta manera.

    ![Estructura del codigo](/practica03/images/codeStructure.png)

    Dentro de `domain/models` creamos el archivo `film.model.ts` donde se creará la clase `Film`.

    ```typescript
    export class Film {
        name: String;
        genre: String;
        runningTime: Number;
        releaseYear: Number;
    }
    ```

    Ahora, la funcionalidad o lógica que habíamos llevado a cabo en el controlador la trasladamos dentro de `domain/services` para regirnos a la arquitectura hexagonal. En esta carpeta debemos modificar el archivo `app.service.ts` a `film.service.ts`.

    ```typescript
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
    ```
    El controlador `films.controller.ts` lo modificamos para que emplee lo implementado en el servicio.

    ```typescript
    import { Controller, Get, Post, Body, Put, Param, Delete, Patch} from '@nestjs/common';
    import { FilmService} from '../../domain/services/film.service';

    import { Film } from '../../domain/models/film.model';

    // Función para mostrar un mensaje en caso de errores
    const errReturn = (e: Error, message: string) =>{
        return {
            message: message,
            error: e
        }
    }

    @Controller('films')
    export class FilmsController {
    constructor(private readonly filmService: FilmService) { }

        @Get()
        getFilms(){
            try{
                return this.filmService.list();
            }catch(e){
                return errReturn(e, "Error al listar películas")
            }
        }

        @Post("create")
        createFilm(@Body() film: Film){
            try{
                return (this.filmService.create(film) ? "Película creada exitosamente" : "No se pudo agregar la película")
            }catch(e){
                return errReturn(e, "Error al crear película")
            }
        }

        @Put("update/:id")
        updateFilm(@Body() film: Film, @Param('id') id: number){
            try{
                return (this.filmService.update(film, id) ? "Película editada exitosamente" : "No se pudo actualizar la película")
            }catch(e){
                return errReturn(e, "Error al editar película")
            }
        }

        @Delete("delete/:id")
        deleteFilm(@Param('id') id: number){
            try{
                return (this.filmService.delete(id) ? "Película eliminada exitosamente" : "No se pudo eliminar la película")
            }catch(e){
                return errReturn(e, "Error al eliminar película")
            }
        }

        @Patch("update/:id/name")
        updateName(@Body() data, @Param('id') id: number){
            try{
                return (this.filmService.updateName(data.name, id) ? "Nombre actualizado exitosamente" : "No se pudo actualizar el nombre de la película")
            }catch(e){
                return errReturn(e, "Error al editar nombre de película")
            }
        }       

    }
    ```
    De este modo se sigue a grandes rasgos la arquitectura hexagonal, donde separamos los modelos, servicios y controladores para poder trabajar con ellos aparte y no tener que hacer un cambio en la lógica si queremos hacerlo funcionar con otra tecnología o realizar pruebas de manera más fácil y asilada.

