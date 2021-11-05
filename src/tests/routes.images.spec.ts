import supertest from 'supertest'
import app from '../index'
import ErrnoException = NodeJS.ErrnoException
import fs from 'fs'

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
    const res = await request.get('/api/images/fjord.jpg?width=200&height=200')
    expect(
      '/Users/angarcia/Projects/udacity-fullstack/project-imgproc/images/thumb/thumb_fjord.jpg'
    ).toBeTruthy()
    expect(res.status).toBe(200)
  })

  // Test: GET /api/image/:file?width=200&height=200
  it('It tests api endpoint if pre-converted image is delivered if exists.', async () => {
    let fileMod: Date
    fs.stat(
      '/Users/angarcia/Projects/udacity-fullstack/project-imgproc/images/thumb/thumb_fjord.jpg',
      function (err: ErrnoException | null, result) {
        if (err) {
          throw err
        }
        fileMod = result.mtime
      }
    )

    const res = await request.get('/api/images/fjord.jpg?width=200&height=200')
    expect(
      '/Users/angarcia/Projects/udacity-fullstack/project-imgproc/images/thumb/thumb_fjord.jpg'
    ).toBeTruthy()
    expect(res.status).toBe(200)

    fs.stat(
      '/Users/angarcia/Projects/udacity-fullstack/project-imgproc/images/thumb/thumb_fjord.jpg',
      function (err: ErrnoException | null, result) {
        if (err) {
          throw err
        }
        expect(fileMod).toEqual(result.mtime)
      }
    )
  })
})
