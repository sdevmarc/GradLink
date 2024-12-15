# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Install required tools (cron and MongoDB tools)
RUN apk add --no-cache bash curl nano mongodb-tools busybox-suid busybox-extras

# Copy application files
COPY dist ./dist
COPY .env .env
COPY gradlink.json ./gradlink.json

# Copy backup and restore scripts
COPY backup.sh /usr/local/bin/backup.sh
COPY restore.sh /usr/local/bin/restore.sh
RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/restore.sh

# # Copy the rest of the application code to the container
# COPY . .

# # Copy the .env file to the container
# COPY .env .env

# # Build the application
# RUN npm run build

# # Install required tools (cron and MongoDB tools)
# RUN apk add --no-cache bash curl nano && \
#     apk add --no-cache mongodb-tools && \
#     apk add --no-cache busybox-suid && \
#     apk add --no-cache busybox-extras

# # Copy the backup script to the container
# COPY backup.sh /usr/local/bin/backup.sh
# RUN chmod +x /usr/local/bin/backup.sh

# Add cron job for the backup script
COPY cronjob /etc/cron.d/backup-cron
RUN chmod 0644 /etc/cron.d/backup-cron && crontab /etc/cron.d/backup-cron

# # COPY restore.sh /usr/local/bin/restore.sh
# RUN chmod +x /usr/local/bin/restore.sh

# # Copy the .env file into the container
# COPY .env /app/.env

# # Copy the gradlink file into the container
# COPY gradlink.json /app/gradlink.json

# Expose the port the app runs on
EXPOSE 3002

# Start cron in the background and run the app
CMD ["sh", "-c", "crond -f -l 8 && npm run start:prod"]
