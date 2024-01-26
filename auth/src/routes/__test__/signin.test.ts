import supertest from 'supertest'
import { app } from '../../app'

it('returns a 400 with a non existing email', async () => {
  return supertest(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 with a wrong password', async () => {
  await supertest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  return supertest(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'passwordssssss',
    })
    .expect(400)
})

it('returns a 201 on successful signin', async () => {
  await supertest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const response = await supertest(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})
