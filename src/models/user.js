const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const schema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
  },
  rememberMe: String,
})

// don't use *Sync in production
schema.statics.hashPassword = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
schema.methods.checkHashedPassword = function checkHashedPassword(password) {
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', schema)

module.exports = { User }
