#!/bin/bash

# Define variables
BACKUP_DIR=/backups
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
MONGO_URI=mongodb://sdevmarc:798764577@mongodb:27017/gradlink?authSource=gradlink

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

# Log the start of the backup
echo "[$DATE] Starting backup..."

# Perform the backup
if mongodump --uri=$MONGO_URI --out="$BACKUP_DIR/$DATE"; then
  echo "[$DATE] Backup completed successfully."
else
  echo "[$DATE] Backup failed!"
  exit 1
fi

# Delete old backups (older than 7 days)
if find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +; then
  echo "[$DATE] Old backups deleted successfully."
else
  echo "[$DATE] Failed to delete old backups!"
fi