FROM node:latest AS builder

WORKDIR /var/www/budget-app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:alpine AS vue

COPY --from=builder /var/www/budget-app/dist /usr/share/nginx/html

EXPOSE 80


FROM node:alpine AS node

WORKDIR /var/www/budget-app

COPY package*.json ./
RUN npm ci --production

COPY --from=builder /var/www/budget-app/server ./server
COPY --from=builder /var/www/budget-app/app.mjs /var/www/budget-app/schema.graphql ./
RUN mkdir tmp

EXPOSE 9000
EXPOSE 9001

CMD ["npm", "start"]
