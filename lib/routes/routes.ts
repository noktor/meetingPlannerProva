import {Request, Response} from "express";

export class Routes {    
    
    public routes(app): void {   
        
        // server healthcheck route
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                text: 'Server is up.'
            })
        })

    }
}