FROM node:16.13.0
LABEL maintainer="Flagbase Team <hello@flagbase.com>"

RUN npx create-docusaurus@2.0.0-beta.9 docusaurus classic --typescript

WORKDIR docusaurus

RUN yarn add @docusaurus/plugin-content-docs@2.0.0-beta.9
RUN yarn add redocusaurus@0.5.0

RUN rm ./src/pages/index.tsx

EXPOSE 3000/tcp
