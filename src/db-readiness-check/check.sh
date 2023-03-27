#!/bin/sh -e
sleep 10
# Point to the internal API server hostname
APISERVER=https://kubernetes.default.svc
echo "APISERVER = $APISERVER"
echo
# Path to ServiceAccount token
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount
echo "SERVICEACCOUNT = $SERVICEACCOUNT"
echo
# Read this Pod's namespace
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)
echo "NAMESPACE = $NAMESPACE"
echo
# Read the ServiceAccount bearer token
TOKEN=$(cat ${SERVICEACCOUNT}/token)
echo "TOKEN = $TOKEN"
echo

# Reference the internal certificate authority (CA)
CACERT=${SERVICEACCOUNT}/ca.crt
echo "CACERT = $CACERT"
echo

service="unguard-mariadb"

# Explore the API with TOKEN
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}//api/v1/namespaces/$NAMESPACE/endpoints
echo
until mysql --host="$MYSQL_HOST" --user="$MYSQL_USER" --password="$MYSQL_PASSWORD" --execute="SELECT 1";
  do
      echo waiting for mysql;
      sleep 2;
  done;

