import { Router } from 'express'
import { scrapperController } from '../controllers/scrapper-controller'

const router = Router()

router.use('/scrap', scrapperController)

export { router }
