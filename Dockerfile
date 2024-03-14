FROM node:16-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# Set the PORT environment variable to 8888
ENV PORT 8888

EXPOSE 8888

CMD ["node", "index.js"]
