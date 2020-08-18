export class Meeting {
    private name: string;
    private startTime: Date;
    private endTime: Date;

    constructor(name: string, startTime: Date, endTime: Date){
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public getName(){
        return this.name;
    }

    public getStartTime(){
        return this.startTime;
    }

    public getEndTime(){
        return this.endTime;
    }

    public setName(name: string)
    {
        this.name = name;
    }

    public setStartTime(startTime: Date)
    {
        this.startTime = startTime;
    }

    public setEndTime(endTime: Date)
    {
        this.endTime = endTime;
    }
}