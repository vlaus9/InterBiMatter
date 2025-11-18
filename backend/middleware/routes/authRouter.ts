import { Router } from 'express'
import { register, login, getMe, deleteMe, collection } from '../controllers/authController'
import { auth } from '../auth'

const authRouter: Router = Router() 

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/me', auth, getMe)
authRouter.delete('/del-me', deleteMe)
authRouter.get('/collection', collection)

export default authRouter