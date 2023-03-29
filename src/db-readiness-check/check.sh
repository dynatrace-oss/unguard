#!/bin/sh -e
echo "Trying to connect to mysql:";

until mysql --host="$MYSQL_HOST" --user="$MYSQL_USER" --password="$MYSQL_PASSWORD" --execute="SELECT 1";
  do
      echo "Waiting for mysql...";
      sleep 2;
  done;
