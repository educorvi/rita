FROM node:lts-alpine

RUN apk add git

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY postInstall.js .
RUN yarn install

COPY src src
COPY tsoa.json .
COPY tsconfig.json .
COPY webpack.config.js .

RUN yarn build

COPY test test

CMD /wait && node .
