### traquer

Tracks award seats availability on ANA international routes and notifies you when there's an opening.

Written completely in Typescript and uses ts-node to run.

#### Requirements
- Docker & docker-compose
- Node JS (v18) & npm (v8)
- Postgres 14.5

#### Set Up

Get a copy of .env from [me](https://github.com/miraiakagawa).

```
$ npm install
$ docker-compose up
$ docker exec -it traquer-app-1 npm run migrate up
```
