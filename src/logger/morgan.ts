import morgan, { StreamOptions } from 'morgan'
import logger from './winston'

// Override Stream
const stream: StreamOptions = {
  // For HTTP Only
  write: (message) =>
    logger.http(message.substring(0, message.lastIndexOf('\n')))
}

// While in production only report warnings and errors.
const skip = () => {
  const env = process.env.NODE_ENV || 'development'
  return env !== 'development'
}

const http_logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
)

export default http_logger
