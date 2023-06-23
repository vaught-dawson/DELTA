FROM node:18-alpine

WORKDIR /app
COPY . /app
COPY .env /app

RUN npm install

CMD ["npm", "run", "start"]