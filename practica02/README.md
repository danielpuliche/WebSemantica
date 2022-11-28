# Práctica 02: Creando un servidor REST

Primera implementación de un Servidor Web, haciendo uso del protocolo de *__Transferencia de Estado Representacional (REST)__*.

---

## Desarrollo de la práctica

A continuación se presentan los pasos realizados durante el desarrollo de la práctica:

1. Instalar NodeJS y NestJS

    Actualizamos los paquetes de aptitude e instalamos nodejs.

        sudo apt-get update && sudo apt-get install nodejs -y

    ![Actualizar paquetes e instalar nodejs](/practica02/images/installNode.png)

    Nos aseguramos ahora de actualizar nodejs a su última versión.

        sudo npm cache clean -f
        sudo npm install -g n
        sudo n stable

    ![Actualizar NodeJS](/practica02/images/updateNode.png)

    Validamos las versiones instaladas de NodeJS y el gestor de paquetes npm.

        node -v
        npm -v

    ![Validar versiones](/practica02/images/versions.png)

    Creamos un espacio para los recursos globales en NodeJS.

        cd
        mkdir ~/.npm-global
        npm config set prefix '~/.npm-global'
        echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.zshrc
        source ~/.zshrc

    ![Instalación de NestJs](/practica02/images/globalResourcesNode.png)

    Ahora, instalamos NestJS.

        npm i -g @nestjs/cli
        source ~/.zshrc

    ![Instalación de NestJs](/practica02/images/installNest.png)
