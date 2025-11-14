import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController'
import { auth } from '../auth'

const authRouter: Router = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/me', auth, getMe)

export default authRouter