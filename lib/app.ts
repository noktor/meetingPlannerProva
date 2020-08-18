import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/routes";

class App {

    public app: express.Application = express();
    public router: Routes = new Routes();

    constructor() {
        this.config();
        this.router.routes(this.app);     
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files 
        this.app.use(express.static('public'));
    }

}

export default new App().app;