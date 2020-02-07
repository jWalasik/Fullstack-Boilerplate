import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

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
  resetToken: String,
  resetTokenExp: Date
});

userSchema.methods.hashPassword = (password) => bcrypt.hashSync(password, bcrypt.getSaltSync(8), null)

userSchema.methods.validatePassword = (password) => bcrypt.compareSync(password, this.password)

module.exports = mongoose.model('User', userSchema)