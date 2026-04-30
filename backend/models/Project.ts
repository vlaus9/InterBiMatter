import mongoose, { Document, Schema } from "mongoose"
import { v4 as uuidv4 } from "uuid"

interface IFiles {
    name: string
    type: string
    path: string
}

interface IVersions {
    id: string
    name: string
    description?: string
    date: Date | string
    filePath: string
}

export interface IProject extends Document {
    id: string
    name: string
    creationDate: Date 
    autor: string
    modelPath: string
    files: IFiles
    versions: IVersions[]
}

const projectSchema: Schema<IProject> = new Schema(
    {
        id: {
            type: String,
            required: true,
            default: uuidv4
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
        },
        versions: {
            type: [Object],
            required: true
        }

    },
    {
        timestamps: true,
    }
)

export default mongoose.model<IProject>('Project', projectSchema)