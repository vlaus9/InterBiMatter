import mongoose, { Schema } from 'mongoose'
import type { Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    email: string,
    password: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    correctPassword(candidatePassword: string): Promise<boolean>
}

const userSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
                type: String,
                reqiured: [true, 'Password is required'],
                minlength: 6
            },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        }
    },
    {
        timestamps: true
    }

)

userSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12)

    next()
})

userSchema.methods.correctPassword = async function(
    candidatePassword: string,
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>('User', userSchema)