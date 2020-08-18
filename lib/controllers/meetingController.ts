import * as mongoose from 'mongoose';
import { MeetingSchema } from '../schemas/meetingSchema';
import { Request, Response } from 'express';
import { Meeting } from 'models/meetingModel';

const MeetingDB = mongoose.model('Meeting', MeetingSchema);
export class MeetingController{

    public getMeetings () {
        return new Promise((resolve, reject) =>{
            MeetingDB.find({}, (err, meetings) => {
                if(err){
                    reject(err);
                }
                meetings.sort(function(a: Meeting,b: Meeting){
                    if (b.getStartTime() > a.getEndTime())    return -1;
                    else if(b.getStartTime() < a.getEndTime()) return  1;
                    else return 0;
                });
                resolve(meetings);
            });
        })
        
    }

}