import { Controller, Get, Post, Body, Put, Param, Delete, Patch, UseGuards} from '@nestjs/common';
import { FilmService} from '../../domain/services/film.service';

import { FilmEntity } from 'src/films/domain/entities/film.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

    @UseGuards(JwtAuthGuard)
    @Post("create")
    createFilm(@Body() film: FilmEntity){
        try{
            return (this.filmService.create(film) ? "Película creada exitosamente" : "No se pudo agregar la película")
        }catch(e){
            return errReturn(e, "Error al crear película")
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put("update/:id")
    updateFilm(@Body() film: FilmEntity, @Param('id') id: number){
        try{
            return (this.filmService.update(film, id) ? "Película editada exitosamente" : "No se pudo actualizar la película")
        }catch(e){
            return errReturn(e, "Error al editar película")
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete("delete/:id")
    deleteFilm(@Param('id') id: number){
        try{
            return (this.filmService.delete(id) ? "Película eliminada exitosamente" : "No se pudo eliminar la película")
        }catch(e){
            return errReturn(e, "Error al eliminar película")
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch("update/:id/name")
    updateName(@Body() data, @Param('id') id: number){
        try{
            return (this.filmService.updateName(data.name, id) ? "Nombre actualizado exitosamente" : "No se pudo actualizar el nombre de la película")
        }catch(e){
            return errReturn(e, "Error al editar nombre de película")
        }
    }       

}
