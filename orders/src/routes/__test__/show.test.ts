import supertest from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  return ticket
}

it('fetch the order of a user', async () => {
  const ticket = await buildTicket()

  const user = global.signin()

  const { body: order } = await supertest(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: fetchedOrder } = await supertest(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
  expect(fetchedOrder.ticket.id).toEqual(ticket.id)
})

it('returns an error if a user tries to fetch another user order', async () => {
  const ticket = await buildTicket()

  const user1 = global.signin()
  const user2 = global.signin()

  const { body: order } = await supertest(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201)

  await supertest(app).get(`/api/orders/${order.id}`).set('Cookie', user2).expect(401)
})
