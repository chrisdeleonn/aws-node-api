require('dotenv/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

mongoose
.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,
})
.then(() => {
    app.listen('5000', () => {
        console.log('app is listening')
    })
})
.catch(err => console.log(err))

const UserSchema = mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
},
{ timestamps: true }
)

const UsersModel = mongoose.model('Users', UserSchema)

app.get('/users', (req, res) => {
    UsersModel.find()
    .then(allUsers => res.status(200).send(allUsers))
    .catch(err => console.log(err))
})

app.post('/users', (req, res) => {
    console.log('req body', req.body)
    new UsersModel(req.body)
    .save()
    .then(() => { 
        UsersModel.findOne({email: req.body.email})
        .then(foundUser => res.send(foundUser))
})
.catch(err => console.log(err))
    
})

app.post('/login', (req, res) => {
    UsersModel.findOne({ email: req.body.email })
      .then(userFound => {
        console.log(userFound)
        if (!userFound) {
          return res.status(404).send('User Not found')
        }
  
        if (userFound && userFound.password === req.body.password) {
          res.status(200).send('user is good to go')
        } else {
          res.status(404).send('User not authenticated')
        }
      })
  
      .catch(err => console.log(err))
  })