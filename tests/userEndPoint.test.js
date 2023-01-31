const request = require('supertest');
const app = require('../app');
const bcrypt = require("bcryptjs");
var { faker } = require('@faker-js/faker');
// The describe function is used for grouping together related tests
// The it is an alias of test function which runs the actual test.
// The expect function tests a value using a set of matcher functions.

//Initialization
beforeAll(() => {
  
});

//
afterAll(() => {
  
});


//Test - New Staff module
describe('User Endpoints', () => {
    let firstName = faker.name.firstName();
    let lastName = faker.name.middleName();
    let middleName = faker.name.middleName();
    let email = faker.internet.email(firstName).toLowerCase();
    let gender = faker.name.sexType();
    let phone = faker.phone.number('+123 80 ### ### ##');
    let hashPassword = bcrypt.hashSync(process.env.STAFF_DEFAULT_PASSWORD, bcrypt.genSaltSync(10), null);

    it('This will create a new staff', async () => {
      const res = await request(app)
        .post('/api/v1.0/user/create')
        .send({
          email: email,
          password: hashPassword,
          role_id: 1,
          fullname: firstName + ' '+ lastName + ' '+ middleName,
          status: 1,
          user_id: 1,
          first_name: firstName,
          last_name: lastName,
          other_name: middleName,
          gender: gender,
          phone: phone,
        });
      expect(res.statusCode).toEqual(201);
    });
  

    //Test - Get all staff
    it('This will fetch all staff', async () => {
      const postId = 1;
      const res = await request(app).get('/api/v1.0/user/list');
      expect(res.statusCode).toEqual(200);
    });

    //Test - Get single staff
    it('This will fetch a single staff', async () => {
      const postId = 1;
      const res = await request(app).get('/api/v1.0/user/show/${postId}');
      expect(res.statusCode).toEqual(200);
    });

    //Test - Get all staff details 
    it('This will fetch all staff details', async () => {
      const postId = 1;
      const res = await request(app).get('/api/v1.0/user/information/all/show/${postId}');
      expect(res.statusCode).toEqual(200);
    });

     //Test - Get Staff New FIle Number
     it('This generate new staff File No', async () => {
      const res = await request(app).get('/api/v1.0/user/new/fileno');
      expect(res.statusCode).toEqual(200);
    });


  });