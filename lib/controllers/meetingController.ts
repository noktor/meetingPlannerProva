import * as mongoose from 'mongoose';
import { MeetingSchema } from '../schemas/meetingSchema';
import { EmployeeSchema } from '../schemas/employeeSchema';
import { Meeting } from 'models/meetingModel';
import { Employee } from '../models/employeeModel';
import { Availability } from '../models/availabilityModel';
import * as moment from 'moment';

const MeetingDB = mongoose.model('Meeting', MeetingSchema);
const EmployeeDB = mongoose.model('Employee', EmployeeSchema);

const WORKING_HOURS_START: Number = 9, WORKING_HOURS_END: Number = 18;

export class MeetingController{

    public getMeetings () {
        return new Promise((resolve, reject) =>{
            MeetingDB.find(
            {},
            (err, meetings: Meeting[]) => {
                if(err){
                    reject(err);
                }
                meetings.sort(function(a: Meeting,b: Meeting){
                    if (b.startTime > a.endTime)    return -1;
                    else if(b.startTime < a.endTime) return  1;
                    else return 0;
                });
                resolve(meetings);
            });
        })
    }

    public createMeeting (meeting: Meeting) {
        return new Promise((resolve, reject) =>{
            if(meeting.getStartTime() < meeting.getEndTime() && meeting.getStartTime().getUTCHours() >= WORKING_HOURS_START && meeting.getEndTime().getUTCHours() <= WORKING_HOURS_END)
            {
                MeetingDB.create(meeting, (err) => {
                    if(err){
                        reject(err);
                    }
                    resolve();
                });
            } else {
                reject();
            }
        })
    }

    public checkAvailableSpots (fromDate: Date, toDate: Date, employees: String[]) {
        return new Promise(async (resolve, reject) =>{
            let employeeList: Employee[] = [];
            for(let employee of employees){
                let meetings = await MeetingDB.find(
                {
                    $and: 
                    [
                        {startTime:{$gte: fromDate}},
                        {endTime:{$lte: toDate}},
                        {attendants:{$all:[employee]}}
                    ]
                })
                .sort({startTime: 1})
                .catch(err => {
                    if(err){
                        reject(err);
                    }
                });

                let employeeFound = await EmployeeDB.findOne(
                {
                    _id: employee
                })
                .catch(err => {
                    if(err){
                        reject(err);
                    }
                });

                let nDays: Number = moment(toDate.getTime()).diff(moment(fromDate.getTime()), "days");
                let employeeModel: Employee = new Employee(employeeFound.name, employeeFound.surname, employeeFound.role, []);

                for(let meeting of meetings)
                {
                    employeeModel.addAvailableSlot(new Availability(meeting.startTime, meeting.endTime, false));
                }

                if(employeeModel.getAvailability()[0].getFrom() > fromDate && employeeModel.getAvailability()[0].getFrom().getUTCHours() > WORKING_HOURS_START)
                employeeModel.addAvailableSlot(new Availability(fromDate, employeeModel.getAvailability()[0].getFrom()));
                
                if(employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo() < toDate && employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo().getUTCHours() < WORKING_HOURS_END)
                employeeModel.addAvailableSlot(new Availability(employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo(), toDate));

                employeeModel.setAvailability(employeeModel.getAvailability().sort((a: Availability,b: Availability)=>{
                    if (b.to > a.from)    return -1;
                    else if(b.to < a.from) return  1;
                    else return 0;
                }));

                let finalAvailability: Availability[] = [];
                for(let i = 0; i < employeeModel.getAvailability().length-1; i++){
                    if(employeeModel.getAvailability()[i].getTo() != employeeModel.getAvailability()[i+1].getFrom())
                    {
                        finalAvailability.push((new Availability(employeeModel.getAvailability()[i].getTo(), employeeModel.getAvailability()[i+1].getFrom())));
                    }
                }

                for(let available in finalAvailability){
                    employeeModel.addAvailableSlot(finalAvailability[available]);
                }
                employeeModel.setAvailability(employeeModel.getAvailability().sort((a: Availability,b: Availability)=>{
                    if (b.to > a.from)    return -1;
                    else if(b.to < a.from) return  1;
                    else return 0;
                }));

                
                employeeList.push(employeeModel);
            }

            //console.log(employeeList);
            // if(meetings.length > 0)
            // {
            //     resolve();
            // }
            // else
            // {
            //     reject()
            // }
            resolve(employeeList);
        })
    }
}