import mongoose, {Document, Schema, Model} from 'mongoose';

export interface IUser extends Document {
    uid: string;
    name: string;
    email: string;
    password: string;
    role: string;
    phN: string;
    gid: string;
    token: number;
    plan: string;
}

export interface IUserModel extends Model < IUser > {}

const userSchema: Schema = new Schema({
    uid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    phN: {
        type: String,
        required: false
    },
    gid: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    token: {
        type: Number,
        required: true,
        default: 0
    },
    plan: {
        type: String,
        required: true,
        default: "free"
    }
}, {timestamps: true})

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
