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