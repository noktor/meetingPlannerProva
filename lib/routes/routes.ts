import {Request, Response, query} from "express";
import { MeetingController } from "../controllers/MeetingController";
import { Meeting } from "../models/meetingModel";

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

        app.route('/getMeetings')
        .get((req: Request, res: Response) => {
            this.meetingController.getMeetings()
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
                new Date(req.body.endTime)
            );
            this.meetingController.createMeeting(meeting)
            .then(result =>{
                res.status(200).send({"text": "The meeting has been created correctly."});
            })
            .catch((err: Error )=>{
                res.status(500).send(err);
            })
        })

    }
}