FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=5000
ENV MONGO_URL=mongodb://warehouse-mongodb:27017/warehouse

EXPOSE 5000

CMD ["npm", "start"]
