const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.static('./'))

app.get('/', function (req, res) {
  res.send(fs.readFileSync('./index.html', {
    encoding: 'UTF-8'
  }))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})