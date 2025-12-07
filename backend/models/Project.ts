import mongoose, { Document, Schema } from "mongoose"


export interface IProject extends Document {
    id: number
    name: string
    creationDate: Date 
    autor: string
    modelPath: string
}

const projectSchema: Schema<IProject> = new Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        creationDate: {
            type: Date,
            required: true,
        },
        autor: {
            type: String,
            required: true
        },
        modelPath: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
)

export default mongoose.model<IProject>('Project', projectSchema)