import { Availability } from './availabilityModel';

export class Employee {
    public _id?: string;
    public userName: string
    public name: string;
    public surname: string;
    public role: string;
    public availability: Availability[];

    constructor(userName: string, name: string, surname: string, role: string, availability: Availability[], _id?: string){
        this._id = _id;
        this.userName = userName;
        this.name = name;
        this.surname = surname;
        this.role = role;
        this.availability = availability;
    }


    public getUserName(){
        return this.userName;
    }

    public getName(){
        return this.name;
    }

    public getSurname(){
        return this.surname;
    }

    public getRole(){
        return this.role;
    }

    public getAvailability(){
        return this.availability;
    }

    public getId(){
        return this._id;
    }

    public setUserName(userName: string)
    {
        this.userName = userName;
    }

    public setName(name: string)
    {
        this.name = name;
    }

    public setSurname(surname: string)
    {
        this.surname = surname;
    }

    public setRole(role: string)
    {
        this.role = role;
    }

    public setAvailability(availability: Availability[])
    {
        this.availability = availability;
    }

    public setId(_id: string)
    {
        this._id = _id;
    }

    //METHODS:
    public addAvailableSlot(availableSlot: Availability)
    {
        this.availability.push(availableSlot);
    }

    public sortAvailabilityListAsc(): void{
        this.availability.sort((a: Availability,b: Availability)=>{
            if (b.to > a.from)    return -1;
            else if(b.to < a.from) return  1;
            else return 0;
        })
    }
}