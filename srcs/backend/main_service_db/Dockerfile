FROM alpine:3.22
RUN apk update && apk upgrade 

RUN apk add mariadb mariadb-client && mkdir -p /run/mysqld /var/lib/mysql/ && \
        chown -R mysql:mysql /run/mysqld/ /var/lib/mysql 

COPY conf/50-server.cnf /etc/my.cnf.d/mariadb-server.cnf
COPY tools/init-db.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/init-db.sh 

EXPOSE 3306

ENTRYPOINT [ "/usr/local/bin/init-db.sh" ]