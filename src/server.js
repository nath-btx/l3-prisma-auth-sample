import { prelude, argv, mlog } from './core/libs/utils'
import { PrismaClient } from '@prisma/client'
import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'

import './core/middleware/passport'

import api from './routes/api'

// Every story has a begining...
prelude()

// Instantiate express application
const app = express()

// Setting the application port depending to environment
const port = parseInt(argv[0], 10) || process.env.PORT

app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Entry point function
const start = async () => {
  try {
    // database synchronization ...
    const prisma = new PrismaClient()
    await prisma.$connect()
    mlog(`Database is running !`)

    // About routes root
    app.get('/', (_req, res) => {
      res.send('Please use our api')
    })

    app.use(async (req, _res, next) => {
      req.prisma = prisma
      next()
    })

    // About routes definition
    app.use('/api', api)

    app.use(async (req, res, next) => {
      await req.prisma.$disconnect()
      next()
    })

    // ... and finally server listening
    app.listen(port, () => {
      mlog(`Server is running on port ${port}`)
    })
  } catch (err) {
    mlog(err, 'error')
    process.exit(42)
  }
}

// Let's Rock!
start()
