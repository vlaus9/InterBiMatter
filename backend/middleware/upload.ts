import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'


const createProjectDir = (projectId: string) => {
    const dir = path.join(__dirname, '../../uploads', projectId)

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true})
    }

    return dir
}


const createTempDir = () => {
    const tempDir = path.join(__dirname, '../../temp')

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
    }

    return tempDir
}

const storage = multer.diskStorage({
    destination: (req: any, file, cb) => {
        const tempDir = createTempDir()
        if (!req.projectId) {
            req.projectId = uuidv4()
        }
        if (!req.projectDir){
            req.projectDir = createProjectDir(req.projectId)
        }
        
        cb(null, req.projectDir)
    },

    filename: (req: any, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedExtensions = [
        '.gltf', '.glb', '.bin',
        '.jpg', '.jpeg', '.png',
        '.mlt', '.obj', '.ifc'
    ]

    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedExtensions.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error(`Неподдерживаемый формат файла, разрешены: ${allowedExtensions.join(',')}`), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 20
    }
})

export default upload

