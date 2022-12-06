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
	
		sudo apt-get update

	![Actualizar paquetes](/practica01/images/update.png)

	Ahora, instalamos unos paquetes para permitir a *apt* usar paquetes a través de HTTPS.

		sudo apt install apt-transport-https ca-certificates curl software-properties-common

	![Instalación de paquetes](/practica01/images/libs.png)

	Añadimos la clave GPG del repositorio oficial de Docker.

		curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

	![Clave GPG repositorio Docker](/practica01/images/GPG.png)

	Agregamos el repositorio a las fuentes de APT.

		sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

	![Añadir el repositorio a APT](/practica01/images/APT.png)

	Actualizamos con los paquetes de Docker recién agregados.

		sudo apt update

	![Actualizar paquetes con repositorios de Docker](/practica01/images/update2.png)

	Con el siguiente comando nos aseguramos que se realizará la instalación desde el repositorio de Docker.

		apt-cache policy docker-ce

	Ahora procedemos a instalar Docker.

		sudo apt install docker-ce

	![Instalar Docker](/practica01/images/install.png)

3. Reconocimiento de herramientas de red:

	Por medio del siguiente observamos la configuración de red.

		ifconfig

	![Configuración de red](/practica01/images/ifconfig.png)

	En caso de querer conocer las direcciones IP internas podemos usar el siguiente comando.

		ip a

	![Comando IP a](/practica01/images/ipa.png)

	Para concer la dirección de la Gateway por defecto usamos el comando:

		ip r

	![Comando IP r](/practica01/images/ipr.png)

	Para conocer los puertos ocupados dentro del sistema podemos usar el comando *ss*. Con este comando se pueden ver las direcciones y puertos, locales y de destino de cada servicio.

		ss

	![Comando SS](/practica01/images/ss.png)

	Con el comando *netstat -a* podemos obtener información similar.

		netstat -a

	![Netstat](/practica01/images/netstat.png)

	Para información detallada hacemos uso del comando *lsof*.

		lsof

	![LSOF](/practica01/images/lsof.png)

4. Identificar servicios desplegados:

	Con el uso del comando `netstat -tulp` filtramos los servicios desplegados en el momento. Con el fin de obtener servicios ejecuto algunas aplicaciones y realizo la captura.

	![Servicios](/practica01/images/services.png)

	Entre los serviciones que se pueden identificar tenemos:

	- **Postgresql**: Trabaja con el protocolo TCP, con la dirección local: *localhost:postgresql*.
	- **Spotify**: Trabaja con el protocolo UDP y TCP en diferentes puertos, uno de ellos es 56429, para UDP
	- **Thunderbird**: Trabaj con el protocolo UDP, con puertos 37921 y 41875.
	- **SSH**: Trabaja con el protocolo TCP y TCP6, con la dirección local: *0.0.0.0:ssh*.
	- **Chrome**: Trabaja con el protocolo UDP, con la dirección local: *224.0.0.251:mdns*.

5. Evaluar scripts de Python:

	Se realiza una comparación entre realizar un servidor con TCP y un servidor con UDP.

   1. Servidor TCP:

		Esta primera parte se compone de 2 scripts, `socket_echo_server.py` para la creación y activación del servidor, y `socket_echo_client.py` para el cliente. 

		- `socket_echo_server.py`

			```Python
			import socket
			import sys

			# Create a TCP/IP socket
			sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

			# Bind the socket to the port
			server_address = ("localhost", 10000)
			print("starting up on {} port {}".format(*server_address))
			sock.bind(server_address)

			# Listen for incoming connections
			sock.listen(1)

			while True:
				# Wait for a connection
				print("waiting for a connection")
				connection, client_address = sock.accept()
				try:
					print("connection from", client_address)

					# Receive the data in small chunks and retransmit it
					while True:
						data = connection.recv(16)
						print("received {!r}".format(data))
						if data:
							print("sending data back to the client")
							connection.sendall(data)
						else:
							print("no data from", client_address)
							break

				finally:
					# Clean up the connection
					connection.close()
			```

		- `socket_echo_client.py`

			```py
			import socket
			import sys

			# Create a TCP/IP socket
			sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

			# Connect the socket to the port where the server is listening
			server_address = ('localhost', 10000)
			print('connecting to {} port {}'.format(*server_address))
			sock.connect(server_address)

			try:

				# Send data
				message = b'This is the message.  It will be repeated.'
				print('sending {!r}'.format(message))
				sock.sendall(message)

				# Look for the response
				amount_received = 0
				amount_expected = len(message)

				while amount_received < amount_expected:
					data = sock.recv(16)
					amount_received += len(data)
					print('received {!r}'.format(data))

			finally:
				print('closing socket')
				sock.close()
			```

		Ejecutando primeramente el servidor en una terminal, y seguidamente el cliente en otra terminal en paralelo, podemos observar su correcto funcionamiento.

		![Terminal conexión TCP](/practica01/images/tcpTerminal.png)
		
		Por medio del comando `netstat -tulpn` podemos ver el puerto que está siendo ocupado, y confirmar que se usa el puerto `1000` configurado en código.

		![Netstat TCP](/practica01/images/netstatTCP.png)

   2. Servidor UDP:

		Esta segunda parte se compone de 2 scripts, `socket_echo_server_dgram.py` para la creación y activación del servidor, y `socket_echo_client_dgram.py` para el cliente. 

		- `socket_echo_server_dgram.py`

			```py
			import socket
			import sys

			# Create a UDP socket
			sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

			# Bind the socket to the port
			server_address = ("localhost", 10000)
			print("starting up on {} port {}".format(*server_address))
			sock.bind(server_address)

			while True:
				print("\nwaiting to receive message")
				data, address = sock.recvfrom(4096)

				print("received {} bytes from {}".format(len(data), address))
				print(data)

				if data:
					sent = sock.sendto(data, address)
					print("sent {} bytes back to {}".format(sent, address))
			```

		- `socket_echo_client_dgram.py`

			```py
			import socket
			import sys

			# Create a UDP socket
			sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

			server_address = ('localhost', 10000)
			message = b'This is the message.  It will be repeated.'

			try:

				# Send data
				print('sending {!r}'.format(message))
				sent = sock.sendto(message, server_address)

				# Receive response
				print('waiting to receive')
				data, server = sock.recvfrom(4096)
				print('received {!r}'.format(data))

			finally:
				print('closing socket')
				sock.close()
			```

		Ejecutando primeramente el servidor en una terminal, y seguidamente el cliente en otra terminal en paralelo, podemos observar su correcto funcionamiento.

		![Terminal conexión UDP](/practica01/images/udpTerminal.png)
		
		Por medio del comando `netstat -tulpn` podemos ver el puerto que está siendo ocupado, y confirmar que se usa el puerto `1000` configurado en código.

		![Netstat TCP](/practica01/images/netstatUDP.png)

	La ventaja que ofrece el uso de un servidor TCP radica en la seguridad de recibir los datos completos, debido a que este se asegura de mantener una conexión activa, enviar los paquetes en orden y asegurarse de que estos lleguen. En cambio, UDP no ofrece esto, no ofrece la seguridad de una conexión segura, de que los datos lleguen en orden y lleguen completos, mas sin embargo, ofrece velocidad ya que solamente el servidor espera una solicitud y envía los datos sin tanto proceso intermediario. Dependiendo del tipo de aplicación y servicio que queramos prestar podemos elegir uno entre otro.