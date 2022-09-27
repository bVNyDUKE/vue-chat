# Simple Websocket Chat

## Deployment

### Local

Client:
```
cd client
npm install
npm run dev
```

Server:
Copy and edit the example env file with your database url and secret
```
cd server
cp .env.example .env
npm install
npm run watch
```

### Docker

```
docker build --build-arg DATABASE_URL=<database-url> -t <your-tag> .
docker run --env DATABASE_URL=<database-url> --env secret=<secret> --env PORT=<port> -p <port>:<port> -t <your-tag>
```

### Railway

- Fork this repo
- Set up a railway postgres/mysql instance
- Link your fork to railway
- Set up the secret and port env variables
- Initiate deployment

## TODO:
- [ ] Add logging
- [ ] Improve error handling
