FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8080

RUN npm run migrate
CMD [ "npm", "run", "server" ]