import supertest from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()

  await supertest(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'asdfsdasdasda',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  await supertest(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const { body } = await supertest(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(body.ticket.id).toEqual(ticket.id)
  expect(body.ticket.title).toEqual(ticket.title)
  expect(body.ticket.price).toEqual(ticket.price)
})

it.todo('emits an order created event')
