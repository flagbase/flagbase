FROM node:14.15
LABEL maintainer="Flagbase Team <hello@flagbase.com>"

RUN apt-get update && apt-get -y install rsync

WORKDIR /app
RUN npx @docusaurus/init@^2.0.0-alpha.56 init flagbase classic
WORKDIR /app/flagbase
COPY ./_app_/. .

RUN npm install --verbose


EXPOSE 3000/tcp
