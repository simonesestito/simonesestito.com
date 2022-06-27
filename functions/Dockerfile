FROM node:16.9.1-alpine3.14
WORKDIR /app

ADD package.json .
ADD package-lock.json .
RUN npm install --only production

ADD . .
ENTRYPOINT [ "node", "." ]