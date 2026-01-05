#!/bin/bash
# ============================================================================
# MySQL Database Backup Script
# Recruitment Platform - Automated Backup Solution
# ============================================================================

set -euo pipefail

# ----------------------------------------------------------------------------
# CONFIGURATION
# ----------------------------------------------------------------------------
BACKUP_ROOT="/var/backups/mysql"
RETENTION_DAYS_DAILY=7
RETENTION_DAYS_WEEKLY=30
RETENTION_DAYS_MONTHLY=365

# Database credentials (use environment variables or MySQL config file)
MYSQL_USER="${MYSQL_BACKUP_USER:-backup_user}"
MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_CONFIG_FILE="/etc/mysql/backup.cnf"

# Databases to backup
DATABASES=("recruitment_main" "recruitment_quiz")

# Remote storage (S3, GCS, or Azure Blob)
REMOTE_STORAGE_ENABLED="${REMOTE_STORAGE_ENABLED:-false}"
S3_BUCKET="${S3_BUCKET:-}"
S3_PATH="${S3_PATH:-backups/mysql}"

# Notification settings
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
EMAIL_RECIPIENT="${EMAIL_RECIPIENT:-}"

# ----------------------------------------------------------------------------
# SETUP
# ----------------------------------------------------------------------------
DATE=$(date +%Y%m%d)
DATETIME=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)
DAY_OF_MONTH=$(date +%d)
TIMESTAMP=$(date +%s)

LOG_FILE="/var/log/mysql-backup/backup_${DATETIME}.log"
mkdir -p "$(dirname "$LOG_FILE")"

# Determine backup type
if [ "$DAY_OF_MONTH" == "01" ]; then
    BACKUP_TYPE="monthly"
    BACKUP_DIR="${BACKUP_ROOT}/monthly"
elif [ "$DAY_OF_WEEK" == "7" ]; then
    BACKUP_TYPE="weekly"
    BACKUP_DIR="${BACKUP_ROOT}/weekly"
else
    BACKUP_TYPE="daily"
    BACKUP_DIR="${BACKUP_ROOT}/daily"
fi

mkdir -p "$BACKUP_DIR"

# ----------------------------------------------------------------------------
# LOGGING FUNCTIONS
# ----------------------------------------------------------------------------
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" | tee -a "$LOG_FILE" >&2
}

send_notification() {
    local status="$1"
    local message="$2"
    
    # Slack notification
    if [ -n "$SLACK_WEBHOOK" ]; then
        local color="good"
        [ "$status" == "FAILED" ] && color="danger"
        
        curl -s -X POST "$SLACK_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{
                \"attachments\": [{
                    \"color\": \"$color\",
                    \"title\": \"MySQL Backup $status\",
                    \"text\": \"$message\",
                    \"fields\": [
                        {\"title\": \"Type\", \"value\": \"$BACKUP_TYPE\", \"short\": true},
                        {\"title\": \"Date\", \"value\": \"$(date)\", \"short\": true}
                    ]
                }]
            }" > /dev/null 2>&1 || true
    fi
    
    # Email notification
    if [ -n "$EMAIL_RECIPIENT" ]; then
        echo "$message" | mail -s "MySQL Backup $status - $DATETIME" "$EMAIL_RECIPIENT" || true
    fi
}

# ----------------------------------------------------------------------------
# BACKUP FUNCTIONS
# ----------------------------------------------------------------------------
backup_database() {
    local db="$1"
    local backup_file="${BACKUP_DIR}/${db}_${DATETIME}.sql.gz"
    
    log "Starting backup of database: $db"
    
    # Full backup with all options
    mysqldump \
        --defaults-file="$MYSQL_CONFIG_FILE" \
        --host="$MYSQL_HOST" \
        --user="$MYSQL_USER" \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --set-gtid-purged=OFF \
        --quick \
        --lock-tables=false \
        "$db" | gzip -9 > "$backup_file"
    
    local size=$(du -h "$backup_file" | cut -f1)
    log "Completed backup: $backup_file (Size: $size)"
    
    # Verify backup integrity
    if ! gzip -t "$backup_file" 2>/dev/null; then
        log_error "Backup verification failed for $db"
        return 1
    fi
    
    # Create checksum
    sha256sum "$backup_file" > "${backup_file}.sha256"
    log "Created checksum: ${backup_file}.sha256"
    
    echo "$backup_file"
}

backup_schema_only() {
    local db="$1"
    local schema_file="${BACKUP_DIR}/${db}_schema_${DATETIME}.sql"
    
    log "Backing up schema for: $db"
    
    mysqldump \
        --defaults-file="$MYSQL_CONFIG_FILE" \
        --host="$MYSQL_HOST" \
        --user="$MYSQL_USER" \
        --no-data \
        --routines \
        --triggers \
        --events \
        "$db" > "$schema_file"
    
    log "Schema backup completed: $schema_file"
}

backup_binary_logs() {
    local binlog_dir="${BACKUP_DIR}/binlogs_${DATETIME}"
    mkdir -p "$binlog_dir"
    
    log "Backing up binary logs..."
    
    # Flush and get current binary log position
    mysql --defaults-file="$MYSQL_CONFIG_FILE" \
          --host="$MYSQL_HOST" \
          --user="$MYSQL_USER" \
          -e "FLUSH LOGS; SHOW MASTER STATUS\G" > "${binlog_dir}/binlog_position.txt"
    
    # Copy binary logs
    local binlog_path=$(mysql --defaults-file="$MYSQL_CONFIG_FILE" \
                              --host="$MYSQL_HOST" \
                              --user="$MYSQL_USER" \
                              -N -e "SHOW VARIABLES LIKE 'log_bin_basename'" | awk '{print $2}')
    
    if [ -n "$binlog_path" ]; then
        cp "${binlog_path}"* "$binlog_dir/" 2>/dev/null || true
        log "Binary logs backed up to: $binlog_dir"
    fi
}

# ----------------------------------------------------------------------------
# REMOTE STORAGE SYNC
# ----------------------------------------------------------------------------
sync_to_remote() {
    if [ "$REMOTE_STORAGE_ENABLED" != "true" ] || [ -z "$S3_BUCKET" ]; then
        log "Remote storage sync disabled"
        return 0
    fi
    
    log "Syncing backups to S3: s3://${S3_BUCKET}/${S3_PATH}/"
    
    aws s3 sync "$BACKUP_ROOT" "s3://${S3_BUCKET}/${S3_PATH}/" \
        --exclude "*.tmp" \
        --storage-class STANDARD_IA
    
    log "Remote sync completed"
}

# ----------------------------------------------------------------------------
# CLEANUP FUNCTIONS
# ----------------------------------------------------------------------------
cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    # Daily backups
    find "${BACKUP_ROOT}/daily" -name "*.sql.gz" -mtime +${RETENTION_DAYS_DAILY} -delete 2>/dev/null || true
    find "${BACKUP_ROOT}/daily" -name "*.sha256" -mtime +${RETENTION_DAYS_DAILY} -delete 2>/dev/null || true
    
    # Weekly backups
    find "${BACKUP_ROOT}/weekly" -name "*.sql.gz" -mtime +${RETENTION_DAYS_WEEKLY} -delete 2>/dev/null || true
    find "${BACKUP_ROOT}/weekly" -name "*.sha256" -mtime +${RETENTION_DAYS_WEEKLY} -delete 2>/dev/null || true
    
    # Monthly backups
    find "${BACKUP_ROOT}/monthly" -name "*.sql.gz" -mtime +${RETENTION_DAYS_MONTHLY} -delete 2>/dev/null || true
    find "${BACKUP_ROOT}/monthly" -name "*.sha256" -mtime +${RETENTION_DAYS_MONTHLY} -delete 2>/dev/null || true
    
    # Cleanup logs older than 30 days
    find /var/log/mysql-backup -name "*.log" -mtime +30 -delete 2>/dev/null || true
    
    log "Cleanup completed"
}

# ----------------------------------------------------------------------------
# MAIN EXECUTION
# ----------------------------------------------------------------------------
main() {
    local start_time=$TIMESTAMP
    local status="SUCCESS"
    local backup_files=()
    local total_size=0
    
    log "=========================================="
    log "Starting $BACKUP_TYPE backup"
    log "=========================================="
    
    # Backup each database
    for db in "${DATABASES[@]}"; do
        if backup_file=$(backup_database "$db"); then
            backup_files+=("$backup_file")
            
            # Also backup schema separately (useful for quick restores)
            backup_schema_only "$db"
        else
            status="FAILED"
            log_error "Failed to backup database: $db"
        fi
    done
    
    # Backup binary logs for point-in-time recovery (daily only)
    if [ "$BACKUP_TYPE" == "daily" ]; then
        backup_binary_logs
    fi
    
    # Sync to remote storage
    sync_to_remote || log_error "Remote sync failed"
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Calculate total size
    for file in "${backup_files[@]}"; do
        if [ -f "$file" ]; then
            size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
            total_size=$((total_size + size_bytes))
        fi
    done
    
    local duration=$(($(date +%s) - start_time))
    local total_size_human=$(numfmt --to=iec $total_size 2>/dev/null || echo "${total_size} bytes")
    
    log "=========================================="
    log "Backup $status"
    log "Duration: ${duration}s"
    log "Total size: $total_size_human"
    log "Files: ${#backup_files[@]}"
    log "=========================================="
    
    # Send notification
    send_notification "$status" "Backup completed in ${duration}s. Total size: $total_size_human. Files: ${#backup_files[@]}"
    
    if [ "$status" == "FAILED" ]; then
        exit 1
    fi
}

# Run main function
main "$@"
