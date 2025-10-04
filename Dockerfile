FROM node:18

WORKDIR /

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000


RUN npm install -g nodemon


CMD ["nodemon", "app.js"]

