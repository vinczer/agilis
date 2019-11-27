# Deployment

## First things first, run the server:

- Server code can be found in ./server folder

### Prerequisites

- NodeJS installed

- MongoDB running on port 27017 (https://hub.docker.com/_/mongo), example docker command:

       docker run --name mongodb -p 27017:27017 -d mongo

- Init modules
  npm i

- Open port 3000 if it's closed

### Run server

    node index

### If the server succesfully started on localhost, it writes the following logs:

    > Server running at http://localhost:3000/
    > Connected to MongoDB.

## After the server is running, run the client:

- Client code can be found in ./client folder

- Edit ./client/assets/config.js, change localhost to your server's address:

        SERVER_HOST = 'localhost';

- Run locally:

  - Open index.html

- Or host the content of ./client/src on your website

# SCREEN DESIGNS

## Gomoku game icon

![Image](https://cdn.discordapp.com/attachments/628850179554148353/630851503887745057/amoba_logo_hatterrel.jpg)

## Torpedo game

![Image](https://media.discordapp.net/attachments/628850179554148353/630850878869340160/torpedo_logo_hatterrel.jpg?width=676&height=676)

.
