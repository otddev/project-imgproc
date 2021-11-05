# Udacity Project: Image Processing API Engine
Udacity Project: Image Processing API Engine
mailto:gerardo@onetechdude.com

<div id="top"></div>

## About Project

This is sample projected created for Udacity course in regards fullstack development courses.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

The web service was based on NodeJS + TypeScript Syntax

## Getting Started

### Installation
1. Clone the repo into a desired local location.
2. Go to the directory of the repro and run "npm install" to install package dependencies.

 ### Running
- "npm run format" : The command will re-format the code to meet guidelines set on the prettier config.
- "npm run test: The command will run tests against the servie to validate all is working order.
- "npm run lint: Validate the code formatting to be sure is clean.
- "npm run build: Build a distributable version of the code for easy installation in production.
- "npm run clean: Clean the folder where the distributed version exist.
- "npm run start: Start the service with nodemon for testing and debugging.
- "npm run dist: Start the service using the distributed version.

<p align="right">(<a href="#top">back to top</a>)</p>
### API Examples

To get a list of available images saved in the reprosatory.
```
GET http://<IP>/api/images/
```

To get a specific image file within the reprosatory.
```
GET http://<IP>/api/images/<filename>
```

To get the metadata information of a specific image file.
```
GET http://<IP>/api/images/<filename>/meta
```

To change the size of the image file.
```
GET http://<IP>/api/images/<filename>?width=200&height=200
```

### Logging
The service utilized its own logging system for troubleshooting.
```
2021-11-05 00:36:23:3623 info: Server Started | Port:3000
2021-11-05 00:36:31:3631 info: A pre-existing converted file has been provided.
2021-11-05 00:36:31:3631 debug: file request: /Users/angarcia/Projects/udacity-project-imgproc/images/thumb/thumb_265x266_icelandwaterfall.jpg
2021-11-05 00:36:31:3631 http: GET /api/images/icelandwaterfall.jpg?width=265&height=266 200 10936 - 13.614 ms
2021-11-05 00:36:35:3635 info: A pre-existing converted file has been provided.
2021-11-05 00:36:35:3635 debug: file request: /Users/angarcia/Projects/udacity-project-imgproc/images/thumb/thumb_265x266_icelandwaterfall.jpg
2021-11-05 00:36:35:3635 http: GET /api/images/icelandwaterfall.jpg?width=265&height=266 200 10936 - 4.188 ms
2021-11-05 00:36:42:3642 error: The file requested is not an image.
2021-11-05 00:36:42:3642 http: GET /api/images/temp 401 72 - 2.781 ms

```

### Contact

Antonio Garcia
Mail: mailto:gerardo@onetechdude.com
Project Link: https://github.com/otddev/udacity-project-imgproc/

<p align="right">(<a href="#top">back to top</a>)</p>
