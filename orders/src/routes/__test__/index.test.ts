import supertest from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  return ticket
}

it('gets orders of a user', async () => {
  // Create three tickets
  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()

  // Create three orders, 1 for User #1 and 2 for User #2
  const user1 = global.signin()
  const user2 = global.signin()

  await supertest(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201)

  const { body: order2 } = await supertest(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201)

  const { body: order3 } = await supertest(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201)

  // Make sure we get only tickets for User #2

  const response = await supertest(app).get('/api/orders').set('Cookie', user2).expect(200)

  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(order2.id)
  expect(response.body[1].id).toEqual(order3.id)
  expect(response.body[0].ticket.id).toEqual(ticket2.id)
  expect(response.body[1].ticket.id).toEqual(ticket3.id)
})
