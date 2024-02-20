import { Router } from 'express'
import { scrapperService } from '../services/scrapper-service'

const scrapRoutes = Router()

scrapRoutes.post('/', async (req, res) => {
  console.log(req.body)
  await scrapperService(req, res)
})

export { scrapRoutes as scrapperController }
