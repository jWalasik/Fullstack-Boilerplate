const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    unique: true
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
  console.log('presave', this.password)
  const hashedPass = bcrypt.hashSync(this.password, 12)
  this.password = hashedPass
})

// Model Methods
userSchema.statics.getUser = function ({accessToken, cookie}) {
  if(!accessToken){
    return jwt.verify(cookie.replace('token=', ''), process.env.JWT_REFRESH_SECRET, async (err, decoded)=>{
      if(err) return new Error(err)
      await this.findById(decoded.user.id)
        .then(user => {
          //const tokens = user.generateJWT()
          return {user}
        })
        .then(data=>{
          return data
        })
    })
  } else if (accessToken) {
    return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded)=>{
      if(err) return new Error(err)
      return {decoded, accessToken}
    })
  }
}
userSchema.methods.generateJWT = async function () {
  const long = new Date().getTime() + 60*60*24*7*1000 //7 days for refresh token
  const short = new Date().getTime() + 60*15*1000 //15min for access token
  const accessUser = {
    name: this.email || this.name,
    id: this._id,
  }
  const accessToken = jwt.sign(
    {user: accessUser}, 
    process.env.JWT_ACCESS_SECRET,
    {expiresIn: short}
  )
  const refreshUser = {
    name: this.email || this.name,
    id: this._id,
    count: this.tokenCount
  }
  const refreshToken = jwt.sign(
    {user: refreshUser},
    process.env.JWT_REFRESH_SECRET,
    {expiresIn: long}
  )

  return {accessToken, refreshToken}
}

module.exports = mongoose.model('User', userSchema)