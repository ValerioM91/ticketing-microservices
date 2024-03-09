import supertest from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  return ticket
}

it('cancel an order', async () => {
  const ticket = await buildTicket()

  const user = global.signin()

  const { body: order } = await supertest(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: canceledOrder } = await supertest(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200)

  expect(canceledOrder.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
  const ticket = await buildTicket()

  const user = global.signin()

  const { body: order } = await supertest(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  await supertest(app).patch(`/api/orders/${order.id}`).set('Cookie', user).expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
