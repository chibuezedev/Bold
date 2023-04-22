const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const Schema = mongoose.Schema;

const userSchema = Schema({
 
    firstName:{
        type: String,
        required: [true, 'Please add a Name'],
        trim: true,
        lowercase: true
      
     },
     lastName:{
      type: String,
      required: [true, 'Please add a Name'],
      trim: true,
      lowercase: true
    
   },
    email: { 
       type: String,
       required: true,
       unique: true,
       lowercase: true,
         validate( value ) {
          if( !validator.isEmail( value )) {
            throw new Error( 'Email is invalid, Please try again.' )
          }
        },

      },
    password: {
        type: String, 
        required: true, 
        minLength: 7, 
        trim: true,
        validate(value) {
           if( value.toLowerCase().includes('password')) {
           throw new Error('password musn\'t contain password')
          }
       },
 
    },
    profile: {
      reactions: [],
      biographyDescription: { type: String },
      profilePicture: {
        url: { type: String },
        public_id: { type: String },
      },
      coverPicture: {
        url: { type: String },
        public_id: { type: String },
    }},
    address: { 
      city:String, 
      street:String,
      number: String,
      zipcode:String,
  },
     phone: { 
      type: String, 
      required: [true, 'Please add a Phone Number'],
    },
    role: {
      type: String,
      default: 'user'
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
     tokens: [{token: { type: String, required: true }}],

     resetToken: String,
     resetTokenExpiration: Date
    }, {
      timestamps: true
    })


    userSchema.methods.generateAuthToken = async function () {
      const user = this
       const token = jwt.sign({ _id: user._id.toString()},process.env.JWT_SECRET, {expiresIn: '1h'})
      user.tokens = user.tokens.concat({token})
      await user.save()
      return token
   }


   userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('Invalid credentials, Unable to log in')
    }
     const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
       throw new Error('Unable to login')
    }
       return user
    }


   userSchema.pre('save', async function(next) {
    const user = this
       if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password, 12)
    }
      next()
    })
  

    
    userSchema.index({ username: "text" });


    const User = mongoose.model('User', userSchema)
    module.exports = User