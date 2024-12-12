#!/bin/bash

# Load environment variables from .env file
set -a
[ -f .env ] && source .env
set +a

# Define variables
BACKUP_DIR=/backups
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
DATABASE_NAME=gradlink
MONGO_URI=${MONGODB_URI}

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

# Perform the backup
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$DATE"

# Delete old backups (older than 7 days)
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed at $DATE"


# # Log the start of the backup
# echo "[$DATE] Starting backup..." >> $LOG_FILE

# # Perform the backup
# if mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$DATE"; then
#   echo "[$DATE] Backup completed successfully." >> $LOG_FILE
# else
#   echo "[$DATE] Backup failed!" >> $LOG_FILE
#   exit 1
# fi

# # Delete old backups (older than 7 days)
# if find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +; then
#   echo "[$DATE] Old backups deleted successfully." >> $LOG_FILE
# else
#   echo "[$DATE] Failed to delete old backups!" >> $LOG_FILE
# fi