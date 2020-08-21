import * as mongoose from 'mongoose';
import {EmployeeSchema} from './employeeSchema';

const Schema = mongoose.Schema;

export const MeetingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    attendants: {
        type: [EmployeeSchema],
        required: true
    }
});