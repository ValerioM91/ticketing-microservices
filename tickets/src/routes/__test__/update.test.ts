import supertest from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const createTicket = async () => {
  const title = 'title'
  const price = 20

  const res = await supertest(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
  return res.body
}

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await supertest(app)
    .patch(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 123 })
    .expect(404)
})

it('returns a 401 if the user is not signed in ', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await supertest(app).patch(`/api/tickets/${id}`).send({}).expect(401)
})

it('returns NOT a 401 if the user is not the owner of the ticket', async () => {
  const response = await createTicket()
  const id = response.id

  await supertest(app)
    .patch(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 123 })
    .expect(401)
})

it('returns a 400 if an invalid title or price is provided', async () => {
  const cookie = global.signin()

  const {
    body: { id },
  } = await supertest(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 123 })

  await supertest(app)
    .patch(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 123, price: 10 })
    .expect(400)

  await supertest(app)
    .patch(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'test', price: -10 })
    .expect(400)
})

it('updates a ticket with valid inputs', async () => {
  const cookie = global.signin()

  const {
    body: { id },
  } = await supertest(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 123 })

  await supertest(app)
    .patch(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'test-new', price: 10 })
    .expect(200)

  const response = await supertest(app).get(`/api/tickets/${id}`).send()

  expect(response.body.title).toEqual('test-new')
  expect(response.body.price).toEqual(10)
})
