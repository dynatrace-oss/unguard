import {beforeAll, By, step, TestData, TestSettings} from '@flood/element'

// noinspection JSUnusedGlobalSymbols
export const settings: TestSettings = {
    userAgent: 'simulated-browser-user',
    loopCount: 10,
    screenshotOnFailure: false,
    // Automatically wait for elements before trying to interact with them
    waitUntil: 'visible',
    actionDelay: 3,
    stepDelay: 5
    // For the future, we can set HTTP headers here:
    // extraHTTPHeaders: {
    //     'X-Client-Ip': `${ip}`
    // }
}

type User = {
    username: string
    password: string
}

type UrlPosts = {
    posts: UrlPost[]
}

type UrlPost = {
    url: string;
    language: string;
}

type ImageUrlPosts = {
    posts: ImageUrlPost[]
}

type ImageUrlPost = {
    url: string;
    text: string;
}

type TextPosts = {
    posts: TextPost[]
}

type TextPost = {
    text: string
}

type Config = {
    frontendUrl: string
}

function checkEnvVariable(envVar) {
    if (!process.env[envVar]) {
        console.error(`env variable ${envVar} is not set.`)
        throw Error(`env variable ${envVar} is not set.`)
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

TestData.fromJSON<TextPosts>('./data/textposts.json').shuffle().as('textposts')
TestData.fromJSON<ImageUrlPosts>('./data/imgposts.json').shuffle().as('imgposts')
TestData.fromJSON<UrlPosts>('./data/urlposts.json').shuffle().as('urlposts')

// noinspection JSUnusedGlobalSymbols
export default () => {
    beforeAll(async () => {
        checkEnvVariable("FRONTEND_ADDR")
    })

    const config: Config = {frontendUrl: 'http://' + process.env.FRONTEND_ADDR}
    const username = "ROBOT_" + getRandomInt(10000).toString(16);

    const user: User = {username: username, password: username}

    step('Register', async browser => {
        await browser.visit(config.frontendUrl + '/login')
        await browser.type(By.css('input[name=username]'), String(user.username))
        await browser.type(By.css('input[name=password]'), String(user.password))
        const registerButton = await browser.findElement(By.css('button[name=register]'));
        await registerButton.click();
    })

    step('Log in', async browser => {
        console.log(JSON.stringify(user))
        await browser.visit(config.frontendUrl + '/login')
        await browser.type(By.css('input[name=username]'), String(user.username))
        await browser.type(By.css('input[name=password]'), String(user.password))
        const loginButton = await browser.findElement(By.css('button[name=login]'));
        await loginButton.click();
    })

    step('Visit Homepage', async browser => {
        await browser.visit(config.frontendUrl + '/')
    })

    step('Visit Timeline', async browser => {
        await browser.visit(config.frontendUrl + '/my-timeline')
    })

    step('Create text post', async (browser, data) => {
        const posts: [TextPost] = data['textposts'].posts
        const post = posts[getRandomInt(posts.length)]

        await browser.visit(config.frontendUrl + '/')
        await browser.type(By.css('textarea[id=message]'), String(post.text))
        const postButton = await browser.findElement(By.css('button[name=postSubmit]'));
        await postButton.click();
        console.log(`${user.username} posted text: '${post.text}'`)
    })

    step('Create URL post', async (browser, data) => {
        const posts: [UrlPost] = data['urlposts'].posts
        const post: UrlPost = posts[getRandomInt(posts.length)]

        await browser.visit(config.frontendUrl + '/')

        const imgUrlButton = await browser.findElement(By.css('a[id=url-tab]'));
        await imgUrlButton.click();
        await browser.type(By.css('textarea[id=urlmessage]'), String(post.url))
        await browser.type(By.css('textarea[id=header]'), String(post.language))
        const postButton = await browser.findElement(By.css('button[name=postSubmit]'));
        await postButton.click();

        console.log(`${user.username} posted URL: '${post.url}'`)
    })

    step('Create image post', async (browser, data) => {
        const posts: [ImageUrlPost] = data['imgposts'].posts
        const post: ImageUrlPost = posts[getRandomInt(posts.length)]

        await browser.visit(config.frontendUrl + '/')

        const imgUrlButton = await browser.findElement(By.css('a[id=image-tab]'));
        await imgUrlButton.click();
        await browser.type(By.css('textarea[id=imgurl]'), String(post.url))
        await browser.type(By.css('textarea[id=description]'), String(post.text))
        const postButton = await browser.findElement(By.css('button[name=postSubmit]'));
        await postButton.click();

        console.log(`${user.username} posted image: '${post.url}'`)
    })

    step('Log out', async browser => {
        const logoutButton = await browser.findElement(By.css('button[name=navLogoutButton]'));
        await logoutButton.click();
    })
}
