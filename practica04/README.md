# Práctica 04: Desplegando en la nube

Se hará el despliegue de la aplicación desarrollada en la nube haciendo uso de un servicio de hosting gratuito. En este caso, los cambios se realizarán sobre el folder `practica03`.

---

## Desarrollo de la práctica

A continuación se presentan los pasos realizados durante el desarrollo de la práctica:

1. Desplegar una aplicación en la nube

  Para empezar, descargamos deta.

    curl -fsSL https://get.deta.dev/cli.sh | sh

  ![Instalación Deta](/practica04/images/detaInstall.png)

  Agregamos la variable de entorno tal como lo expresa la instalación. 

  ![Agregar variable de entorno](/practica04/images/path.png)

  Iniciamos sesión

  ![Inicio de sesión](/practica04/images/detaLogin.png)

  Creamos el archivo `src/index.ts`.

  ```typescript
  import { NestFactory } from '@nestjs/core';
  import { ExpressAdapter } from '@nestjs/platform-express';
  import { AppModule } from './app.module';

  const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  return app.init();
  };

  export default createNestServer;
  ```

  Se crea en la raiz del proyecto el archivo `index.js`.

  ```ts
  const express = require('express');
  const createServer = require('./dist/index').default;

  const app = express();
  let nest;

  app.use(async (req, res) => {
  if (!nest) {
    nest = express();
    await createServer(nest);
  }
  return nest(req, res);
  });

  module.exports = app;
  ```

  Compilamos el pryecto antes de publicarlo.

    cd ~/Documents/Universidad/WebSemantica/practica03/Servidores/films-project 
    nest build

  Publicamos la aplicación con deta

    deta new --node
  
  ![Deta New](/practica04/images/detaNew.png)

  Hacemos deploy del proyecto.

    deta deploy
  
  Activamos los logs de la aplicación.

    deta visor enable

  Desde la plataforma (*https://web.deta.sh/home/danielpuliche/default/micros/films-project*) obtenemos la url del servicio, que para este caso es: *https://fy4jvl.deta.dev/*.

  Si realizamos la petición GET al servicio obtenemos su respuesta.

  ![Petición GET](/practica04/images/getRequest.png)

2. Conectar a una base de datos

  Para esta parte, se hará uso de la librería TypeORM y se trabajará con MongoDB, base de datos no relacional.

  Dentro de la plataforme de MongoDB se crea un cluster gratuito con AWS como proveedor de infraestructura. También, nos pedirá crear un usuario con contraseña.

  ![Creación de usuario](/practica04/images/createUser.png)

  Además, es necesario permitir el acceso desde cualquier dirección IP para facilitar la conexión en esta práctica.

  Una vez creada la base de datos, instalamos las dependencias de TypeORM y MongoDB.

    npm install --save @nestjs/typeorm typeorm mongodb

  ![Instalación de dependencias](/practica04/images/dependenciesInstall.png)

  Copiamos la URL de conexión desde MongoDB atlas y la asignamos en el archivo `src/app.module.ts`.

  ```ts
  import { Module } from '@nestjs/common';
  import { FilmService } from './films/domain/services/film.service';
  import { FilmsController } from './films/adapters/controllers/films.controller';
  import { AuthModule } from './auth/auth.module';
  import { UsersModule } from './users/users.module';
  import { TypeOrmModule } from '@nestjs/typeorm';

  @Module({
    imports: [
      AuthModule, 
      UsersModule,
      TypeOrmModule.forRoot({
        type: 'mongodb',
        url: 'mongodb+srv://daniel:pass123@filmscluster.yojwcvu.mongodb.net/?retryWrites=true&w=majority'
      })
    ],
    controllers: [FilmsController],
    providers: [FilmService],
  })

  export class AppModule {}
  ```

  Se crea el archivo `film.entity.ts` en el folder `src/films/domain/entities`.

  ```ts
  import { Entity, Column, ObjectIdColumn } from 'typeorm';

  @Entity()
  export class FilmEntity {
    @ObjectIdColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    genre: string;

    @Column()
    runningTime: number;

    @Column()
    releaseYear: number;
  }
  ```

  Modificamos nuevamente el modulo.

  ```ts
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
  ```
  
  Modificamos el servicio creado en la practica anterior.

  ```ts
  import { Injectable } from '@nestjs/common';
  import { FilmEntity } from '../entities/film.entity';
  import { Film } from '../models/film.model';
  import { InjectRepository} from '@nestjs/typeorm';
  import { MongoRepository} from 'typeorm';

  @Injectable()
  export class FilmService {
  constructor(
    @InjectRepository(FilmEntity)
    private repository: MongoRepository<FilmEntity>
  ) {}

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

  Se cambia el uso del modelo `Film` por la entidad `FilmEntity` en servicios y controladores. Además, se modifica el servicio para que utilice el repositorio.

  ```ts
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
  ```

  Ejecutando `npm run start:dev` realizamos una petición POST y una petición GET para verificar su funcionamiento.

  ![Post](/practica04/images/post.png)

  ![Get](/practica04/images/get.png)