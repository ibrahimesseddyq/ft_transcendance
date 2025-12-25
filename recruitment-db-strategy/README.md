# Recruitment Platform - Backup & Archive Strategy

A complete implementation of backup and archiving for the recruitment platform database.

## 📁 Project Structure

```
recruitment-db-strategy/
├── docker-compose.yml          # Full infrastructure setup
├── .env.example                 # Environment variables template
├── archive/
│   ├── 01_archive_tables.sql   # Archive table schemas
│   └── 02_archive_procedures.sql # Stored procedures for archiving
├── backup/
│   ├── backup.sh               # Automated backup script
│   ├── restore.sh              # Restore and recovery script
│   ├── Dockerfile.backup       # Backup service container
│   ├── crontab                 # Scheduled job definitions
│   └── entrypoint.sh           # Container initialization
├── config/
│   └── mysql-main.cnf          # MySQL configuration
└── docs/
    └── README.md               # This file
```

## 🚀 Quick Start

### 1. Clone and Configure

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

### 2. Start Infrastructure

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backup-service
```

### 3. Initialize Archive Tables

```bash
# Connect to MySQL and run archive setup
docker exec -i recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} recruitment_main < archive/01_archive_tables.sql
docker exec -i recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} recruitment_main < archive/02_archive_procedures.sql
```

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐                                                       │
│   │  Application    │                                                       │
│   │  (CRUD ops)     │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐     Daily Backup      ┌─────────────────┐            │
│   │  MySQL Main     │ ───────────────────►  │  Backup Files   │            │
│   │  (Hot Data)     │                       │  (Local + S3)   │            │
│   │                 │                       └─────────────────┘            │
│   │  - applications │                                                       │
│   │  - interviews   │     Nightly Archive                                   │
│   │  - notifications│ ───────────────────┐                                 │
│   └─────────────────┘                    │                                 │
│                                          ▼                                 │
│                              ┌─────────────────┐                           │
│                              │  Archive Tables │                           │
│                              │  (Warm Data)    │                           │
│                              │                 │                           │
│                              │  - *_archive    │                           │
│                              └────────┬────────┘                           │
│                                       │                                    │
│                                       │ Annual Purge (past retention)      │
│                                       ▼                                    │
│                              ┌─────────────────┐                           │
│                              │  Cold Storage   │                           │
│                              │  (S3 Glacier)   │                           │
│                              └─────────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🗓️ Backup Schedule

| Type    | Schedule              | Retention | Storage    |
|---------|----------------------|-----------|------------|
| Daily   | Every day at 2 AM    | 7 days    | Local + S3 |
| Weekly  | Every Sunday         | 30 days   | Local + S3 |
| Monthly | 1st of each month    | 365 days  | S3         |
| Binlog  | Continuous           | 7 days    | Local      |

## 🗃️ Archive Schedule

| Data Type      | Archive After | Retention | Criteria                    |
|----------------|---------------|-----------|----------------------------|
| Applications   | 6 months      | 2 years   | Rejected/withdrawn/accepted |
| Notifications  | 90 days       | 1 year    | All read/unread            |
| Interviews     | 6 months      | 2 years   | Completed/cancelled        |
| Offers         | 12 months     | 3 years   | Declined/expired           |
| Jobs           | 6 months      | 2 years   | Closed with no active apps |
| Test Submissions | With app    | 2 years   | Linked to archived apps    |

## 🔧 Manual Operations

### Run Manual Backup

```bash
# Full backup
docker exec recruitment-backup /scripts/backup.sh

# Backup specific database
docker exec recruitment-backup mysqldump \
  --defaults-file=/etc/mysql/backup.cnf \
  -h mysql-main \
  --single-transaction \
  recruitment_main | gzip > manual_backup.sql.gz
```

### Run Manual Archive

```bash
# Archive all eligible data
docker exec recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} \
  -e "CALL sp_run_all_archive_jobs();"

# Archive specific table
docker exec recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} \
  -e "CALL sp_archive_applications(6, 2);"  # 6 months old, 2 year retention
```

### Restore from Backup

```bash
# List available backups
docker exec recruitment-backup /scripts/restore.sh list

# Restore latest backup
docker exec recruitment-backup /scripts/restore.sh restore-latest recruitment_main

# Restore specific backup
docker exec recruitment-backup /scripts/restore.sh restore \
  /var/backups/mysql/daily/recruitment_main_20240115_020000.sql.gz

# Point-in-time recovery
docker exec recruitment-backup /scripts/restore.sh point-in-time \
  recruitment_main "2024-01-15 14:30:00"
```

### Query Archived Data

```bash
# Find archived application
docker exec recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} \
  recruitment_main \
  -e "SELECT * FROM applications_archive WHERE candidate_id = 'abc-123';"

# Check archive statistics
docker exec recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} \
  recruitment_main \
  -e "SELECT table_name, SUM(records_archived) as total, MAX(archive_date) as last_run 
      FROM archive_log GROUP BY table_name;"
```

## 📈 Monitoring

### Check Backup Status

```bash
# View recent backup logs
docker exec recruitment-backup tail -100 /var/log/mysql-backup/backup_*.log

# Check backup sizes
docker exec recruitment-backup du -sh /var/backups/mysql/*

# Verify backup integrity
docker exec recruitment-backup /scripts/restore.sh verify \
  /var/backups/mysql/daily/recruitment_main_20240115_020000.sql.gz
```

### Check Archive Status

```bash
# View archive log
docker exec recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} \
  recruitment_main \
  -e "SELECT * FROM archive_log ORDER BY archive_date DESC LIMIT 20;"

# Compare live vs archive counts
docker exec recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} \
  recruitment_main \
  -e "SELECT 'live' as source, COUNT(*) as count FROM applications
      UNION ALL
      SELECT 'archive', COUNT(*) FROM applications_archive;"
```

## 🛡️ Disaster Recovery Procedures

### Scenario 1: Database Corruption

```bash
# 1. Stop application
docker-compose stop app

# 2. Restore from latest backup
docker exec recruitment-backup /scripts/restore.sh restore-latest recruitment_main --drop-existing

# 3. Verify data
docker exec recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} \
  -e "SELECT COUNT(*) FROM recruitment_main.applications;"

# 4. Restart application
docker-compose start app
```

### Scenario 2: Accidental Data Deletion

```bash
# 1. Identify when deletion occurred
# 2. Perform point-in-time recovery
docker exec recruitment-backup /scripts/restore.sh point-in-time \
  recruitment_main "2024-01-15 09:00:00"
```

### Scenario 3: Complete System Failure

```bash
# 1. Provision new infrastructure
docker-compose up -d mysql-main mysql-quiz

# 2. Download backups from S3
aws s3 sync s3://recruitment-backups/mysql/ /var/backups/mysql/

# 3. Restore all databases
docker exec recruitment-backup /scripts/restore.sh restore-latest recruitment_main
docker exec recruitment-backup /scripts/restore.sh restore-latest recruitment_quiz

# 4. Restore archive tables
docker exec -i recruitment-mysql-main mysql -uroot -p${MYSQL_ROOT_PASSWORD} \
  recruitment_main < archive/01_archive_tables.sql
```

## ⚠️ Important Notes

1. **Test Restores Regularly**: Perform monthly restore tests to ensure backups are valid
2. **Monitor Disk Space**: Set up alerts for backup storage usage
3. **Encryption**: Enable at-rest encryption for S3 backups
4. **Access Control**: Limit access to backup files and credentials
5. **Documentation**: Keep this runbook updated with any changes

## 📞 Support

For issues or questions:
- Check logs: `docker-compose logs backup-service`
- Archive log: `SELECT * FROM archive_log ORDER BY archive_date DESC;`
- Slack: #platform-ops
