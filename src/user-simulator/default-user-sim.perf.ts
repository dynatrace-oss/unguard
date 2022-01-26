import {beforeAll, By, step, TestData, TestSettings} from '@flood/element'

const random_ips = ['177.236.37.155',
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
    '227.194.148.108',
    '96.16.70.23',
    '171.72.188.229',
    '24.253.46.199',
    '122.62.252.49',
    '48.130.188.78',
    '168.172.80.223',
    '107.60.18.49',
    '238.227.33.197',
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
    '239.91.223.239',
    '81.223.64.234',
    '172.175.183.17',
    '175.127.203.9',
    '253.40.37.243',
    '42.61.224.189',
    '79.236.195.22',
    '182.7.180.66',
    '184.195.3.131',
    '141.70.56.232',
    '104.9.77.242',
    '126.47.188.82',
    '211.40.123.204',
    '177.116.53.144',
    '241.243.168.0',
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
    '113.167.100.35'];

const ip = random_ips[getRandomInt(random_ips.length)];

// noinspection JSUnusedGlobalSymbols
export const settings: TestSettings = {
    userAgent: 'simulated-browser-user',
    // Currently only 10 loops instead of Infinite, as the 11th run stalls forever
    // But as K8s will restart the pod, this will still run indefinitely
    loopCount: 10,
    screenshotOnFailure: false,
    // Automatically wait for elements before trying to interact with them
    waitUntil: 'visible',
    actionDelay: 3,
    stepDelay: 5,
    // Simulate a client ip from the public internet for this user
    extraHTTPHeaders: {
        'X-Client-Ip': `${ip}`
    }
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
