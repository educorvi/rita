FROM node:16-alpine as build

WORKDIR /app
RUN corepack enable
COPY . .
RUN node common/scripts/install-run-rush.js install
RUN node common/scripts/install-run-rush.js build --to-except rita-http
WORKDIR /app/rita-http
RUN pnpm pack
RUN tar zxvf rita-http-*.tgz


FROM node:lts-alpine as prod
RUN apk add git

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

WORKDIR /app

COPY --from=build /app/rita-http/package/package.json .

RUN npm install --omit=dev

COPY --from=build /app/rita-http/package/dist dist
COPY --from=build /app/rita-http/docs docs

CMD /wait && node .
