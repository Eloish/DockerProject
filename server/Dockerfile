# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install    # install dependencies inside the container

COPY . .

CMD ["npm", "start"]
