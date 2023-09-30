import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document{
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IUserModel extends Model<IUser> {
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
}, { timestamps: true })

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
