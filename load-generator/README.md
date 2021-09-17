# load-generator

A benign traffic generator for Unguard.

Contains the definition for virtual users that execute the following tasks:
* visit frontpage
* visit personal timelines
* visit profiles
* follow profiles
* post text posts
* post URL posts

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

## Running the load generator

1. Start Unguard
2. Run the load generator, pointing it to the Unguard frontend
```
locust --host="http://localhost:3000/ui" -f locustfile.py -u 3 --headless
```

or just run `locust` which will take the configuration from the `./locust.conf`. 