import mongoose, { Document, Schema } from "mongoose"

interface IFiles {
    name: string,
    type: string,
    path: string
}

export interface IProject extends Document {
    id: string
    name: string
    creationDate: Date 
    autor: string
    modelPath: string
    files: IFiles
}

const projectSchema: Schema<IProject> = new Schema(
    {
        id: {
            type: String,
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
        },
        files: {
            type: Object,
            required: true
        }

    },
    {
        timestamps: true
    }
)

export default mongoose.model<IProject>('Project', projectSchema)