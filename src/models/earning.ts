import mongoose, {Document, Schema, Model} from 'mongoose';

export interface IEarning extends Document {

    creditEarning: Number,
    planEarning: Number
}

export interface IEarningModel extends Model < IEarning > {}

const EarningSchema: Schema = new Schema({
    creditEarning: {
        type: Number,
        required: true
    },
    planEarning: {
        type: Number,
        required: true
    }


}, {timestamps: true})

const Earning = mongoose.model<IEarning, IEarningModel>('Earning', EarningSchema);

export default Earning;
