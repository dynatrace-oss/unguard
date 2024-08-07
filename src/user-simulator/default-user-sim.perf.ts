'use strict'
import fs from 'fs'
import {Bio, BioList, Config, ImageUrlPost, TextPost, UrlPost, User} from './types'
import puppeteer from 'puppeteer'

const random_ips_pub = [
    '177.236.37.155',
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
    '113.167.100.35',
]

const random_ips_priv = [
    '10.0.1.2',
    '192.168.10.1',
    '192.168.10.5',
    '192.168.10.10',
    '172.16.10.10',
]

const privateRanges = process.env.SIMULATE_PRIVATE_RANGES === 'true'

const ip = privateRanges
    ? random_ips_priv[getRandomInt(random_ips_priv.length)]
    : random_ips_pub[getRandomInt(random_ips_pub.length)]

function checkEnvVariable(envVar: string) {
    if (!process.env[envVar]) {
        console.error(`env variable ${envVar} is not set.`)
        throw Error(`env variable ${envVar} is not set.`)
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

function delay(time: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

const textPosts: TextPost[] = JSON.parse(fs.readFileSync('./data/textposts.json', 'utf-8')).posts
const imgPosts: ImageUrlPost[] = JSON.parse(fs.readFileSync('./data/imgposts.json', 'utf-8')).posts
const urlPosts: UrlPost[] = JSON.parse(fs.readFileSync('./data/urlposts.json', 'utf-8')).posts
const bioList: Bio[] = (JSON.parse(fs.readFileSync('./data/biolist.json', 'utf-8')) as BioList).bioList

;(async () => {
    checkEnvVariable('FRONTEND_ADDR')

    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']})
    const page = await browser.newPage()
    await page.setUserAgent('simulated-browser-user')
    await page.setExtraHTTPHeaders({'X-Client-Ip': ip})

    const config: Config = {frontendUrl: 'http://' + process.env.FRONTEND_ADDR}
    const username = 'ROBOT_' + getRandomInt(10000).toString(16)

    const user: User = {username: username, password: username}

    try {
        await register(page, config, user)
        await login(page, config, user)
        await visitHomepage(page, config)
        await likePost(page, config, user)
        await visitTimeline(page, config)
        await createTextPost(page, config, user, textPosts)
        await createUrlPost(page, config, user, urlPosts)
        await createImagePost(page, config, user, imgPosts)
        await updateBioText(page, config, user, bioList)
        await visitUsersPageAndSearch(page, config)
        await upgradeToProMembership(page, config, user)
        await addCreditCardInformation(page, config, user)
        await logout(page, config)
    } catch (e: any) {
        console.error(e);
        await browser.close()
        process.exit(1);
    }
    await browser.close()
    process.exit(0);
})()

async function register(page: puppeteer.Page, config: Config, user: User) {
    await page.goto(config.frontendUrl + '/login')
    await page.type('input[name=username]', user.username)
    await page.type('input[name=password]', user.password)
    await page.click('button[name=register]')
    await delay(3000) // wait for 3 seconds
}

async function login(page: puppeteer.Page, config: Config, user: User) {
    await page.goto(config.frontendUrl + '/login')
    await page.type('input[name=username]', user.username)
    await page.type('input[name=password]', user.password)
    await page.click('button[name=login]')
    await delay(3000) // wait for 3 seconds
}

async function visitHomepage(page: puppeteer.Page, config: Config) {
    await page.goto(config.frontendUrl + '/')
    await delay(5000)
}

async function likePost(page: puppeteer.Page, config: Config, user: User) {
    await page.goto(config.frontendUrl + '/')
    const likeButton = await page.$('input[type=hidden][name=postId] ~ button[type=submit]')
    if (likeButton) {
        await likeButton.click()
        console.log(`${user.username} liked a post.`)
    }
    await delay(3000) // wait for 3 seconds
}

async function visitTimeline(page, config) {
    await page.goto(config.frontendUrl + '/my-timeline')
    await delay(5000) // wait for 5 seconds
}

async function createTextPost(page: puppeteer.Page, config: Config, user: User, textPosts: TextPost[]) {
    const post = textPosts[getRandomInt(textPosts.length)]
    await page.goto(config.frontendUrl + '/')
    await page.type('textarea[id=message]', post.text)
    await page.click('button[name=postSubmit]')
    console.log(`${user.username} posted text: '${post.text}'`)
    await delay(3000) // wait for 3 seconds
}

async function createUrlPost(page: puppeteer.Page, config: Config, user: User, urlPosts: UrlPost[]) {
    const post = urlPosts[getRandomInt(urlPosts.length)]
    await page.goto(config.frontendUrl + '/')
    await page.click('a[id=url-tab]')
    await page.type('textarea[id=urlmessage]', post.url)
    await page.type('textarea[id=header]', post.language)
    await page.click('button[name=postSubmit]')
    console.log(`${user.username} posted URL: '${post.url}'`)
    await delay(3000) // wait for 3 seconds
}

async function createImagePost(page: puppeteer.Page, config: Config, user: User, imgPosts: ImageUrlPost[]){
    const post = imgPosts[getRandomInt(imgPosts.length)]
    await page.goto(config.frontendUrl + '/')
    await page.click('a[id=image-tab]')
    await page.type('textarea[id=imgurl]', post.url)
    await page.type('textarea[id=description]', post.text)
    await page.click('button[name=postSubmit]')
    console.log(`${user.username} posted image: '${post.url}'`)
    await delay(3000) // wait for 3 seconds
}

async function updateBioText(page: puppeteer.Page, config: Config, user: User, bioList: Bio[]){
    const bio = bioList[getRandomInt(bioList.length)]
    await page.goto(`${config.frontendUrl}/user/${user.username}`)
    if (bio.isMarkdown) {
        const enableMarkdownCheckbox = await page.$('input[id=enableMarkdown]')
        if (!enableMarkdownCheckbox) {
            throw Error('Markdown checkbox not found');
        }
        const isChecked = await (await enableMarkdownCheckbox.getProperty('checked')).jsonValue()
        if (!isChecked) {
            await enableMarkdownCheckbox.click()
        }
    }
    await page.type('textarea[name=bioText]', bio.text)
    await page.click('button[name=postBio]')
    console.log(`${user.username} updated bio: '${bio.text}'`)
    await delay(3000) // wait for 3 seconds
}

async function visitUsersPageAndSearch(page: puppeteer.Page, config: Config){
    await page.goto(config.frontendUrl + '/users')
    await page.type('input[name=name]', 'admanager')
    await page.click('input[name=name] ~ button[type=submit]')
    console.log(`Searched for admanager user.`)
    await delay(3000) // wait for 3 seconds
}

async function upgradeToProMembership(page: puppeteer.Page, config: Config, user: User){
    await page.goto(`${config.frontendUrl}/membership`)
    await page.type('input[id=membershipInputList]', 'PRO')
    await page.click('button[name=postMembership]')
    console.log(`${user.username} upgraded to PRO membership`)
    await delay(3000) // wait for 3 seconds
}

async function addCreditCardInformation(page: puppeteer.Page, config: Config, user: User){
    await page.goto(`${config.frontendUrl}/user/${user.username}/payment`)
    await page.type('input[id=cardHolderName]', user.username)
    await page.type('input[id=cardNumber]', '4556737586899855')
    await page.type('input[id=expiryDate]', '11/31')
    await page.type('input[id=cvv]', '123')
    await page.click('button[name=updatePaymentInfo]')
    console.log(`${user.username} added credit card information`)
    await delay(3000) // wait for 3 seconds
}

async function logout(page: puppeteer.Page, config: Config) {
    await page.goto(`${config.frontendUrl}`)
    await page.click('#dropdownUser')
    await page.click('button[name=navLogoutButton]')
    console.log('Logged out')
    await delay(3000) // wait for 3 seconds
}
