# rita-http
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/educorvi/rita-http)](https://github.com/educorvi/rita-http/releases/latest)
[![CI](https://github.com/educorvi/rita-http/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/educorvi/rita-http/actions/workflows/main.yml)
## Prerequisites
This project uses [Yarn](https://yarnpkg.com/getting-started/install) as package manager.

## Install
### Build from source
#### Clone the repository
```bash
git clone https://github.com/educorvi/rita-http.git
cd rita-http
git checkout main
```

#### Install dependencies
`yarn install`

#### Build
`yarn build`

## Setup

### Basic settings 
`cp .env.template .env`

Edit `.env` to your liking.

### Application settings
`node . --config`

## Run the application
`node .`

## Docker Compose
An example for usage with docker-compose can be found in the folder `docker-deploy`.
### Usage
```bash
# Generate secure MYSQL password
# alternatively copy docker-deploy-example/.env.template to docker-deploy-example/.env and fill it by hand
echo MYSQL_PASSWORD=$(openssl rand -base64 20) | tee docker-deploy-example/.env

# Start containers
docker-compose -f docker-deploy-example/docker-compose.yaml up -d

# Edit application settings if necessary
docker exec -it rita-http /bin/sh
node . --config 

```


---

More information can be found [in the wiki](https://github.com/educorvi/rita-http/wiki/Rita-HTTP).
