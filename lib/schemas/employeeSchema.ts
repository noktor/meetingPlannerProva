import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const EmployeeSchema = new Schema({
    _id: {
        type: String,
        required: false
    },
    userName: {
        type: String,
        required: true
    },
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