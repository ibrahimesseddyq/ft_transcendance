#!/bin/bash
# ============================================================================
# Entrypoint Script for Backup Service
# ============================================================================

set -e

# Update MySQL config with password from environment
cat > /etc/mysql/backup.cnf << EOF
[client]
user=${MYSQL_BACKUP_USER:-backup_user}
password=${MYSQL_BACKUP_PASSWORD}
EOF
chmod 600 /etc/mysql/backup.cnf

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until mysql --defaults-file=/etc/mysql/backup.cnf -h "${MYSQL_HOST:-mysql-main}" -e "SELECT 1" > /dev/null 2>&1; do
    echo "MySQL is not ready yet. Waiting..."
    sleep 5
done
echo "MySQL is ready!"

# Create backup user if not exists (run once)
mysql --defaults-file=/etc/mysql/backup.cnf -h "${MYSQL_HOST:-mysql-main}" << EOF || true
CREATE USER IF NOT EXISTS 'backup_user'@'%' IDENTIFIED BY '${MYSQL_BACKUP_PASSWORD}';
GRANT SELECT, SHOW VIEW, TRIGGER, LOCK TABLES, RELOAD, PROCESS, REPLICATION CLIENT ON *.* TO 'backup_user'@'%';
GRANT EXECUTE ON recruitment_main.* TO 'backup_user'@'%';
FLUSH PRIVILEGES;
EOF

echo "Backup service initialized. Starting cron..."

# Start cron
exec "$@"
