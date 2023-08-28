import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../src/auth/types';
import { DatabaseService } from '../src/databaseFactory/dbPool';
import { PlanDto } from '../src/subscription/types';
import { BrokerService } from '../src/message-broker/message.service';

describe('TestController (e2e)', () => {
  let app;
  let pool: DatabaseService;
  let userToken: string;
  let userId: string;
  let availablePlans: [PlanDto];
  let chosenPlan: string;
  const createUserDto: CreateUserDto = {
    name: 'Test User',
    email: 'test@example.com' + Math.random(),
    password: 'testpassword',
  };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // override the broker service
      .overrideProvider(BrokerService)
      .useValue({
        processBilling: jest.fn((data) => {
          return { data };
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    pool = app.get(DatabaseService);
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data.name).toBe(createUserDto.name);
      expect(response.body.data.email).toBe(createUserDto.email);
    });
    it('Should fail to create a new user if the email is already present in the database.', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe(
        'A user with this email already exists',
      );
    });
  });

  describe('/auth/login (POST)', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(createUserDto)
        .expect(HttpStatus.OK);

      expect(response.body.message).toBe('User login successful');
      userToken = response.body.data.token;
      userId = response.body.data.user.id;
      expect(response.body.data.user.name).toBe(createUserDto.name);
      expect(response.body.data.user.email).toBe(createUserDto.email);
    });
    it('should not create a new user with a wrong credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...createUserDto, password: 'wrongPass' })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('/plans/ (Get)', () => {
    it('should get all available plan to purchase', async () => {
      const response = await request(app.getHttpServer())
        .get('/plans')
        .expect(HttpStatus.OK);
      expect(response.body.message).toBe('Plans retrieved successfully');
      availablePlans = response.body.data;
      expect(response.body.data.length).toBe(3);
    });
  });
  describe('/plans/ (Post)', () => {
    it('should select a plan for a non authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .post('/plans/')
        .set('Authorization', `Bearer wrongtoken}`) // Set the Authorization header with the bearer token
        .send({ planId: availablePlans[0].id })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe('Unauthorized');
    });
    it('should select a plan for logged in user', async () => {
      const response = await request(app.getHttpServer())
        .post('/plans/')
        .set('Authorization', `Bearer ${userToken}`) // Set the Authorization header with the bearer token
        .send({ planId: availablePlans[0].id })
        .expect(HttpStatus.CREATED);
      chosenPlan = response.body.data.id;
      expect(response.body.message).toBe('Plan created successfully');
      expect(response.body.data.name).toBe(availablePlans[0].name);
    });
    it('should not select a plan for logged in user when the user has added the plan earlier', async () => {
      const response = await request(app.getHttpServer())
        .post('/plans/')
        .set('Authorization', `Bearer ${userToken}`) // Set the Authorization header with the bearer token
        .send({ planId: availablePlans[0].id })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe('You already have an existing');
    });
  });
  describe('/plans/bill/ (Post)', () => {
    it('should get the bill of a user ', async () => {
      const response = await request(app.getHttpServer())
        .post('/plans/bill')
        .set('Authorization', `Bearer ${userToken}`) // Set the Authorization header with the bearer token
        .send({ userId })
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toBe('User billed successfully');
    });
  });

  afterAll(async () => {
    // console.log(pool);
    await pool.closePool();
    await app.close();
  });
});
