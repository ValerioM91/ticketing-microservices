import mongoose from 'mongoose'
import { Password } from '../services/password'

type UserAttrs = {
  email: string
  password: string
}

type UserDoc = mongoose.Document & UserAttrs

type UserModel = mongoose.Model<UserDoc> & {
  build(attrs: UserAttrs): UserDoc
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret.__v
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
