import mongoose, {Document, Schema, Model} from 'mongoose';

export interface IPrice extends Document {
    plan: string,
    price: Number,
    creditPrice: Number,
    subs_price: Number
}

export interface IPriceModel extends Model < IPrice > {}

const PriceSchema: Schema = new Schema({
    plan: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    creditPrice: {
        type: String,
        require: true
    },
    subs_price: {
        type: String,
        require: true
    }

}, {timestamps: true})

const Price = mongoose.model<IPrice, IPriceModel>('Price', PriceSchema);

export default Price;
