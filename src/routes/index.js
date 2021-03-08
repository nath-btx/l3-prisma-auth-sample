import { Router } from 'express'

const api = Router()

api.get('/', (_, res) => {
  res.send('Please check our /api route ^^')
})

export default api
