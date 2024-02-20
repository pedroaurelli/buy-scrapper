import { Request, Response } from 'express'
import puppeteer from 'puppeteer'

export async function scrapperService(req: Request, res: Response) {
  const { expectedPrice, siteURL  } = req.body
  let actualPrice: number
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(siteURL)

  await page.waitForSelector('.price')

  const result = await page.evaluate(() => {
    const price = document.querySelector('.price')
    return price?.textContent
  })

  actualPrice = +result!

  if (+actualPrice <= expectedPrice) {
    res.status(200).json({
      message: 'Actual price is equal or down to expected price',
      actualPrice,
      expectedPrice
    })
  } else {
    res.status(200).json({
      message: 'Actual price is more than expected price',
      actualPrice,
      expectedPrice
    })
  }
}
