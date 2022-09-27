FROM node:18-alpine AS build-stage

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/client

RUN npm ci

RUN npm run build

FROM node:18-alpine

ARG DATABASE_URL

EXPOSE 8000

COPY --from=build-stage /usr/src/app/server /usr/src/app

WORKDIR /usr/src/app

RUN npm ci
RUN npx prisma generate

CMD ["npm", "run", "start"]



