import { Router } from 'express'
import { pick } from 'lodash'
import { success, error } from '../../../core/helpers/response'
import { BAD_REQUEST } from '../../../core/constants/api'
import { PrismaClient } from '@prisma/client'

const api = Router()

api.get('/', async (req, res) => {
  const prisma = new PrismaClient()
  const allUsers = await prisma.user.findMany()
  res.json(success(allUsers))
})

api.get('/:id', async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id, 10) } })

    if (user) {
      res.json(success(user))
    } else {
      res.json(error(BAD_REQUEST, `Oops, user ${req.params.uuid} doesn't exist`))
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message))
  }
})

api.put('/:id', async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id, 10) } })

    if (user) {
      const fields = pick(req.body, ['firstname', 'lastname', 'email'])

      for (const [key, value] of Object.entries(fields)) {
        console.log(key, value)
        user[key] = value
      }

      await user.save()

      res.status(204).end()
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message))
  }
})

export default api
