import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "EMPLOYEE"
    }
});