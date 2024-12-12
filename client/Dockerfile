FROM node:18-alpine AS build

WORKDIR /app

# Define arguments
ARG VITE_API_URL

# Set them as environment variables so Vite can pick them up
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .

# Run build, Vite will read ENV variables starting with VITE_
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]