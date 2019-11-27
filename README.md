# Run server

## Prerequisites

 - NodeJS installed
 - MongoDB running (https://hub.docker.com/_/mongo)

        docker run --name mongodb -p 27017:27017 -d mongo

## Init modules

    npm i

## Run command

    node index

### The Server is listening at http://localhost:3000/

# API

## /login

 - ### request have to contain the username, i.e.:
    
        { "username": "john" }

 - ### in case of succesful login, response contains an id for authentication later on:

        {
            "success": true,
            "id": "5d926d389d590407544978b8",
            "msg": "Player added to database!"
        }

## /logout

 - ### request <u>header</u> have to contain the user id:
    
        { "id": "5d926d389d590407544978b8" }

 - ### response, if logout was successful:
    
        {
            "success": true,
            "msg": "Player logged out!"
        }
        
## /games
 - ### response
   
        {
            "success": true,
            "games": { id: 5d926d389d590407544978b8, name: "Amoba" }
        }
        
 ## /lobbies
 - ### response
   
        {
            "success": true,
            "games": { id: 5d926d389d590407544978b8, name: "Amoba", playerName: "John" }
        }

# SCREEN DESIGNS
## Gomoku game icon
![Image](https://cdn.discordapp.com/attachments/628850179554148353/630851503887745057/amoba_logo_hatterrel.jpg)
## Torpedo game
![Image](https://media.discordapp.net/attachments/628850179554148353/630850878869340160/torpedo_logo_hatterrel.jpg?width=676&height=676)

.