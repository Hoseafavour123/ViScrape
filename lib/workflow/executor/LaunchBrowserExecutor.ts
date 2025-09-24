import puppeteer from 'puppeteer'
import { ExecutionEnvironment } from '@/types/executor'
import { LaunchBrowserTask } from '../task/LaunchBrowser'



const BROWSER_WS='wss://brd-customer-hl_771ebbfa-zone-scraping_browser1:3f7ujuf4a2f1@brd.superproxy.io:9222'

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean> {
    try {
        const websiteUrl = environment.getInput('Website Url')
        const browser = await puppeteer.connect({
            browserWSEndpoint: BROWSER_WS,

        })
        environment.log.info('Browser started successfully')
        environment.setBrowser(browser)

        const page = await browser.newPage();
        page.setViewport({ width: 2000, height: 1200 })

        await page.goto(websiteUrl);
        environment.setPage(page);
        environment.log.info(`Opened page at: ${websiteUrl}`)
        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false       
    }
} 