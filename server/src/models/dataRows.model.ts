import mongoose, { Schema, Document } from 'mongoose';

const DataRowSchema = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
    },
    { timestamps: true }
);

export interface IDataRow extends Document {
    name: string;
    date: Date;
    amount: number;
}

const DataRow = mongoose.model<IDataRow>('DataRow', DataRowSchema);
export default DataRow;
