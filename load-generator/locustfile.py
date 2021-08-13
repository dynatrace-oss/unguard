import random

import time
from bs4 import BeautifulSoup
from locust import HttpUser, task, between, tag

USER_INDEX = 0

LOCALES = [
    "",
    "de-DE",
    "en-US",
    "en-gb",
    "da",
    "en-ca",
    "ar-eg",
    "en-AT",
    "de-at"
]

URLS = [
    "http://google.com",
    "http://twitter.com",
    "https://github.com/pichsenmeister/WienerScript",
    "https://github.com/auchenberg/volkswagen",
    "https://imgur.com/gallery/XnLVHDc",
    "https://twitter.com/elonmusk/status/980566116614291456?s=20",
    "https://issues.apache.org/jira/browse/HTTPCLIENT-1974",
    "https://stackoverflow.com/questions/11492179/tabs-vs-space-indentation",
    "https://www.reddit.com/r/Austria/comments/jp11ys/donald_likes/",
    "https://realpython.com/python-requests/",
    "https://www.imdb.com/title/tt1375666/",
    "https://www.imdb.com/name/nm0000138/",
    "https://carbon.now.sh/",
    "https://devhints.io/",
    "https://covidspreadingrates.org/",
    "https://dynatrace.com/"
]

TEXTS = [
    "Hello everyone! 👋",
    "This is a post on Unguard, the best Microblogging platform ever. 🐦",
    "Thinking about birds 🐦",
    "Stay at home guys! 🏠",
    "I just realized that the earth is actually flat!!11one1 🌍",
    "If you ask Rick Astley for a DVD of the movie Up, he won’t give it to you because he’s never gonna give you Up. However, by not giving you Up like you asked for it, he’s letting you down. This is known as the Astley paradox.",
    "╠═══╣Lets build a ladder╠═══╣",
    "now ᴘʟᴀʏɪɴɢ: Who asked (Feat: Nobody) ───────────⚪────── ◄◄⠀▐▐⠀►► 𝟸:𝟷𝟾 / 𝟹:𝟻𝟼⠀───○ 🔊",
    "imagine ur card declines at therapy and they make you go back to junior year of hs",
    "If I get accused of gaslighting one more time imma look it up",
    "landlords be like \"do you have a stable job\" bro do you???",
    "messaged a girl \"i like ur photo wall!\" in zoom class and she turned off her camera",
    "420 is ten times better than 42",
    "Tesla Goes Bankrupt\n Palo Alto, California, April 1, 2018 -- Despite intense efforts to raise money, including a last-ditch mass sale of Easter Eggs, we are sad to report that Tesla has gone completely and totally bankrupt. So bankrupt, you can't believe it."
]


class UnguardUser(HttpUser):
    wait_time = between(10, 30)

    def get_running_username(self):
        global USER_INDEX
        USER_INDEX += 1
        return "simuser_" + str(USER_INDEX)

    def browse_to_random_profile_on_page(self, page: BeautifulSoup):
        user_links = []
        links = page.findAll('a')
        for link in [l for l in links if l]:
            if not link.get('href'):
                continue
            if link.get('href').startswith("/user/"):
                user_links.append(link.get('href'))

        if len(user_links) > 0:
            chosen_user_link = random.choice(user_links)
            self.client.get(chosen_user_link, name="/user/[username]")
            return chosen_user_link

    @task(5)
    def index_page(self):
        res = self.client.get("/")
        index_page = BeautifulSoup(res.text, features="html.parser")

        # simulate the user reading through the index page
        time.sleep(random.randint(1, 10))

        if random.random() < 0.3:
            # have a certain probability to look at a user profile when browsing
            user_link = self.browse_to_random_profile_on_page(index_page)
            # if we clicked on one, have a certain probability to follow it
            if user_link and random.random() < 0.3:
                self.client.post(f"{user_link}/follow", name="/user/[username]/follow")

    @task(2)
    def mytimeline(self):
        self.client.get("/mytimeline")

    @tag('posting')
    @task(1)
    def post_url(self):
        url_post = {'header': random.choice(LOCALES),
                    'urlmessage': random.choice(URLS)}

        self.client.post("/post", data=url_post)
        time.sleep(1)

    @tag('posting')
    @task(1)
    def post_text(self):
        text_post = {'message': random.choice(TEXTS)}

        self.client.post("/post", data=text_post)
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
