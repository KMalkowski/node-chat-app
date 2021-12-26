const path = require('path')
const express = require('express')

const app = express()

const port = process.env.port || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())

app.listen(port, ()=>{
    console.log("node app listening on port" + port)
})