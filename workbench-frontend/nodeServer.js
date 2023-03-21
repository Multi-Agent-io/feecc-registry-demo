const path = require('path')
const express = require('express')
const app = express()
const port = 3000;

app.use(express.static(path.join(__dirname, 'target')))

app.get('/*', function (req, res){
  res.sendFile(path.join(__dirname, 'target', 'index.html'))
})

console.log(`Server started on port: ${port}`)

server = app.listen(port)

const process = require('process');
const { debug } = require('console');

process.on('SIGINT', () => {
  console.log('\n-> SIGINT. NodeJS server shotdowning..')
  server.close(() => {
    debug('Server is offline.')
  })
})

process.on('SIGTERM', () => {
  console.log('\n-> SIGTERM. NodeJS server shotdowning..')
  server.close(() => {
    debug('Server is offline.')
  })
})
