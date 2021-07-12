const request = require('supertest');

const app = require('../../app');
const { 
    mongoConnect,
    mongoDisconnect
 } = require('../../services/mongo');

 const {
    loadPlanetsData
 } = require('../../models/planets.models')

describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /Launches', () => {
        test('It should return with 200 success', async () => {
           await request(app)
           .get('/v1/launches')
           .expect("Content-Type", /json/)
           .expect(200);
        });
    });
    
    describe('Test POST /Launches', () => {
    
        const completeLaunchData = {
            mission: 'Nefro Exploration 9',
            rocket: 'Nitinghale LFS2 Cruiser',
            launchDate: 'February 10, 2033',
            target: 'Kepler-62 f'
        };
    
        const launchDataWithoutDate = {
            mission: 'Nefro Exploration 9',
            rocket: 'Nitinghale LFS2 Cruiser',
            target: 'Kepler-62 f'
        };
    
        const launchDataWIthInvalidDate = {
            mission: 'Nefro Exploration 9',
            rocket: 'Nitinghale LFS2 Cruiser',
            launchDate: 'Hello',
            target: 'Kepler-62 f'
        };
    
        test('It should return with 201 created', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.lauchDate).valueOf();
            const responseDate = new Date(response.lauchDate).valueOf();
    
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('It should catch missing parameters', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch parameters'
            })
        });
        test('It should catch Invalid dates', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWIthInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid Launch Date'
            })
        });
    });
});