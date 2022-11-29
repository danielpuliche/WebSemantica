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

    