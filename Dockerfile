FROM node:16-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install typescript -g
RUN tsc

EXPOSE 8080

CMD ["node", "dist/index.js"]
