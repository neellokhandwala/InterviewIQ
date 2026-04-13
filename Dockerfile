FROM node:20 AS build

WORKDIR /app

COPY Frontend/package*.json ./
RUN npm install

COPY Frontend ./

RUN echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2VudHJhbC1tdXNrb3gtOTguY2xlcmsuYWNjb3VudHMuZGV2JA" > .env

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]