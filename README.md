###Air Quality Index information.

Aplicacion separada en capas Frontend y Backend para la mostrar la informaci�n del �ndice 
de calidad del aire en una ciudad seleccionada a trav�s de un input en la vista.

Se tiene configurado un contenedor Docker para desplegar tanto el frontend como el 
backend por separado.

####Tecnolog�as utilizadas:

* Angular 1.6
* ExpressJS
* Gulp
* NodeJs
* Docker
* JsDoc

####Instalaci�n
Clonar este repo e instalar las dependencias de node:

    $ git clone https://github.com/keybeth/aqi
    $ cd aqi/backend
    $ npm install
    $ cd ../frontend
    $ npm install

####Scripts

En la carpeta **frontend**

* `gulp build` - Armar bundle

* `gulp serve` - Para correr servidor de prueba

* `docker build -t MiNombre` - Crear contenedor

* `docker run MiNombre` - Correr contenedor  
	
	
En la carpeta **backend**

* `nodemon ./server.js` - Para correr servidor de prueba

* `docker build -t MiNombre` - Crear contenedor

* `docker run MiNombre` - Correr contenedor 
	

