export class Availability {
    public from: Date;
    public to: Date;
    public available: Boolean;

    constructor(from: Date, to: Date, available: Boolean = true){
        this.from = from;
        this.to = to;
        this.available = available;
    }

    public getFrom(){
        return this.from;
    }

    public getTo(){
        return this.to;
    }

    public getAvailable(){
        return this.available;
    }

    public setFrom(from: Date)
    {
        this.from = from;
    }

    public setTo(to: Date)
    {
        this.to = to;
    }

    public setAvailable(available: Boolean)
    {
        this.available = available;
    }
}