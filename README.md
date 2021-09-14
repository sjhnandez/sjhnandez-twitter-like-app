# Twitter-like app

Estre proyecto tiene las siguientes funcionalidades:

- Página inicial (Assignment 01)
- Iniciar session
- Cerrar session
- Crear una cuenta
- Confirmar email
- Recuperar contraseña
- Validación de Correo
- Crear Tweet
- Limitar tweet con 240 caracteres
- Borrar un Tweet
- Seguir a un usuario
- Timeline twwets propios + tweets de los usuarios que sigues + retweets
- Listar followers
- Listar following
- Dar "me gusta" a un tweet(Likes)
- Contar y mostrar el numero de "me gusta"(likes) en un tweet
- Retwittear un tweet
- Contar y mostrar el numero de retweets en un tweet
- Citar (Quote) retweet
- Tweet con imagenes
- Enviar un mensaje directo a usuarios que te siguen
- Hashtags, se crean con # y generan un link, el cual si le das click, te despliega todos los tweets que incluyan ese hashtag
- Buscador
- Menciones @username

# Tests

- Test funcionalidad - crear tweet
- Test funcionalidad - eliminar tweet
- Test funcionalidad - listar tweets
- Test validaciones de la clase tweet
- Test associaciones de la clase tweet
- Test funcionalidad - Seguir a un usuario
- Test funcionalidad - Timeline twwets propios + tweets de los usuarios que sigues
- Test funcionalidad - Listar followers
- Test funcionalidad - Listar following

# Bonus

- Photo de perfil del usuario
- Información de la cuenta del usuario
- Contar caracteres
- 2FA (La confirmación será por correo electronico para facilitar la comunicación)
- Notificacion al correo cada vez que alguien siga al usuario 0.5

### Framework

Para desarrollar la aplicación se usó:

- React para el frontend
- Ruby on rails 6 para el backend

### Installation

Para correr el proyecto debe clonar el repositorio

```sh
$ git clonehttps://github.com/Departamento-de-sistemas-Uninorte/todoapp-hernandez-zapata.git
$ cd todoapp-hernandez-zapata

```

Luego de eso se deben instalar las dependencias

```sh
$ bundle install
$ yarn install
$ rails db:create db:migrate db:seed
```

Para correr la aplicación localmente se debe ejecutar en dos consolas:

```sh
$ rails server
$ ./bin/webpack-dev-server
```

### Datos a tener en cuenta

- Para usar la funcionalidad del mensaje de texto, debemos tener que primero hacer una confirmación para poder usar twilio, pues la cuenta trial no deja enviar mensajes a numeros no verificados
- se limitó a 240 caracteres
- Link para visitar la página: https://sjhnandez-twitter-like-app.herokuapp.com/
