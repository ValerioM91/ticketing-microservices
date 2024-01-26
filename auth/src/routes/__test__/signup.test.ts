import supertest from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', async () => {
  return supertest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
})

it('returns a 400 with an invalid email', async () => {
  return supertest(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 with an invalid password', async () => {
  return supertest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400)
})

it('returns a 400 with missing email and password', async () => {
  await supertest(app).post('/api/users/signup').send({}).expect(400)
})

it('disallows duplicate emails', async () => {
  await supertest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await supertest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})

it('sets a cookie after successful signup', async () => {
  const response = await supertest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})
