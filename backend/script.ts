import puppeteer from 'puppeteer'
import promptSync from 'prompt-sync'
import PromptSync from 'prompt-sync'

class Scrapper {
  siteURL: string
  previousPrice?: string | null
  actualPrice?: string | null
  private readonly expectedPrice: number
  prompt: PromptSync.Prompt

  constructor(siteURL: string, expectedPrice: number) {
    this.siteURL = siteURL
    this.expectedPrice = expectedPrice
    this.prompt = promptSync()
  }

  async scrap() {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.goto(this.siteURL)

    while(true) {
      await page.reload({
        waitUntil: ['domcontentloaded']
      })

      await page.waitForSelector('.price')

      const result = await page.evaluate(() => {
        const price = document.querySelector('.price')
        return price?.textContent
      })

      this.actualPrice = result!
      console.log(`previous: ${this.previousPrice}, actual: ${this.actualPrice}`)

      if (+this.actualPrice <= this.expectedPrice) {
        console.log('Actual price is equal or down to expected price')
        var answer = this.prompt('Do you want to continue observer? (y/n): ')
        if (answer === 'y') {
          console.log('Buying it...')
          break
        } else if (answer === 'n') {
          console.log('Not buying it...')
          break
        } else {
          console.log('Invalid option')
        }
        this.previousPrice = this.actualPrice
      } else if (!this.previousPrice) {
        console.log('First time')
        this.previousPrice = this.actualPrice
      } else {
        console.log('Actual price more than expected')
        this.previousPrice = this.actualPrice
      }
    }
  }
}

const index = new Scrapper('http://127.0.0.1:5500/index.html', 500)

index.scrap()
