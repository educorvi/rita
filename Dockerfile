FROM node:18-alpine AS build

WORKDIR /app
RUN apk add jq moreutils
RUN corepack enable
RUN npm install -g @microsoft/rush
COPY . .
RUN jq '.buildCacheEnabled = false' common/config/rush/build-cache.json | sponge common/config/rush/build-cache.json
RUN rush update
RUN rush build --to-except rita-http
WORKDIR /app/rita-http
RUN rush-pnpm pack
RUN tar zxvf rita-http-*.tgz


FROM node:18-alpine AS prod
RUN apk add git

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

WORKDIR /app

COPY --from=build /app/rita-http/package/package.json .

RUN npm install --omit=dev

COPY --from=build /app/rita-http/package/dist dist
COPY --from=build /app/rita-http/docs docs

CMD /wait && node .
