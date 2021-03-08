import { Router } from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { isEmpty } from 'lodash'
import { PrismaClient } from '@prisma/client'

import { success, error } from '../../core/helpers/response'
import { BAD_REQUEST } from '../../core/constants/api'
import { hashPassword } from '../../core/libs/password'

const api = Router()

api.post('/signup', async (req, res) => {
  const fields = ['firstname', 'lastname', 'email', 'password', 'passwordConfirmation']

  try {
    const missings = fields.filter(field => req.body[field] === undefined)

    if (!isEmpty(missings)) {
      throw new Error(`Fields [ ${missings.join(', ')} ] are missing`)
    }

    const { firstname, lastname, email, password, passwordConfirmation } = req.body

    if (password !== passwordConfirmation) {
      throw new Error("Password doesn't match")
    }

    const prisma = new PrismaClient()
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashPassword(password),
      },
    })

    const payload = { uuid: user.id, firstname, lastname, email }
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION)

    res.status(201).json(success({ user }, { token }))
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message))
  }
})

api.post('/signin', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err) {
      return res.status(400).json(error(BAD_REQUEST, err))
    }

    const { id, firstname, lastname, email } = user

    delete user.password

    // generate a signed json web token with the contents of user object and
    const token = jwt.sign({ id, firstname, lastname, email }, process.env.JWT_ENCRYPTION)

    return res.json(success({ user }, { token }))
  })(req, res, next)
})

export default api
