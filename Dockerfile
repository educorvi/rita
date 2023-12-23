FROM node:18-alpine as build

WORKDIR /app
RUN corepack enable
RUN npm install -g @microsoft/rush
COPY . .
RUN rush update
RUN rush build --to-except rita-http
WORKDIR /app/rita-http
RUN rush-pnpm pack
RUN tar zxvf rita-http-*.tgz


FROM node:18-alpine as prod
RUN apk add git

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

WORKDIR /app

COPY --from=build /app/rita-http/package/package.json .

RUN npm install --omit=dev

COPY --from=build /app/rita-http/package/dist dist
COPY --from=build /app/rita-http/docs docs

CMD /wait && node .
