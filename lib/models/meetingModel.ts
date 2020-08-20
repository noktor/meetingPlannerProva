export class Meeting {
    public name: string;
    public startTime: Date;
    public endTime: Date;
    public attendants: string[];

    constructor(name: string, startTime: Date, endTime: Date, attendants: string[]){
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.attendants = attendants;
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

    public getAttendants(){
        return this.attendants;
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

    public setAttendants(attendants: string[])
    {
        this.attendants = attendants;
    }
}