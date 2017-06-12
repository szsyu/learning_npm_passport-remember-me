const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/learning_npm_passport-remember-me')

// configure passport
require('./passport')(passport)

const app = express()
app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  session({ secret: 'mega-secret', resave: false, saveUninitialized: true })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('remember-me'))

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use(flash())

require('./routes')(app, passport)

app.listen(3000, () => console.log('Server started on 3000.'))
