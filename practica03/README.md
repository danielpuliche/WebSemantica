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

2. Implementación de seguridad

	Se realizará una implementación de autenticación y autorización para acceder a los recursos del servidor.

	Para empezar, se realiza la instalación del paquete `@nestjs/passport` y `passport`.

		npm install --save @nestjs/passport passport passport-local
		npm install --save-dev @types/passport-local

	![Instalación de paquetes](/practica03/images/packagesInstall.png)

	Generamos el modulo de autenticación para empezar.

		nest g module auth
		nest g service auth

	![Modulo de autenticación](/practica03/images/authModule.png)

	Con esto, se nos genera la carpeta `auth` dentro de `src`, conteniendo 3 archivos, de los cuales solo utilizaremos `auth.module.ts` y `auth.service.ts`.

	Para la gestión de usuarios creamos un modulo como  hicimos antes.

		nest g module users
		nest g service users
	
	![Modulo de usuarios](/practica03/images/usersModule.png)

	Se empiezan a modificar cada uno de los códigos, empezamos por el servicio de usuarios.

	```typescript
	import { Injectable } from '@nestjs/common';

	export type User = {
		userId: number,
		username: string,
		password: string
	};

	@Injectable()
	export class UsersService {
		private readonly users: User[] = [
			{
				userId: 1,
				username: 'daniel',
				password: 'pass123',
			},
			{
				userId: 2,
				username: 'dan12',
				password: 'password123',
			},
		];

		async findOne(username: string): Promise<User | undefined> {
			return this.users.find(user => user.username === username);
		}
	}
	```
	En el archivo `user.module.ts` lo configuramos para que esté disponible para otros servicios.

	```typescript
	import { Module } from '@nestjs/common';
	import { UsersService } from './users.service';

	@Module({
		providers: [UsersService],
		exports: [UsersService], // Exporta el servicio
	})

	export class UsersModule {}
	```

	Para el servicio de autenticación modificamos el archivo `auth.service.ts`, este se maneja separado al servicio de usuario tal como se haría en una arquitectura de microservicios. Este, hace uso del modulo creado de usuarios, logrando usar el servicio de usuarios implementado previamente.

	```typescript
	import { Injectable } from '@nestjs/common';
	import { UsersService } from '../users/users.service';

	@Injectable()
	export class AuthService {
		constructor(private usersService: UsersService) { }

		async validateUser(username: string, pass: string): Promise<any> {
			const user = await this.usersService.findOne(username);
			if (user && user.password === pass) {
				const { password, ...result } = user;
				return result;
			}
			return null;
		}
	}
	```

	Del mismo modo, debemos modificar el modulo de autenticación para que este pueda hacer uso de los servicios del módulo de usuarios.

	```typescript
	import { Module } from '@nestjs/common';
	import { UsersModule } from 'src/users/users.module';
	import { AuthService } from './auth.service';

	@Module({
		providers: [AuthService],
		imports: [UsersModule]  // Importamos el modulo de usuarios
	})
	export class AuthModule {}

	```

	Ahora, necesitamos implementar una estrategía para la validación del usuario. Para ello, haremos uso del paquete `passport` instalado en un principio. Dentro de `src/auth` creamos el archivo `local.strategy.ts`.

	```typescript
	import { Strategy } from 'passport-local';
	import { PassportStrategy } from '@nestjs/passport';
	import { Injectable, UnauthorizedException } from '@nestjs/common';
	import { AuthService } from './auth.service';

	@Injectable()
	export class LocalStrategy extends PassportStrategy(Strategy) {
		constructor(private authService: AuthService) {
			super();
		}

		async validate(username: string, password: string): Promise<any> {
			const user = await this.authService.validateUser(username, password);
			if (!user) {
				throw new UnauthorizedException();
			}
			return user;
		}
	}
	```

	Una vez mas, debemos modificar el archivo `auth.module.ts` para poder hacer uso de la estrategía implementada.

	```typescript
	import { Module } from '@nestjs/common';
	import { PassportModule } from '@nestjs/passport';
	import { UsersModule } from 'src/users/users.module';
	import { AuthService } from './auth.service';
	import { LocalStrategy } from './local.strategy';

	@Module({
		providers: [AuthService, LocalStrategy],
		imports: [UsersModule, PassportModule]
	})

	export class AuthModule {}
	```

	Con esto, ahora si procedemos a proteger los endpoints creados anteriormente en el controlador. Para ello, debemos adicionar la siguiente anotación antes de las anotaciones correspondientes a cada solicitud HTTP que deseemos bloquear para que sea solo accedida por un usuario autenticado.

	```typescript
	@UseGuards(AuthGuard('local'))
	```

	Para añadirla es necesario importar algunas librerías, las cuales vscode en automático añadió.

	Si deseamos acceder a ello es necesario que añadamos las credenciales de usuario en la petición que realicemos, tal como se ve a continuación.

	![Post autenticado](/practica03/images/authenticatedPost.png)

	El problema es usarlo de esta manera, es que la película añadida incluirá estos campos y será visible, haciendo vulnerable el sistema.

	![Vulnerabilidad al crear película](/practica03/images/vulnerability.png)

