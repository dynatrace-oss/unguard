# malicious-load-generator

A generator that makes CMD, JDNI, and SQL injections into Unguard.

Contains the definition for attackers that execute the following tasks:
* post CMD injections
* post JNDI injections
* post SQL injections

## Prerequesites

* Python 3.x installation.

* Having installed all the dependencies by running:

```
pip install -r requirements.txt
```
If you don't want to install everything locally you can also build it in a virtual environment:
```
python -m venv venv
source ./venv/bin/activate      # linux
.\venv\scripts\activate         # windows-cmd
pip install -r requirements.in
```

## Running the malicious load generator in a Kubernetes cluster

Start the malicious load generator via Skaffold
```
# We assume you cloned unguard on your local machine
$ cd ./unguard
$ skaffold run -p malicious-load-generator
```

## Running the malicious load generator

1. Start Unguard
2. Run the malicious load generator, pointing it to the Unguard frontend, specifying e.g. 3 attackers and a WAIT_TIME
of e.g. 60 seconds (the wait time is some number between WAIT_TIME and (WAIT_TIME + 60) that is randomly chosen and
indicates how long an attacker will wait until their next attack)
```
WAIT_TIME=60 locust --host="http://unguard.kube/ui" -f locustfile.py -u 3 --headless
```
