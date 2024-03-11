import supertest from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@valeriom91-org/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payments'

// jest.mock('../../stripe')

it('returns a 404 when an order does not exist', async () => {
  await supertest(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: 'asldkfj',
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })

  await order.save()

  await supertest(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      orderId: order.id,
      token: 'asldkfj',
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  })

  await order.save()

  await supertest(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'asldkfj',
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 100000)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  })

  await order.save()

  await supertest(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(201)

  // * Testing with Real Stripe using a test key in .env
  const chargeList = await stripe.charges.list()

  const charge = chargeList.data.find((charge) => charge.amount === price * 100)

  expect(charge).toBeDefined()
  expect(charge!.currency).toEqual('usd')

  const payment = await Payment.findOne({
    stripeId: charge!.id,
    orderId: order.id,
  })

  expect(payment).not.toBeNull()

  // * Testing with Mock
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  // expect(stripe.charges.create).toHaveBeenCalled()
  // expect(chargeOptions.amount).toEqual(order.price * 100)
  // expect(chargeOptions.source).toEqual('tok_visa')
  // expect(chargeOptions.currency).toEqual('usd')
})
