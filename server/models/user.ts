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
    required: true,
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
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  return jwt.sign({
      email: this.email,
      id: this._id,
      exp: (expirationDate.getTime() / 1000, 10),
  }, process.env.JWT_SECRET);
}

userSchema.statics.facebookAuth = async function ({name, token, email, id }) {
  const User = this;
  const user = await User.findOne({ 'email': email });
  // no user was found, lets create a new one
  if (!user) {
      const newUser = await User.create({
          name: name,
          email: email,
          facebook: {
              id: id,
              token: token
          },
      });
      return newUser;
  }
  return user;
};

userSchema.statics.googleAuth = async function ({name, token, email, id}) {
  const User = this;
  const user = await User.findOne({ 'email': email });
  // no user was found, lets create a new one
  if (!user) {
    const newUser = await User.create({
      name: name,
      email: email,
      google: {
          id: id,
          token: token
      },
  });
      return newUser;
  }
  return user;
};

module.exports = mongoose.model('User', userSchema)