import { Router } from 'express'

import users from './users'

const api = Router({ mergeParams: true })

// a\ users
api.use('/users', users)

export default api
