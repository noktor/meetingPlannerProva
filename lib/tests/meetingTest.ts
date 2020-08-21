import * as chai from 'chai';
import chaiHttp = require('chai-http');
const expect = chai.expect;
import app from '../app';

chai.use(chaiHttp);

describe('Meeting Manager', () => {

    describe('get meetings service', () => {

        describe('get meetings w/o employee filter', () => {
                it('Should return a list of meetings and status 200', async ()  => {
                return chai.request(app)   
                .get('/getMeetings')
                .then(response =>{
                    expect(response.body.meetingList).to.be.an('array');
                });
            });
        });

        describe('get meetings with employee filter', () => {
            it('to return a list of meetings and status 200', async ()  => {
                return chai.request(app)
                .get('/getMeetings/veronica.schulz,vicenç.coll')
                .then(response =>{
                    expect(response.body.meetingList).to.be.an('array');
                });
            });
        });

    });

    describe('create meeting service', () => {

        describe('create meeting with availability', () => {
            //creates a non existing meeting (can only be used once, then we have to change the meeting data or delete the meeting)
            it('Should return a list of meetings and status 200', async ()  => {
                let requestData = {
                    "name": "Meeting 12",
                    "startTime": "2020-08-20T13:00:00.000Z",
                    "endTime": "2020-08-20T13:30:00.000Z",
                    "attendants":
                    [
                        {   
                            "_id": "5f3ce5f847c773428c6d6542",
                            "userName": "vicenç.coll",
                            "name": "Vicenç ",
                            "surname": "Coll",
                            "role": "EMPLOYEE"
                        }
                    ]
                };

                return chai.request(app)
                .post('/createMeeting')
                .set('Content-Type', 'application/json')
                .send(requestData)
                .then(response =>{
                    expect(response.body.text).to.be.a('string', 'The meeting has been created correctly.');
                });
            });
        });

        describe('get meeting w/o availability', () => {
            it('Should return a list of meetings and status 200', async ()  => {
                let requestData = {
                    "name": "Meeting 14",
                    "startTime": "2022-08-20T17:00:00.000Z",
                    "endTime": "2022-08-20T18:00:00.000Z",
                    "attendants":
                    [
                        {   
                            "_id": "5f3ce5f847c773428c6d6542",
                            "userName": "marta.giralta",
                            "name": "Marta ",
                            "surname": "Giralta",
                            "role": "EMPLOYEE"
                        }
                    ]
                };
                return chai.request(app)
                .post('/createMeeting')
                .set('Content-Type', 'application/json')
                .send(requestData)
                .then(response =>{
                    expect(response.body.text).to.be.a('string', 'One of the employees is not available or the meeting exists.');
                });
            });
        });
    });

});