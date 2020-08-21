import {Request, Response, query} from "express";
import { MeetingController } from "../controllers/MeetingController";
import { Meeting } from "../models/meetingModel";
import * as moment from 'moment';
import CONSTANTS from '../config/constants';

export class Routes {    

    public meetingController: MeetingController = new MeetingController()

    public routes(app): void {   
        
        // server healthcheck route
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                text: 'Server is up.'
            })
        })

        app.route('/getMeetings/:employees?')
        .get((req: Request, res: Response) => {
            let employees: string[] = (req.params.employees) ? req.params.employees.split(',') : [];
            this.meetingController.getMeetings(employees)
            .then(meetings =>{
                res.status(200).send({"meetingList": meetings});
            })
            .catch((err: Error )=>{
                console.log(err);
                res.status(500).send(err);
            })
        })

        app.route('/createMeeting')
        .post((req: Request, res: Response) => {
            let meeting: Meeting = new Meeting(
                req.body.name,
                new Date(req.body.startTime),
                new Date(req.body.endTime),
                req.body.attendants
            );

            if(meeting.getStartTime() < meeting.getEndTime()
            && meeting.getStartTime().getUTCHours() >= CONSTANTS.WORKING_HOURS_START && meeting.getEndTime().getUTCHours() <= CONSTANTS.WORKING_HOURS_END
            && moment(meeting.getStartTime().getTime()).diff(moment(meeting.getEndTime().getTime()), 'days') == 0
            && meeting.attendants.length > 0)
            {
                this.meetingController.createMeeting(meeting)
                .then(result =>{
                    if(result)
                    {
                        res.status(200).send({"text": "The meeting has been created correctly."});
                    } else {
                        res.status(200).send({"text": "One of the employees is not available or the meeting exists."});
                    }
                })
                .catch((err: Error )=>{
                    res.status(500).send({"text": err});
                })
            } else {
                res.status(200).send({"text": "One of the employees is not available or the meeting exists."});
            }
        })

        app.route('/checkAvailableSpots/:employees/:fromDate/:toDate')
        .get((req: Request, res: Response) => {
            let fromDate: Date  = new Date(req.params.fromDate),
                toDate: Date    = new Date(req.params.toDate),
                employees: string[] = req.params.employees.split(",");
            this.meetingController.checkAvailableSpots(fromDate, toDate, employees)
            .then(employees =>{
                res.status(200).send({"employees": employees});
            })
            .catch((err: Error )=>{
                res.status(500).send(err);
            })
        })

    }
}