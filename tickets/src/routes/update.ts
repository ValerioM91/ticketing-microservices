import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requiredAuth,
  validateRequest,
} from '@valeriom91-org/common'
import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.patch(
  '/api/tickets/:id',
  requiredAuth,
  [
    body('title').isString().optional().withMessage('Title must be a string'),
    body('price').isFloat({ gt: 0 }).optional().withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    const { title, price } = req.body

    if (title) {
      ticket.set({
        title: req.body.title,
      })
    }

    if (price) {
      ticket.set({
        price: req.body.price,
      })
    }

    await ticket.save()

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    })

    res.status(200).send(ticket)
  }
)

export { router as updateTicketRouter }
