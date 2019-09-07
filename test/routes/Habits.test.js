require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Habit = require('../../lib/model/Habit');

jest.mock('../../lib/middleware/ensure-auth.js');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a habit', () => {
    return request(app)
      .post('/api/v1/habits')
      .send({
        habit: 'coding',
        description: 'code every day'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          habit: 'coding',
          description: 'code every day',
          user: expect.any(String),
          __v: 0
        });
      });
  });

  it('can get all habits', async() => {
    const habits = await Habit.create([
      {
        habit: 'coding',
        description: 'code every day',
        user: '1234'
      },
      {
        habit: 'sleeping',
        description: 'every day',
        user: '1234'
      },
      {
        habit: 'eating',
        description: 'day',
        user: '1234'
      }
    ]);

    const habitsJSON = JSON.parse(JSON.stringify(habits));

    return request(app)
      .get('/api/v1/habits')
      .then(res => {
        expect(res.body).toHaveLength(3);
        habitsJSON.map(habit => {
          expect(res.body).toContainEqual(habit);
        });
      });
  });

  it('can get a habit by id', async() => {
    const habits = await Habit.create([
      {
        habit: 'coding',
        description: 'code every day',
        user: 'tony1993'
      },
      {
        habit: 'sleeping',
        description: 'every day',
        user: '1234'
      },
      {
        habit: 'eating',
        description: 'day',
        user: '567'
      }
    ]);

    const habitsJSON = JSON.parse(JSON.stringify(habits));
    const habit = habitsJSON[0];

    return request(app)
      .get(`/api/v1/habits/${habit._id}`)
      .then(res => {
        expect(res.body).toEqual(habit);
      });
  });

  it('can update a habit by id', async() => {
    const habits = await Habit.create([
      {
        habit: 'coding',
        description: 'code every day',
        user: 'tony1993'
      },
      {
        habit: 'sleeping',
        description: 'every day',
        user: '1234'
      },
      {
        habit: 'eating',
        description: 'day',
        user: '567'
      }
    ]);

    const habitsJSON = JSON.parse(JSON.stringify(habits));
    const habit = habitsJSON[0];

    return request(app)
      .patch(`/api/v1/habits/${habit._id}`)
      .send({ description: 'a new description' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          habit: 'coding',
          description: 'a new description',
          user: 'tony1993',
          __v: 0
        });
      });
  });

  it('can delete a habit by id', async() => {
    const habits = await Habit.create([
      {
        habit: 'coding',
        description: 'code every day',
        user: 'tony1993'
      },
      {
        habit: 'sleeping',
        description: 'every day',
        user: '1234'
      },
      {
        habit: 'eating',
        description: 'day',
        user: '567'
      }
    ]);

    const habitsJSON = JSON.parse(JSON.stringify(habits));
    const habit = habitsJSON[0];

    return request(app)
      .delete(`/api/v1/habits/${habit._id}`)
      .then(res => {
        expect(res.body).toEqual(habit)
      });
  });
});
