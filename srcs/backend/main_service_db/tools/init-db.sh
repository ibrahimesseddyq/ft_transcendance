#!/bin/sh

mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld


if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "First run detected - initializing database..."
    mysql_install_db --user=mysql --datadir=/var/lib/mysql
    
    mysqld --user=mysql --datadir=/var/lib/mysql &
    until mysqladmin ping --silent 2>/dev/null; do 
        echo "Waiting for MariaDB to start..."
        sleep 1
    done
    
    
    mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS \`${MAIN_SERVICE_DB_DATABASE}\`;
CREATE USER IF NOT EXISTS '${MAIN_SERVICE_DB_USER}'@'%' IDENTIFIED BY '${MAIN_SERVICE_DB_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MAIN_SERVICE_DB_DATABASE}\`.* TO '${MAIN_SERVICE_DB_USER}'@'%';
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MAIN_SERVICE_DB_ROOT_PASSWORD}';
FLUSH PRIVILEGES;
EOF
    
    
    mysqladmin -u root -p"${MAIN_SERVICE_DB_ROOT_PASSWORD}" shutdown

fi
exec mysqld --user=mysql --datadir=/var/lib/mysql