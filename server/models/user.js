const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'}
  },
  resetToken: String,
  resetTokenExp: Date,
  twitter: {},
  google: {},
  facebook: {}
});

userSchema.pre('save', function() {
  const hashedPass = bcrypt.hashSync(this.password, 12)
  this.password = hashedPass
})

userSchema.methods.hashPassword = (password) => bcrypt.hashSync(password, bcrypt.getSaltSync(8), null)

userSchema.methods.validatePassword = (password) => bcrypt.compareSync(password, this.password)

module.exports = mongoose.model('User', userSchema)