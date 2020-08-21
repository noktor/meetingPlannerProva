import { Employee } from './employeeModel'

export class Meeting {
    public name: string;
    public startTime: Date;
    public endTime: Date;
    public attendants: Employee[];

    constructor(name: string, startTime: Date, endTime: Date, attendants: Employee[]){
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

    public setAttendants(attendants: Employee[])
    {
        this.attendants = attendants;
    }
}