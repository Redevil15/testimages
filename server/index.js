const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const UserModel = require('./models/users')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

mongoose.connect('mongodb+srv://brandon:brandon1@mern-blog.qjhifxk.mongodb.net/bmemorial')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

app.post('/upload', upload.array('files', 10), (req, res) => {
  const imagePaths = req.files.map(file => file.path);

  UserModel.create({image: imagePaths})
    .then(() => {
      res.send("File uploaded successfully")
      console.log("Uploaded succesfully")
    })
    .catch(err => {
      res.send(err)
    })
})

app.get('/getImage', (req, res) => {
  UserModel.find()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

app.listen(3001, () => {
  console.log("server is running on port 3001!!!")
})