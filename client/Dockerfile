FROM docker.io/nginx:alpine

# Clean the default Nginx HTML directory
RUN rm -rf /usr/share/nginx/html/*

# Copy the pre-built dist folder into the Nginx directory
COPY dist /usr/share/nginx/html

# Copy .env if required for runtime (e.g., dynamic configuration)
COPY .env /usr/share/nginx/html/.env

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
