FROM node:18-alpine AS build

WORKDIR /app

ARG VITE_API_MAP_DEV
ARG VITE_API_HOST

ENV VITE_API_MAP_DEV=$VITE_API_MAP_DEV
ENV VITE_API_HOST=$VITE_API_HOST

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]