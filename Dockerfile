FROM node:latest
WORKDIR /app-api
ADD package*.json ./
RUN npm install
ADD . .
EXPOSE 3000
CMD ["npm", "start"]