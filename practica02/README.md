# Práctica 02: Creando un servidor REST

Primera implementación de un Servidor Web, haciendo uso del protocolo de *__Transferencia de Estado Representacional (REST)__*.

---

## Desarrollo de la práctica

A continuación se presentan los pasos realizados durante el desarrollo de la práctica:

1. Instalar `NodeJS` y `NestJS`

    Actualizamos los paquetes de aptitude e instalamos `NodeJS`.

        sudo apt-get update && sudo apt-get install nodejs -y

    ![Actualizar paquetes e instalar nodejs](/practica02/images/installNode.png)

    Nos aseguramos ahora de actualizar `NodeJS` a su última versión.

        sudo npm cache clean -f
        sudo npm install -g n
        sudo n stable

    ![Actualizar NodeJS](/practica02/images/updateNode.png)

    Validamos las versiones instaladas de `NodeJS` y el gestor de paquetes `npm`.

        node -v
        npm -v

    ![Validar versiones](/practica02/images/versions.png)

    Creamos un espacio para los recursos globales en `NodeJS`.

        cd
        mkdir ~/.npm-global
        npm config set prefix '~/.npm-global'
        echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.zshrc
        source ~/.zshrc

    ![Instalación de NestJs](/practica02/images/globalResourcesNode.png)

    Ahora, instalamos `NestJS`.

        npm i -g @nestjs/cli
        source ~/.zshrc

    ![Instalación de NestJs](/practica02/images/installNest.png)

2. Ejecutar el ejemplo Hello World

    Creamos la carpeta donde se alojará el proyecto.

        mkdir Servidores
        cd ./Servidores

    ![Carpeta del proyecto](/practica02/images/projectFolder.png)

    Creamos el proyecto con NestJS. Seleccionamos el gestor de paquetes `npm` para la instalación.

        nest new practica_02

    ![Creación de proyecto con Nest](/practica02/images/nestProject.png)

    Ejecutamos el ejemplo Hello World.

        cd practica_02
        npm run star:dev

    ![Ejecutar Hello World 1](/practica02/images/startHelloWorld.png)
    ![Ejemplo en ejecución](/practica02/images/runningHelloWorld.png)

    Para verificar el funcionamiento del servidor y saber que puerto está usando usamos el siguiente comando.
    
        netstat -tulpn | grep node

    ![Visualizar puerto de escucha servidor](/practica02/images/portCommand.png)

    Ahora, podemos realizar una petición GET al servidor por medio de `curl`.

        curl http://localhost:3000

    ![Petición GET al servidor](/practica02/images/curl.png)

    De igual modo, podemos visualizar el funcionamiento con un gestor de solicitudes HTTP como Postman o la extensión Thunder Client en VsCode.

    ![Petición con Thunder Client](/practica02/images/getRequest.png)

3. Publicando el código en GitHub

    Si estás el leyendo esto ya está publicado :D

4. Los verbos HTTP

    Primeramente accedemos al archivo *app.controller.ts*. Dentro de este código podemos encontrar una función precedida por la anotación *'@Get'*, la cual actuará una vez el servidor reciba una solicitud *GET*.

    ![Script controller inicial](/practica02/images/script1.png)

    Podemos editar la función para que funcione como deseamos. En este caso, cambiaremos el mensaje de retorno.

    ![Nuevo Hola mundo](/practica02/images/script2.png)

    Si realizamos una petición 'GET' al servidor podemos ver los cambios. En este caso la realizaremos con el navegador para observar el cambio.

    ![Petición al navegador](/practica02/images/browserRequest.png)

    Ahora, realizamos la edición de ala función para que esta funcione con una variable externa a la función.

    ![Peticion GET con variable externa](/practica02/images/script3.png)

    Su respuesta sería.

    ![Petición GET con variable externa](/practica02/images/browserRequest2.png)

    Para añadir una petición *POST* hacemos uso de la anotación *'@Post'* para crear una función que responda a estas peticiones. En este caso, crearemos una función que reciba un *nombre* y genere un mensaje personalizado.

    ![Petición POST](/practica02/images/script4.png)

    Para realizar esta petición hacemos uso de Thunder Client. En este realizamos la petición a la dirección *http://localhost:3000/'name'*.

    ![Petición POST con Thunder Client](/practica02/images/postRequest.png)

5. Hacer caso de ejemplo

    Para este punto se realizará un ejemplo como práctica de los temas tratados, haciendo uso de las anotaciones *@Put(), @Delete(), @Patch(), @Post() y @Get()*. 

    El caso de ejemplo a usar será una base de datos de películas, donde para cada una se tendrán los campos:

    - Nombre
    - Genero
    - Duración de la película (minutos)
    - Año de lanzamiento
    
    Lo primero a realizar fue crear el controlador para las películas por medio del siguiente comando en CLI:

        nest g controller films

    Este nos creará una carpeta con el nombre *`films`*, dentro de la cual se tienen 2 archivos, `films.controller.spec.ts` y `films.controller.ts`. El archivo a editar será este último.

    Dentro de este lo primero será hacer la creación de la clase o interfaz **_`Film`_**.

    ![Interfaz Film](/practica02/images/filmInterface.png)

    Para la clase **_FilmsController_** en su decorador definimos la ruta inicial como *`films`*, de modo que todas las funciones a las que se acceda por medio de este controlador deban realizarse a *http://localhost:3000/films* como ruta raíz.

    Dentro de esta clase lo primero será añadir un array *`films`* para que en este se almacenen todos los objetos de tipo *Film*. En este declaramos inicialmente una película.

    Las peticiones que se encuentran dentro de este controlador son:

    1. getFilms() - @GET():

        Esta función retorna todas las películas al hacer una petición `GET` a la dirección *http://localhost:3000/films*.

        ![GET FILMS](/practica02/images/getFilms.png)

    2. createFilm(film) - @POST("create")

        Esta función recibe un objeto de tipo *`Film`* dentro del cuerpo de la petición, y añade este objeto al array *`films`*. Actúa cuando se realiza una petición `POST` a la dirección *http://localhost:3000/films/create*.

        ![CREATE FILM](/practica02/images/createFilm.png)

    3. updateFilm(film, id) - @PUT("update/:id")

        Esta función recibe un objeto de tipo *`Film`* dentro del cuerpo de la petición y el `id` de la película en la `URL` de la petición, y actualiza esta película dentro del array *`films`*. Actúa cuando se realiza una petición `PUT` a la dirección *http://localhost:3000/films/update/:id* con `:id` como el *id* de la película a actualizar.

        ![UPDATE FILM](/practica02/images/updateFilm.png)

    4. deleteFilm(id) - @DELETE("delete/:id")

        Esta función recibe el *`id`* de la peĺicula en el `URL` de la petición y la elimina del array *`films`*. La función se ejecuta al hacer una petición `DELETE` a la dirección *http://localhost:3000/films/delete/:id* con `:id` como el *id* de la película a eliminar.

        ![DALETE FILM](/practica02/images/deleteFilm.png)

    5. updateName(id, name) - @PUT("update/:id")

        Esta función recibe un objeto con el campo *`name`* dentro del cuerpo de la petición y el `id` de la película en la `URL` de la petición, y actualiza el nombre de la película dentro del array *`films`*. Actúa cuando se realiza una petición `PATCH` a la dirección *http://localhost:3000/films/update/:id/name* con `:id` como el *id* de la película a actualizar.

        ![UPDATE NAME FILM](/practica02/images/updateName.png)
