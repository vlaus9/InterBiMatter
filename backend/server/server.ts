import express from "express"
import type { Application, Request, Response } from "express"
import mongoose from "mongoose"
import cors from 'cors'
import dotenv from 'dotenv'
import path from "path"
import { MongoMemoryServer } from 'mongodb-memory-server'

dotenv.config()

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

let mongod: MongoMemoryServer

const startServer = async() => {
    try {

        mongod = await MongoMemoryServer.create()
        const MONGODB_URL = mongod.getUri()

        await mongoose.connect(MONGODB_URL)
        console.log('✅ MongoDB Memory Server connected successfully')
        console.log(`📊 Database URL: ${MONGODB_URL}`)

        app.use('/api/auth', require('../middleware/routes/authRouter').default)
        app.use('/api/project', require('../middleware/routes/projectRouter').default)

        app.get('/', (req: Request, res: Response) => {
            res.json({ message: 'Auth API is running'})
        })

        app.use((req: Request, res: Response) => {
            res.status(404).json({ message: 'Route not found' })
        })
      

        const PORT: number = parseInt(process.env.PORT || '80', 10)
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
            console.log(`🗄️  Database: MongoDB in Memory`)
            console.log(`API docsL http://localhost:${PORT}/api/auth`)
        })
    }
    catch (error) {
        console.error('Server startup error:', error)
    }
}

startServer()
