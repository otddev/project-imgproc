import fs from 'fs'
import sharp from 'sharp'
import ErrnoException = NodeJS.ErrnoException
import path from 'path'
import logger from '../logger/winston'
import QueryString from 'qs'

interface metadata {
  name: string
  ext: string
  location: string
  format: string | undefined
  path: string
  density: number | undefined
  size: number | undefined
  width: number | undefined
  height: number | undefined
}

export function exists(file: string, query: QueryString.ParsedQs | null) {
  return new Promise<ErrnoException | string>(function (resolve, reject) {
    fs.stat(file, function (err: ErrnoException | null, result) {
      if (err) {
        return reject(err)
      } else if (!result.isFile()) {
        return reject('The file requested is not an image.')
      }

      if (query) {
        sharp(file).metadata((err: Error, meta) => {
          if (err) {
            return reject(err)
          }

          const h: number | undefined = query['height']
            ? parseInt(query['height'].toString(), 10)
            : meta?.height
          const w: number | undefined = query['width']
            ? parseInt(query['width'].toString(), 10)
            : meta?.width

          const thumb: string = path.join(
            __dirname,
            '../../images/thumb/',
            'thumb_' + w + 'x' + h + '_' + path.basename(file)
          )
          if (h === meta.height && w === meta.width) {
            return resolve(file)
          } else {
            // If the converted file still exists do not redo action.
            sharp(thumb).metadata((err: Error, thumb_meta) => {
              if (err) {
                logger.debug(
                  'A thumb version does not exist so new one will be created.'
                )
              } else {
                if (thumb_meta.height === h && thumb_meta.width === w) {
                  logger.info(
                    'A pre-existing converted file has been provided.'
                  )
                  return resolve(thumb)
                }
              }

              sharp(file)
                .resize({ width: w, height: h, fit: 'fill' })
                .toFile(thumb)
                .then(() => {
                  logger.info('The file has been converted successfully.')
                  return resolve(thumb)
                })
                .catch((err) => {
                  return reject(err)
                })
            })
          }
        })
      } else {
        logger.info('The original file has been requested.')
        resolve(file)
      }
    })
  })
}

export function meta(file: string) {
  return new Promise<ErrnoException | metadata>(function (resolve, reject) {
    fs.stat(file, function (err: ErrnoException | null, result) {
      if (err) {
        return reject(err)
      } else if (!result.isFile()) {
        return reject('The file requested is not an image.')
      }
      sharp(file).metadata((err: Error, meta) => {
        if (err) {
          return reject(err)
        }

        resolve({
          name: path.basename(file).replace(path.extname(file), ''),
          ext: path.extname(file),
          location: path.dirname(file),
          format: meta.format,
          path: file,
          density: meta.density,
          size: result.size,
          width: meta.width,
          height: meta.height
        })
      })
    })
  })
}

export function check_dir(folder: string) {
  return new Promise<ErrnoException | string[]>(function (resolve, reject) {
    fs.readdir(folder, function (err: ErrnoException | null, result) {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  })
}
