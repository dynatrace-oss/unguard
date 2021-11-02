FROM locustio/locust:2.1.0
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN ls -la
ENTRYPOINT ./loadgen.sh
