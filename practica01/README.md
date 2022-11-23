# Práctica 01: Configuración de entorno y red

Para el desarrollo de las prácticas consiguientes es necesario la configuración del ambiente de trabajo y la comprensión de conceptos básicos de la red.

---

## Desarrollo de la práctica

A continuación se presentan los pasos realizados durante el desarrollo de la práctica.

1. Configuración del entorno:

    Se debe configurar el espacio de trabajo que se utilizará para el desarrollo de las prácticas, este espacio debe poseer la imagen virtualizada de Linux.

    En mi caso, hago uso de mi pc con Ubuntu 20.04.

    ![Distribución de mi PC](/practica01/images/distro.png)

2. Instalación de DOCKER:

    Para empezar realizamos una actualización de paquetes. 
    
    >`sudo apt-get update`

    ![Actualizar paquetes](/practica01/images/update.png)

    Ahora, instalamos unos paquetes para permitir a *apt* usar paquetes a través de HTTPS.

    >`sudo apt install apt-transport-https ca-certificates curl software-properties-common`

    ![Instalación de paquetes](/practica01/images/libs.png)

    Añadimos la clave GPG del repositorio oficial de Docker.

    >`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`

    ![Clave GPG repositorio Docker](/practica01/images/GPG.png)

    Agregamos el repositorio a las fuentes de APT.

    >`sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"`

    ![Añadir el repositorio a APT](/practica01/images/APT.png)

    Actualizamos con los paquetes de Docker recién agregados.

    >`sudo apt update`

    ![Actualizar paquetes con repositorios de Docker](/practica01/images/update2.png)

    Con el siguiente comando nos aseguramos que se realizará la instalación desde el repositorio de Docker.

    >`apt-cache policy docker-ce`

    Ahora procedemos a instalar Docker.

    >`sudo apt install docker-ce`

    ![Instalar Docker](/practica01/images/install.png)

3. Reconocimiento de herramientas de red:

    Por medio del siguiente observamos la configuración de red.

    >`ifconfig`

    ![Configuración de red](/practica01/images/ifconfig.png)

    En caso de querer conocer las direcciones IP internas podemos usar el siguiente comando.

    >`ip a`

    ![Comando IP a](/practica01/images/ipa.png)

    Para concer la dirección de la Gateway por defecto usamos el comando:

    >`ip r`

    ![Comando IP r](/practica01/images/ipr.png)

    Para conocer los puertos ocupados dentro del sistema podemos usar el comando *ss*. Con este comando se pueden ver las direcciones y puertos, locales y de destino de cada servicio.

    >`ss`

    ![Comando SS](/practica01/images/ss.png)

    Con el comando *netstat -a* podemos obtener información similar.

    >`netstat -a`

    ![Netstat](/practica01/images/netstat.png)

    Para información detallada hacemos uso del comando *lsof*.

    >`lsof`

    ![LSOF](/practica01/images/lsof.png)

4. Identificar servicios desplegados:

    

5. Evaluar scripts de Python:

