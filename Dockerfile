FROM node

WORKDIR /var/www/budget-app

# install deps
COPY package*.json ./
RUN npm install

# setup workdir
COPY . .

# run
## Vue Client
EXPOSE 80
## Node GraphQL
EXPOSE 9000
CMD ["npm", "start"]
