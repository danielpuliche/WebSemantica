import { Controller, Get, Post, Body, Put, Param, Delete, Patch, UseGuards} from '@nestjs/common';
import { FilmService} from '../../domain/services/film.service';

import { Film } from '../../domain/models/film.model';
import { AuthGuard } from '@nestjs/passport';

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

    @UseGuards(AuthGuard('local'))
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
