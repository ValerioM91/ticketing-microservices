import supertest from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const createTicket = async () => {
  const title = 'title'
  const price = 20

  await supertest(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price })
}

it('returns a list of tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const response = await supertest(app).get('/api/tickets').expect(200)

  expect(response.body).toHaveLength(3)
})
