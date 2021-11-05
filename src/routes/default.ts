import express, { Request, Response } from 'express'
import images from './images/image'

const routes = express.Router()

routes.get('/', (_req: Request, res: Response) => {
  res.json({ title: 'No Data Available' })
})

routes.use('/images', images)

export default routes
