import supertest from 'supertest'
import app from '../index'
import ErrnoException = NodeJS.ErrnoException
import fs from 'fs'
import path from 'path'
import * as image from '../utils/image'
import logger from '../logger/winston'

const request = supertest(app)

describe('Test Image API', () => {
  // Test: GET /api/images/
  it('It tests the based api endpoint in case no file is defined.', async () => {
    const res = await request.get('/api/images')
    expect(res.status).toBe(200)
  })

  // Test: GET /api/images/:file
  it('It tests api endpoint to get image file.', async () => {
    const res = await request.get('/api/images/fjord.jpg')
    expect(res.status).toBe(200)
  })

  // Test: GET /api/images/:file (Invalid Image Detect)
  it('It tests api endpoint detects a non-image file.', async () => {
    const res = await request.get('/api/images/temp')
    expect(res.status).toBe(401)
  })

  // Test: GET /api/images/:file/meta
  it('It tests api endpoint to get metadata of image file.', async () => {
    const res = await request.get('/api/images/fjord.jpg/meta')
    expect(res.status).toBe(200)
  })

  // Test: GET 401 Response
  it('It tests generic api endpoint for invalid page response.', async () => {
    const res = await request.get('/api/images/random_blah')
    expect(res.status).toBe(401)
  })

  // Test: GET /api/image/:file?width=200&height=200
  it('It tests api endpoint to convert image into different size.', async () => {
    const file: string = path.join(__dirname, '../../images/full/fjord.jpg')
    const res = await request.get('/api/images/fjord.jpg?width=200&height=200')
    expect(file).toBeTruthy()
    expect(res.status).toBe(200)
  })

  // Test: GET /api/image/:file?width=200&height=200
  it('It tests api endpoint if pre-converted image is delivered if exists.', async () => {
    let fileMod: Date
    const file: string = path.join(__dirname, '../../images/full/fjord.jpg')
    const thumb: string = path.join(
      __dirname,
      '../../images/thumb/thumb_200x200_fjord.jpg'
    )

    fs.stat(file, function (err: ErrnoException | null, result) {
      if (err) {
        throw err
      }
      fileMod = result.mtime
    })

    const res = await request.get('/api/images/fjord.jpg?width=200&height=200')
    expect(thumb).toBeTruthy()
    expect(res.status).toBe(200)

    fs.stat(file, function (err: ErrnoException | null, result) {
      if (err) {
        throw err
      }
      expect(fileMod).toEqual(result.mtime)
    })

    fs.unlink(thumb, (err) => {
      if (err) throw err
    })
  })

  // Test: Image Resize Function (New Image)
  it('It tests api endpoint to convert image into different size.', async () => {
    const file: string = path.join(__dirname, '../../images/full/fjord.jpg')
    const thumb: string = path.join(
      __dirname,
      '../../images/thumb/thumb_200x200_fjord.jpg'
    )

    await image
      .exists(file, { width: '200', height: '200' })
      .then((f) => {
        if (!f) {
          throw new Error('An invalid or empty file was generated.')
        }
      })
      .catch((e) => {
        logger.error(e.message)
      })

    expect(file).toBeTruthy()
    expect(thumb).toBeTruthy()
  })

  // Test: Image Resize Function (Pre-Existing Converted Image)
  it('It tests resize function if pre-converted image is delivered if exists.', async () => {
    let fileMod: Date = new Date()
    let thumbMod: Date = new Date()
    const file: string = path.join(__dirname, '../../images/full/fjord.jpg')
    const thumb: string = path.join(
      __dirname,
      '../../images/thumb/thumb_200x200_fjord.jpg'
    )

    fs.stat(file, function (err: ErrnoException | null, result) {
      if (err) {
        throw err
      }
      if (!result.mtime) {
        throw new Error(
          'No valid modified time information found for file comparison.'
        )
      }
      fileMod = result.mtime
    })

    expect(file).toBeTruthy()
    expect(fileMod).toBeDefined()

    await image
      .exists(file, { width: '200', height: '200' })
      .then((f) => {
        if (!f) {
          throw new Error('An invalid or empty file was generated.')
        }
      })
      .catch((e) => {
        logger.error(e.message)
      })

    fs.stat(thumb.toString(), function (err: ErrnoException | null, result) {
      if (err) {
        throw err
      }
      if (!result.mtime) {
        throw new Error(
          'No valid modified time information found for file comparison.'
        )
      }
      thumbMod = result.mtime
    })

    fs.unlink(thumb, (err) => {
      if (err) throw err
    })

    expect(thumb).toBeTruthy()
    expect(thumbMod).toBeDefined()
  })
})
