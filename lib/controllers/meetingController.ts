import * as mongoose from 'mongoose';
import { MeetingSchema } from '../schemas/meetingSchema';
import { Meeting } from 'models/meetingModel';

const MeetingDB = mongoose.model('Meeting', MeetingSchema);
export class MeetingController{

    public getMeetings () {
        return new Promise((resolve, reject) =>{
            MeetingDB.find({}, (err, meetings: Meeting[]) => {
                if(err){
                    reject(err);
                }
                meetings.sort(function(a: Meeting,b: Meeting){
                    if (b.getStartTime > a.getEndTime)    return -1;
                    else if(b.getStartTime < a.getEndTime) return  1;
                    else return 0;
                });
                resolve(meetings);
            });
        })
    }

    public createMeeting (meeting: Meeting) {
        return new Promise((resolve, reject) =>{
            let scheduleStart: Number = 9, scheduleEnd: Number = 18;

            console.log(meeting.getStartTime().getHours());
            console.log(scheduleStart);


            console.log(meeting.getEndTime().getHours());
            console.log(scheduleEnd);


            console.log(meeting.getStartTime() < meeting.getEndTime());

            console.log(meeting.getStartTime().getHours() >= scheduleStart);
            console.log(meeting.getEndTime().getHours() <= scheduleEnd);

            if(meeting.getStartTime() < meeting.getEndTime() && meeting.getStartTime().getHours() >= scheduleStart && meeting.getEndTime().getHours() <= scheduleEnd)
            {
                console.log("ok");
                MeetingDB.create(meeting, (err) => {
                    if(err){
                        reject(err);
                    }
                    resolve();
                });
            } else {
                console.log("no ok");
                reject();
            }
        })
    }

}