const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// userSchema.methods.hashPassword = (password) => bcrypt.hashSync(password, bcrypt.getSaltSync(12), null)

// userSchema.methods.validatePassword = (password) => {
//   return bcrypt.compareSync(password, this.password)}

// // userSchema.plugin(passportLocalMongoose, {
// //   usernameField: 'email'
// // });
// Model Methods
userSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

userSchema.statics.upsertFbUser = async function ({ accessToken, refreshToken, profile }) {
  const User = this;

  const user = await User.findOne({ 'social.facebookProvider.id': profile.id });

  // no user was found, lets create a new one
  if (!user) {
      const newUser = await User.create({
          name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
          email: profile.emails[0].value,
          'social.facebookProvider': {
              id: profile.id,
              token: accessToken,
          },
      });

      return newUser;
  }
  return user;
};

userSchema.statics.upsertGoogleUser = async function ({ accessToken, refreshToken, profile }) {
  const User = this;

  const user = await User.findOne({ 'social.googleProvider.id': profile.id });

  // no user was found, lets create a new one
  if (!user) {
      const newUser = await User.create({
          name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
          email: profile.emails[0].value,
          'social.googleProvider': {
              id: profile.id,
              token: accessToken,
          },
      });

      return newUser;
  }
  return user;
};

module.exports = mongoose.model('User', userSchema)