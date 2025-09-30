FROM node:18

WORKDIR /

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

# Optional: Install nodemon globally
RUN npm install -g nodemon

# Use nodemon for development
CMD ["nodemon", "app.js"]

