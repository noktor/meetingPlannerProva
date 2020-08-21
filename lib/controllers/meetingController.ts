import * as mongoose from 'mongoose';
import { MeetingSchema } from '../schemas/meetingSchema';
import { EmployeeSchema } from '../schemas/employeeSchema';
import { Meeting } from 'models/meetingModel';
import { Employee } from '../models/employeeModel';
import { Availability } from '../models/availabilityModel';
import * as moment from 'moment';

const MeetingDB = mongoose.model('Meeting', MeetingSchema);

const WORKING_HOURS_START: Number = 9, WORKING_HOURS_END: Number = 18;

export class MeetingController{

    public getMeetings (employees: string[]) {
        return new Promise((resolve, reject) =>{
            let query: object = {};
            if(employees.length > 0){
                let conditions: object[] = [];
                for(let employee of employees)
                {
                    conditions.push({ 'attendants._id': employee });
                }
                query = { $and: conditions };
            }
            MeetingDB.find(
            query,
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
        return new Promise(async (resolve, reject) =>{
            if(meeting.getStartTime() < meeting.getEndTime()
            && meeting.getStartTime().getUTCHours() >= WORKING_HOURS_START && meeting.getEndTime().getUTCHours() <= WORKING_HOURS_END
            && moment(meeting.getStartTime().getTime()).diff(moment(meeting.getEndTime().getTime()), 'days') == 0
            && meeting.attendants.length > 0)
            {
                let meetings: Meeting[] = [];
                for(let attendant in meeting.getAttendants()){
                    meetings = await MeetingDB.find(
                    {
                        $and:
                        [
                            {
                                $or: 
                                [
                                    {
                                        startTime:
                                        {
                                            $gte: meeting.getStartTime(),
                                            $lt: meeting.getEndTime()
                                        }
                                    },
                                    {
                                        endTime:
                                        {
                                            $gt: meeting.getStartTime(),
                                            $lte: meeting.getEndTime()
                                        }
                                    }
                                ]
                            },
                            {
                                'attendants._id': meeting.getAttendants()[attendant]._id
                            }
                        ]
                    })
                    .catch(err => {
                        if(err){
                            reject(err);
                        }
                    });
                    if(meetings.length>0) break;
                }
                if(meetings.length == 0){
                    MeetingDB.create(meeting, (err) => {
                        if(err){
                            reject(err);
                        }
                        resolve();
                    });
                } else {
                    reject();
                }

            } else {
                reject();
            }
        })
    }

    public checkAvailableSpots (fromDate: Date, toDate: Date, employees: String[]) {
        return new Promise(async (resolve, reject) =>{
            let employeeList: Employee[] = [];
            for(let employee of employees){
                let meetings: Meeting[] = await MeetingDB.find(
                {
                    $and: 
                    [
                        {startTime:{$gte: fromDate}},
                        {endTime:{$lte: toDate}},
                        {'attendants._id': employee}
                    ]
                })
                .sort({startTime: 1})
                .catch(err => {
                    if(err){
                        reject(err);
                    }
                });

                let employeeModel: Employee; 

                for(let meeting of meetings){
                    for(let attendant of meeting.attendants){
                        if(attendant._id == employee){
                             employeeModel = new Employee(attendant.name, attendant.surname, attendant.role, []);
                        }
                    }
                }

                for(let meeting of meetings)
                {
                    employeeModel.addAvailableSlot(new Availability(meeting.startTime, meeting.endTime, false));
                }

                if(employeeModel.getAvailability()[0].getFrom() > fromDate && employeeModel.getAvailability()[0].getFrom().getUTCHours() > WORKING_HOURS_START)
                employeeModel.addAvailableSlot(new Availability(fromDate, employeeModel.getAvailability()[0].getFrom()));
                
                if(employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo() < toDate && employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo().getUTCHours() < WORKING_HOURS_END && meetings.length > 2)
                {
                    employeeModel.addAvailableSlot(new Availability(employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo(), toDate));
                }else if(employeeModel.getAvailability()[employeeModel.getAvailability().length-1].getTo() < toDate && employeeModel.getAvailability()[employeeModel.getAvailability().length-1].getTo().getUTCHours() < WORKING_HOURS_END && meetings.length == 2)
                {
                    employeeModel.addAvailableSlot(new Availability(employeeModel.getAvailability()[employeeModel.getAvailability().length-1].getTo(), toDate));       
                }

                employeeModel.sortAvailabilityListAsc();

                let finalAvailability: Availability[] = [];
                for(let i = 0; i < employeeModel.getAvailability().length-1; i++){
                    if(employeeModel.getAvailability()[i].getTo() < employeeModel.getAvailability()[i+1].getFrom())
                    {
                        finalAvailability.push((new Availability(employeeModel.getAvailability()[i].getTo(), employeeModel.getAvailability()[i+1].getFrom())));
                    }
                }

                for(let available in finalAvailability){
                    employeeModel.addAvailableSlot(finalAvailability[available]);
                }

                employeeModel.sortAvailabilityListAsc();

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