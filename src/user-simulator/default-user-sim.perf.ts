import { beforeAll, By, step, TestData, TestSettings } from '@flood/element'
import {
    Bio,
    BioList,
    Config,
    ImageUrlPost,
    ImageUrlPosts,
    TextPost,
    TextPosts,
    UrlPost,
    UrlPosts,
    User,
} from './types'

const random_ips_pub = ['177.236.37.155',
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
    '113.167.100.35']

const random_ips_priv = ['10.0.1.2',
    '192.168.10.1',
    '192.168.10.5',
    '192.168.10.10',
    '172.16.10.10']

const privateRanges = process.env.SIMULATE_PRIVATE_RANGES === 'true'

const ip = privateRanges ? random_ips_priv[getRandomInt(random_ips_priv.length)] : random_ips_pub[getRandomInt(random_ips_pub.length)]

// noinspection JSUnusedGlobalSymbols
export const settings: TestSettings = {
    userAgent: 'simulated-browser-user',
    loopCount: 1,
    screenshotOnFailure: false,
    // Automatically wait for elements before trying to interact with them
    waitUntil: 'visible',
    actionDelay: 3,
    stepDelay: 5,
    // Simulate a client ip from the public internet for this user
    extraHTTPHeaders: {
        'X-Client-Ip': `${ip}`,
    },
}

function checkEnvVariable(envVar: string) {
    if (!process.env[envVar]) {
        console.error(`env variable ${envVar} is not set.`)
        throw Error(`env variable ${envVar} is not set.`)
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

const BIOLIST_KEY = 'biolist'
const TEXTPOSTS_KEY = 'textposts'
const IMGPOSTS_KEY = 'imgposts'
const URLPOSTS_KEY = 'urlposts'

TestData.fromJSON<TextPosts>('./data/textposts.json').shuffle().as(TEXTPOSTS_KEY)
TestData.fromJSON<ImageUrlPosts>('./data/imgposts.json').shuffle().as(IMGPOSTS_KEY)
TestData.fromJSON<UrlPosts>('./data/urlposts.json').shuffle().as(URLPOSTS_KEY)
TestData.fromJSON<BioList>('./data/biolist.json').shuffle().as(BIOLIST_KEY)

// noinspection JSUnusedGlobalSymbols
export default () => {
    beforeAll(async () => {
        checkEnvVariable('FRONTEND_ADDR')
    })

    const config: Config = { frontendUrl: 'http://' + process.env.FRONTEND_ADDR }
    const username = 'ROBOT_' + getRandomInt(10000).toString(16)

    const user: User = { username: username, password: username }

    step('Register', async browser => {
        await browser.visit(config.frontendUrl + '/login')
        await browser.type(By.css('input[name=username]'), String(user.username))
        await browser.type(By.css('input[name=password]'), String(user.password))
        const registerButton = await browser.findElement(By.css('button[name=register]'))
        await registerButton.click()
    })

    step('Log in', async browser => {
        console.log(JSON.stringify(user))
        await browser.visit(config.frontendUrl + '/login')
        await browser.type(By.css('input[name=username]'), String(user.username))
        await browser.type(By.css('input[name=password]'), String(user.password))
        const loginButton = await browser.findElement(By.css('button[name=login]'))
        await loginButton.click()
    })

    step('Visit Homepage', async browser => {
        await browser.visit(config.frontendUrl + '/')
    })

    step('Like post', async browser => {
        await browser.visit(config.frontendUrl + '/')
        const likeButton = await browser.maybeFindElement(By.css('input[type=hidden][name=postId] ~ button[type=submit]'))
        await likeButton?.click();

        console.log(`${user.username} liked a post: ${browser.getUrl()}`)
    })

    step('Visit Timeline', async browser => {
        await browser.visit(config.frontendUrl + '/my-timeline')
    })

    step('Create text post', async (browser, data) => {
        const posts: [TextPost] = data[TEXTPOSTS_KEY].posts
        const post = posts[getRandomInt(posts.length)]

        await browser.visit(config.frontendUrl + '/')
        await browser.type(By.css('textarea[id=message]'), String(post.text))
        const postButton = await browser.findElement(By.css('button[name=postSubmit]'))
        await postButton.click()
        console.log(`${user.username} posted text: '${post.text}'`)
    })

    step('Create URL post', async (browser, data) => {
        const posts: [UrlPost] = data[URLPOSTS_KEY].posts
        const post: UrlPost = posts[getRandomInt(posts.length)]

        await browser.visit(config.frontendUrl + '/')

        const imgUrlButton = await browser.findElement(By.css('a[id=url-tab]'))
        await imgUrlButton.click()
        await browser.type(By.css('textarea[id=urlmessage]'), String(post.url))
        await browser.type(By.css('textarea[id=header]'), String(post.language))
        const postButton = await browser.findElement(By.css('button[name=postSubmit]'))
        await postButton.click()

        console.log(`${user.username} posted URL: '${post.url}'`)
    })

    step('Create image post', async (browser, data) => {
        const posts: [ImageUrlPost] = data[IMGPOSTS_KEY].posts
        const post: ImageUrlPost = posts[getRandomInt(posts.length)]

        await browser.visit(config.frontendUrl + '/')

        const imgUrlButton = await browser.findElement(By.css('a[id=image-tab]'))
        await imgUrlButton.click()
        await browser.type(By.css('textarea[id=imgurl]'), String(post.url))
        await browser.type(By.css('textarea[id=description]'), String(post.text))
        const postButton = await browser.findElement(By.css('button[name=postSubmit]'))
        await postButton.click()

        console.log(`${user.username} posted image: '${post.url}'`)
    })

    step('Update bio text', async (browser, data) => {
        const bioList: [Bio] = data[BIOLIST_KEY].bioList
        const bio: Bio = bioList[getRandomInt(bioList.length)]

        await browser.visit(`${config.frontendUrl}/user/${username}`)

        const enableMarkdownCheckbox = await browser.findElement(By.css('input[id=enableMarkdown]'))
        if (bio.isMarkdown) {
            const isChecked = await enableMarkdownCheckbox.isSelected()
            if (!isChecked) {
                await enableMarkdownCheckbox.click()
            }
        }
        await browser.type(By.css('textarea[name=bioText]'), String(bio.text))

        const postButton = await browser.findElement(By.css('button[name=postBio]'))
        await postButton.click()

        console.log(`${user.username} updated bio: '${bio.text}'`)
    })

    step('Visit Users page and search for admanager', async browser => {
        await browser.visit(config.frontendUrl + '/users')

        const searchBar = await browser.findElement(By.css('input[name=name]'))
        await searchBar.type("admanager")

        const searchButton = await browser.findElement(By.css('input[name=name] ~ button[type=submit]'))
        await searchButton.click()

        console.log(`${user.username} searched for admanager user.`)
    })

    step('Upgrade to PRO membership', async (browser, _) => {
        await browser.visit(`${config.frontendUrl}/membership`)

        await browser.type(By.css('input[id=membershipInputList]'), "PRO")

        const postButton = await browser.findElement(By.css('button[name=postMembership]'))
        await postButton.click()

        console.log(`${user.username} upgraded to PRO membership'`)
    })

    step('Log out', async browser => {
        const logoutButton = await browser.findElement(By.css('button[name=navLogoutButton]'))
        await logoutButton.click()
    })
}
