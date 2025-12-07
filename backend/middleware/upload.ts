import multer from 'multer'
import path from 'path'
import fs from 'fs'

//сделать асинхронным
const createUploadsDir = () => {
    const dir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    return dir
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = createUploadsDir()
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    }
})

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'model/gltf+json' ||
        file.mimetype === 'model/gltf-binary' ||
        file.originalname.endsWith('.gtlf') ||
        file.originalname.endsWith('.gbl')) {
            cb(null, true)
    } else {
        cb(new Error('Допускаются только файлы форматов GTLF и GBL!'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,
        files: 1
    }
})

export default upload