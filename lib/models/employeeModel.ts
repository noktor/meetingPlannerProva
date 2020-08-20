import { Availability } from './availabilityModel';

export class Employee {
    private name: string;
    private surname: string;
    private role: string;
    public availability: Availability[];

    constructor(name: string, surname: string, role: string, availability: Availability[]){
        this.name = name;
        this.surname = surname;
        this.role = role;
        this.availability = availability;
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

    public addAvailableSlot(availableSlot: Availability)
    {
        this.availability.push(availableSlot);
    }
}