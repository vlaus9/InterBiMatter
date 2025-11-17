import express from "express"
import type { Application, Request, Response } from "express"
import mongoose from "mongoose"
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'

dotenv.config()

const app: Application = express()

app.use(cors())
app.use(express.json())


// const MONGODB_URL: string = process.env.MONGODB_URL || 'mongodb://localhost:27017/InterBiMatterDB'

// mongoose.connect(MONGODB_URL)
//     .then(() => console.log('MongoDB connectes successfully'))
//     .catch((error: Error) => {
//         console.error('MongoDB connected error:', error)
//         // process.exit(1)
// })


let mongod: MongoMemoryServer

const startServer = async() => {
    try {

        mongod = await MongoMemoryServer.create()
        const MONGODB_URL = mongod.getUri()

        await mongoose.connect(MONGODB_URL)
        console.log('✅ MongoDB Memory Server connected successfully')
        console.log(`📊 Database URL: ${MONGODB_URL}`)

        const PORT: number = parseInt(process.env.PORT || '5000', 10)
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
            console.log(`🗄️  Database: MongoDB in Memory`)
        })
    }
    catch (error) {
        console.error('Server startup error:', error)
    }
}

startServer()

app.use('/api/auth', require('../middleware/routes/authRouter').default)

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Auth API is running'})
})

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' })
})

const PORT: number = parseInt(process.env.PORT || '5000', 10)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`API docsL http://localhost:${PORT}/api/auth`)
})
