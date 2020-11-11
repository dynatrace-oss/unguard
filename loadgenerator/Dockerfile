FROM locustio/locust
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN ls -la
ENTRYPOINT ./loadgen.sh
