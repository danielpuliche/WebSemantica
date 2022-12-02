import { Controller, Get, Post, Body, Put, Param, Delete, Patch} from '@nestjs/common';

interface Film{
    name: String,
    genre: String,
    runningTime: Number,
    releaseYear: Number
}

@Controller('films')
export class FilmsController {

    private films: Film[] = [
        {
            name: "Titanic",
            genre: "Epic romance - Disaster",
            runningTime: 195,
            releaseYear: 1997
        }
    ]

    @Get()
    getFilms(): Film[] {
        return this.films;
    }

    @Post("create")
    createFilm(@Body() data: Film): String{
        try{
            this.films.push(data)
            return `Película "${data.name}" añadida exitosamente`
        }catch{
            return "Error al añadir película"
        }
    }

    @Put("update/:id")
    updateFilm(@Body() data: Film, @Param('id') id: number): String {
        try{
            if(id >= 0 && id < this.films.length){
                this.films[id] = data
                return `Película con id '${id}' actualizada correctamente`
            }else
                return `No existe película con id '${id}'`
            
        }catch{
            return "Error al editar película"
        }
    }

    @Delete("delete/:id")
    deleteFilm(@Param('id') id: number): String{
        try{
            if(id >= 0 && id < this.films.length){
                this.films = this.films.filter((val, index) => index != id)
                return "Película eliminada correctamente"
            }else
                return `No existe película con id '${id}'`
        }catch{
            return `No se pudo eliminar la película con id ${id}`
        }
    }

    @Patch("update/:id/name")
    updateName(@Body() data, @Param('id') id: number): String{
        try{
            if(id >= 0 && id < this.films.length){
                this.films[id].name = data.name;
                return `Película con id '${id}' actualizada correctamente`
            }else{
                return `No existe película con id '${id}'`
            }
        }catch{
            return `No se pudo actualizar el nombre a la película con id ${id}`
        }
    }       

}
