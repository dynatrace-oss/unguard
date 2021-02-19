#!/bin/bash

set -e
trap "exit" TERM

if [[ -z "${FRONTEND_ADDR}" ]]; then
  echo >&2 "FRONTEND_ADDR not specified"
  exit 1
fi

set -x

# code 000 is the response from curl if the service is not available
# if one request to the frontend fails, then exit
STATUSCODE=$(curl --silent --output /dev/stderr --write-out "%{http_code}" http://${FRONTEND_ADDR})
if test $STATUSCODE -e 000; then
  echo "Error: Could not reach frontend - Status code: ${STATUSCODE}"
  exit 1
fi

# else, run loadgen
locust --host="http://${FRONTEND_ADDR}" --headless -u "${USERS:-10}" 2>&1
