# loadgenerator

A benign traffic generator for Vogelgrippe.

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

## Running the load generator

1. Start Vogelgrippe
2. Run the load generator, pointing it to the Vogelgrippe frontend
```
locust --host="http://localhost:3000" -f locustfile.py -u 3 --headless
```
