import routes from './routes/default'
import logger from './logger/winston'
import express, { Request, Response, Application } from 'express'
import http_logger from './logger/morgan'

const app: Application = express()
const port = 3000

app.use(http_logger)
app.use('/api', routes)

// Handle 404 - Keep this as a last route
app.use(function (_req: Request, res: Response) {
  res.status(404).send({
    error: { status: 404, message: '404 Page Not Found' }
  })
  logger.error('404 Page Not Found')
})

try {
  app.listen(port, () => {
    logger.info(`Server Started | Port:${port}`)
  })
} catch (err) {
  logger.error(err)
}

export default app
