const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  password: {
    type: String
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

// Model Methods
userSchema.methods.generateJWT = function () {
  console.log('gerate JWT: ', this)
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  return jwt.sign({
      email: this.email || this.name,
      id: this._id,
      exp: (expirationDate.getTime() / 1000, 10),
  }, process.env.JWT_SECRET);
}

module.exports = mongoose.model('User', userSchema)