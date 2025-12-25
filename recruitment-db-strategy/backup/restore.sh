#!/bin/bash
# ============================================================================
# MySQL Database Restore Script
# Recruitment Platform - Disaster Recovery
# ============================================================================

set -euo pipefail

# ----------------------------------------------------------------------------
# CONFIGURATION
# ----------------------------------------------------------------------------
BACKUP_ROOT="/var/backups/mysql"
MYSQL_USER="${MYSQL_BACKUP_USER:-backup_user}"
MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_CONFIG_FILE="/etc/mysql/backup.cnf"

LOG_FILE="/var/log/mysql-backup/restore_$(date +%Y%m%d_%H%M%S).log"
mkdir -p "$(dirname "$LOG_FILE")"

# ----------------------------------------------------------------------------
# LOGGING
# ----------------------------------------------------------------------------
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" | tee -a "$LOG_FILE" >&2
}

# ----------------------------------------------------------------------------
# FUNCTIONS
# ----------------------------------------------------------------------------
usage() {
    cat << EOF
Usage: $0 [OPTIONS] COMMAND

Commands:
    list                    List available backups
    restore <backup_file>   Restore from specific backup file
    restore-latest <db>     Restore latest backup for database
    verify <backup_file>    Verify backup integrity
    point-in-time <db> <datetime>  Point-in-time recovery

Options:
    -d, --database <name>   Target database name (default: same as backup)
    -h, --host <host>       MySQL host (default: localhost)
    -n, --dry-run           Show what would be done without executing
    --drop-existing         Drop existing database before restore
    --help                  Show this help message

Examples:
    $0 list
    $0 restore /var/backups/mysql/daily/recruitment_main_20240115_020000.sql.gz
    $0 restore-latest recruitment_main
    $0 point-in-time recruitment_main "2024-01-15 14:30:00"
EOF
    exit 1
}

list_backups() {
    log "Available backups:"
    echo ""
    echo "=== DAILY BACKUPS ==="
    ls -lh "${BACKUP_ROOT}/daily/"*.sql.gz 2>/dev/null | tail -20 || echo "No daily backups found"
    echo ""
    echo "=== WEEKLY BACKUPS ==="
    ls -lh "${BACKUP_ROOT}/weekly/"*.sql.gz 2>/dev/null | tail -10 || echo "No weekly backups found"
    echo ""
    echo "=== MONTHLY BACKUPS ==="
    ls -lh "${BACKUP_ROOT}/monthly/"*.sql.gz 2>/dev/null || echo "No monthly backups found"
}

verify_backup() {
    local backup_file="$1"
    
    log "Verifying backup: $backup_file"
    
    # Check file exists
    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi
    
    # Verify gzip integrity
    if ! gzip -t "$backup_file" 2>/dev/null; then
        log_error "Backup file is corrupted (gzip check failed)"
        return 1
    fi
    
    # Verify checksum if available
    if [ -f "${backup_file}.sha256" ]; then
        if sha256sum -c "${backup_file}.sha256" > /dev/null 2>&1; then
            log "Checksum verification: PASSED"
        else
            log_error "Checksum verification: FAILED"
            return 1
        fi
    else
        log "Warning: No checksum file found"
    fi
    
    # Quick content check
    local table_count=$(zcat "$backup_file" | grep -c "^CREATE TABLE" || echo "0")
    log "Tables found in backup: $table_count"
    
    if [ "$table_count" -eq 0 ]; then
        log_error "No tables found in backup - file may be empty or corrupted"
        return 1
    fi
    
    log "Backup verification: PASSED"
    return 0
}

restore_backup() {
    local backup_file="$1"
    local target_db="${2:-}"
    local drop_existing="${3:-false}"
    local dry_run="${4:-false}"
    
    # Extract database name from filename if not provided
    if [ -z "$target_db" ]; then
        target_db=$(basename "$backup_file" | sed 's/_[0-9]\{8\}_[0-9]\{6\}\.sql\.gz$//')
    fi
    
    log "=========================================="
    log "Starting restore"
    log "Backup file: $backup_file"
    log "Target database: $target_db"
    log "=========================================="
    
    # Verify backup first
    if ! verify_backup "$backup_file"; then
        log_error "Backup verification failed. Aborting restore."
        return 1
    fi
    
    if [ "$dry_run" == "true" ]; then
        log "[DRY RUN] Would restore $backup_file to $target_db"
        return 0
    fi
    
    # Confirm with user
    echo ""
    echo "WARNING: This will overwrite data in database '$target_db'"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log "Restore cancelled by user"
        return 1
    fi
    
    # Drop and recreate database if requested
    if [ "$drop_existing" == "true" ]; then
        log "Dropping existing database: $target_db"
        mysql --defaults-file="$MYSQL_CONFIG_FILE" \
              --host="$MYSQL_HOST" \
              --user="$MYSQL_USER" \
              -e "DROP DATABASE IF EXISTS \`$target_db\`; CREATE DATABASE \`$target_db\`;"
    else
        # Just ensure database exists
        mysql --defaults-file="$MYSQL_CONFIG_FILE" \
              --host="$MYSQL_HOST" \
              --user="$MYSQL_USER" \
              -e "CREATE DATABASE IF NOT EXISTS \`$target_db\`;"
    fi
    
    # Restore
    log "Restoring backup..."
    local start_time=$(date +%s)
    
    zcat "$backup_file" | mysql \
        --defaults-file="$MYSQL_CONFIG_FILE" \
        --host="$MYSQL_HOST" \
        --user="$MYSQL_USER" \
        "$target_db"
    
    local duration=$(($(date +%s) - start_time))
    
    # Verify restore
    local table_count=$(mysql --defaults-file="$MYSQL_CONFIG_FILE" \
                              --host="$MYSQL_HOST" \
                              --user="$MYSQL_USER" \
                              -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$target_db'")
    
    log "=========================================="
    log "Restore completed"
    log "Duration: ${duration}s"
    log "Tables restored: $table_count"
    log "=========================================="
}

restore_latest() {
    local db_name="$1"
    
    log "Finding latest backup for: $db_name"
    
    # Find latest backup file
    local latest_file=""
    for dir in daily weekly monthly; do
        local found=$(ls -t "${BACKUP_ROOT}/${dir}/${db_name}_"*.sql.gz 2>/dev/null | head -1)
        if [ -n "$found" ]; then
            if [ -z "$latest_file" ] || [ "$found" -nt "$latest_file" ]; then
                latest_file="$found"
            fi
        fi
    done
    
    if [ -z "$latest_file" ]; then
        log_error "No backup found for database: $db_name"
        return 1
    fi
    
    log "Latest backup: $latest_file"
    restore_backup "$latest_file" "$db_name" "${DROP_EXISTING:-false}" "${DRY_RUN:-false}"
}

point_in_time_recovery() {
    local db_name="$1"
    local target_datetime="$2"
    
    log "Point-in-time recovery to: $target_datetime"
    
    # Find the backup just before target datetime
    local target_ts=$(date -d "$target_datetime" +%s 2>/dev/null)
    if [ -z "$target_ts" ]; then
        log_error "Invalid datetime format. Use: YYYY-MM-DD HH:MM:SS"
        return 1
    fi
    
    # Find appropriate base backup
    local base_backup=""
    for backup in $(ls -t "${BACKUP_ROOT}/"*"/${db_name}_"*.sql.gz 2>/dev/null); do
        local backup_date=$(basename "$backup" | grep -oP '\d{8}_\d{6}')
        local backup_ts=$(date -d "${backup_date:0:8} ${backup_date:9:2}:${backup_date:11:2}:${backup_date:13:2}" +%s 2>/dev/null || echo 0)
        
        if [ "$backup_ts" -lt "$target_ts" ]; then
            base_backup="$backup"
            break
        fi
    done
    
    if [ -z "$base_backup" ]; then
        log_error "No backup found before $target_datetime"
        return 1
    fi
    
    log "Base backup: $base_backup"
    
    # Restore base backup
    restore_backup "$base_backup" "$db_name" true false
    
    # Apply binary logs up to target datetime
    log "Applying binary logs to $target_datetime..."
    
    local binlog_dir=$(dirname "$base_backup")/binlogs_*
    if ls $binlog_dir/*.* > /dev/null 2>&1; then
        mysqlbinlog --stop-datetime="$target_datetime" $binlog_dir/*.* | \
            mysql --defaults-file="$MYSQL_CONFIG_FILE" \
                  --host="$MYSQL_HOST" \
                  --user="$MYSQL_USER" \
                  "$db_name"
        log "Binary logs applied successfully"
    else
        log "Warning: No binary logs found for point-in-time recovery"
    fi
    
    log "Point-in-time recovery completed"
}

# ----------------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------------
DRY_RUN=false
DROP_EXISTING=false
TARGET_DB=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--database)
            TARGET_DB="$2"
            shift 2
            ;;
        -h|--host)
            MYSQL_HOST="$2"
            shift 2
            ;;
        -n|--dry-run)
            DRY_RUN=true
            shift
            ;;
        --drop-existing)
            DROP_EXISTING=true
            shift
            ;;
        --help)
            usage
            ;;
        list)
            list_backups
            exit 0
            ;;
        verify)
            verify_backup "$2"
            exit $?
            ;;
        restore)
            restore_backup "$2" "$TARGET_DB" "$DROP_EXISTING" "$DRY_RUN"
            exit $?
            ;;
        restore-latest)
            restore_latest "$2"
            exit $?
            ;;
        point-in-time)
            point_in_time_recovery "$2" "$3"
            exit $?
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            ;;
    esac
done

usage
