import supertest from 'supertest'
import { app } from '../../app'

it('returns with details of the current user', async () => {
  const cookie = await global.signup()

  const response = await supertest(app)
    .get('/api/users/currentUser')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('responds with null if not authenticated', async () => {
  const response = await supertest(app).get('/api/users/currentUser').send().expect(200)

  expect(response.body.currentUser).toEqual(null)
})
