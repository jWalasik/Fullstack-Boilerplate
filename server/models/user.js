const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt');
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'}
  },
  isActive: {type: Boolean, default: false},
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

userSchema.methods.hashPassword = (password) => bcrypt.hashSync(password, bcrypt.getSaltSync(12), null)

userSchema.methods.validatePassword = (password) => {
  return bcrypt.compareSync(password, this.password)}

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema)