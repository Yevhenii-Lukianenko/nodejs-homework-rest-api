FROM node:14.20.1

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "node", "server" ]