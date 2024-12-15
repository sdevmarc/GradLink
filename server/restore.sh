#!/bin/bash


# Variables
BACKUP_DIR=/backups
DATABASE_NAME=gradlink
MONGO_URI="mongodb://sdevmarc:798764577@mongodb:27017/gradlink?authSource=admin"

# Find the most recent backup directory
LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "No backups found to restore."
    exit 1
fi

# Full path to the latest backup
LATEST_BACKUP_PATH="$BACKUP_DIR/$LATEST_BACKUP"

echo "Restoring from $LATEST_BACKUP_PATH..."

# Use --drop to clear existing data before restoring
mongorestore --uri="$MONGO_URI" --drop "$LATEST_BACKUP_PATH"

if [ $? -eq 0 ]; then
    echo "Restore completed successfully."
else
    echo "Restore failed!"
    exit 1
fi