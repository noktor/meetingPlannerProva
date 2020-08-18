import {Request, Response, query} from "express";
import { MeetingController } from "../controllers/MeetingController";

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
                console.log(meetings);
                res.status(200).send({"meetingList": meetings});
            })
            .catch((err: Error )=>{
                console.log(err);
                res.status(200).send(err);
            })
        })

    }
}