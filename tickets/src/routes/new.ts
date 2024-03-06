import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requiredAuth, validateRequest } from '@valeriom91-org/common'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/tickets',
  requiredAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { price, title } = req.body

    const newTicket = Ticket.build({
      price,
      title,
      userId: req.currentUser!.id,
    })

    await newTicket.save()

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: newTicket.id,
      price: newTicket.price,
      title: newTicket.title,
      userId: newTicket.userId,
    })

    res.status(201).send(newTicket)
  }
)

export { router as createTicketRouter }
