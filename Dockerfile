FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.lock ./
RUN npm install
COPY . .
CMD ["npm", "start"]
