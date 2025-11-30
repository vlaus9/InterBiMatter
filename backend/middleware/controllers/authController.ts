import { Request, Response } from 'express'
import User from '../../models/User'
import type { IUser } from '../../models/User'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

interface IRegisterBody {
    email: string,
    password: string,
    name: string
}

interface ILoginBody {
    email: string,
    password: string
}

interface IAuthResponce {
    success: boolean,
    token: string,
    user: {
        id: string,
        email: string,
        name: string
    }
}


const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '8h'})
}

export const register = async (
    req: Request<{}, {}, IRegisterBody>,
    res: Response<IAuthResponce | { message: string }>
): Promise<void> => {
    try { 
    const { email, password, name } = req.body

    const existingUser: IUser | null = await User.findOne({ email })

    if (existingUser) {
        res.status(400).json({ message: 'User already exists' })
        return
    }

    const user: IUser = await User.create({ email, password, name })
    const token: string = generateToken(user.id)

    res.status(201).json({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    })
    } catch (error) {
        console.error('Login error:' , error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const login = async( 
    req: Request<{}, {}, ILoginBody>,
    res: Response<IAuthResponce | { message: string }>
): Promise<void> => {
    try {
        const { email, password } = req.body
        const user: IUser | null = await User.findOne({ email })

        if (!user || !(await user.correctPassword(password))) {
            res.status(401).json({ message: 'Invalid credentials' })
            return
        }

        const token: string = generateToken(user.id)

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })
    } catch (error) {
        console.error('Login error', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const getMe = async (
    req: Request,
    res: Response<IRegisterBody | { message: string }> //либо any, надо тестировать
): Promise<void> => {
    try {
        const user: IUser | null = await User.findById(req.user?.id).select('-password')
        
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        res.json(user)
    } catch (error) {
        console.error('Get me error ', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const deleteMe = async(
    req: Request<{}, {}, { name: string }> ,
    res: Response<{ message: string } | { success: boolean, message: string}>
): Promise<void> => {
    try {
        const { name } = req.body

        if (!name) {
            res.status(401).json({ message: 'Not autorised' })
        }

        const deletedUser: IUser | null = await User.findOneAndDelete({ name })

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ success: true, message: `Profile ${name} deleted`})

    }
    catch (error) {
        console.error('Delete me error', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const collection = async(
    req:Request<{}, {}, {}>, 
    res: Response<any>
): Promise<void> => {
    try {
        const collection = await mongoose.connection.db?.collection('users').find().toArray()

        res.json(collection)
    
    }
    catch (error) {
        res.status(500).json({ message: `Error ${error}`})
    }

}
