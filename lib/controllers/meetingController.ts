import * as mongoose from 'mongoose';
import { MeetingSchema } from '../schemas/meetingSchema';
import { EmployeeSchema } from '../schemas/employeeSchema';
import { Meeting } from '../models/meetingModel';
import { Employee } from '../models/employeeModel';
import { Availability } from '../models/availabilityModel';
import * as moment from 'moment';
import CONSTANTS from '../config/constants';

const MeetingDB = mongoose.model('Meeting', MeetingSchema);
const EmployeeDB = mongoose.model('Employee', MeetingSchema);

export class MeetingController{

    public getMeetings (employees: string[]) {
        return new Promise((resolve, reject) =>{
            let query: object = {};
            if(employees.length > 0){
                let conditions: object[] = [];
                for(let employee of employees)
                {
                    conditions.push({ 'attendants.userName': employee });
                }
                query = { $or: conditions };
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
                            'attendants.userName': meeting.getAttendants()[attendant].userName
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
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        })
    }

    public checkAvailableSpots (fromDate: Date, toDate: Date, employees: string[]) {
        return new Promise(async (resolve, reject) =>{
            let employeeList: Employee[] = [];
            for(let employee of employees){
                let meetings: Meeting[] = await MeetingDB.find(
                {
                    $and: 
                    [
                        {startTime:{$gte: fromDate}},
                        {endTime:{$lte: toDate}},
                        {'attendants.userName': employee}
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
                             employeeModel = new Employee(attendant.userName, attendant.name, attendant.surname, attendant.role, []);
                        }
                    }
                }

                if(!employeeModel){
                    let employeeExists: Employee[] = await EmployeeDB.find({userName: employee})
                    .catch(err => {
                        if(err){
                            reject(err);
                        }
                    });
                    if(employeeExists.length > 0)
                    {
                        employeeModel = new Employee(employee, employeeExists[0].name, employeeExists[0].surname, employeeExists[0].role, []);
                    } else {
                        employeeModel = new Employee(employee, null, null, null, []);
                    }
                }

                for(let meeting of meetings)
                {
                    employeeModel.addAvailableSlot(new Availability(meeting.startTime, meeting.endTime, false));
                }

                if(employeeModel.getAvailability().length > 0){
                    if(employeeModel.getAvailability()[0].getFrom() > fromDate && employeeModel.getAvailability()[0].getFrom().getUTCHours() >= CONSTANTS.WORKING_HOURS_START)
                    employeeModel.addAvailableSlot(new Availability(fromDate, employeeModel.getAvailability()[0].getFrom()));
                    
                    if(employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo() < toDate && employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo().getUTCHours() < CONSTANTS.WORKING_HOURS_END && meetings.length != 2)
                    {
                        employeeModel.addAvailableSlot(new Availability(employeeModel.getAvailability()[employeeModel.getAvailability().length-2].getTo(), toDate));
                    }else if(employeeModel.getAvailability()[employeeModel.getAvailability().length-1].getTo() < toDate && employeeModel.getAvailability()[employeeModel.getAvailability().length-1].getTo().getUTCHours() < CONSTANTS.WORKING_HOURS_END && meetings.length == 2)
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
                }else{
                    employeeModel.addAvailableSlot(new Availability(fromDate, toDate));
                }

                employeeList.push(employeeModel);
            }

            resolve(employeeList);
        })
    }
}