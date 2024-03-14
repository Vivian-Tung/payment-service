FROM node:16-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8888

CMD ["node", "index.js"]
