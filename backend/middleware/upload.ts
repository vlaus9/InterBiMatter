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

const createProjectStructure = (projectDir: string) => {
    const subDir = ['textures', 'materials', 'original']

    subDir.forEach(subDir => {
        const dirPath = path.join(projectDir, subDir)

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
    })
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

        cb(null, tempDir)
    },

    filename: (req: any, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedExtensions = [
        '.gltf', '.glb', '.bin',
        '.jpg', '.jpeg', '.png',
        '.mlt', '.obj'
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

export const convertToGLB = async (gltfPath: string, outputDir: string): Promise<string> => {
    try {
        const { exec } = require('child_process')
        const util = require('util')
        const execAsync = util.promisify(exec)

        const outputPath = path.join(outputDir, 'model.glb')

        await execAsync(`npx gltf-transform optimize "${gltfPath}" "${outputPath}"`)
        console.log(`Конвертация прошла успешно: ${outputPath}`)
        
        return outputPath
    } catch (error) {
        console.error(`Ошибка конвертации: ${error}`)
        throw new Error('Произошла ошибка конвертации в GLB')
    }
}

export const organizeProjectFiles = async (
    files: Express.Multer.File[],
    projectId: string
) => {
    const projectDir = createProjectDir(projectId)
    createProjectStructure(projectDir)

    let mainGltfFile: string | null = null
    
    const organizedFiles: Array <{
        originalName: string
        path: string
        type: 'model' | 'texture' | 'binary' | 'material' | 'other'
    }> = []

    for (const file of files) {
        const ext = path.extname(file.originalname).toLowerCase()

        let destination = ''
        let fileType: 'model' | 'texture' | 'binary' | 'material' | 'other' = 'other'

        if (ext === '.gltf' || ext === '.glb') {
            destination = path.join(projectDir, 'original', file.originalname)
            fileType = 'model'

            if (ext === '.gltf') mainGltfFile = destination
        }
        else if (ext === 'bin') {
            destination = path.join(projectDir, 'orifinal', file.originalname)
            fileType = 'binary'
        }
        else if (['.jpg', '.jpeg', ',png'].includes(ext)) {
            destination = path.join(projectDir, 'textures', file.originalname)
            fileType = 'texture'
        }
        else if (ext === '.mlt') {
            destination = path.join(projectDir, 'materials', file.originalname)
            fileType = 'material'
        }
        else {
            destination = path.join(projectDir, 'original', file.originalname)
        }

        fs.renameSync(file.path, destination)

        organizedFiles.push({
            originalName: file.originalname,
            path: destination,
            type: fileType
        })
    }

    return{
        projectDir,
        organizedFiles,
        mainGltfFile
    }
}

export default upload


//сделать асинхронным
// const createUploadsDir = () => {
//     const dir = path.join(__dirname, '../../uploads')
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir, { recursive: true })
//     }
//     return dir
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = createUploadsDir()
//         cb(null, uploadDir)
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + '-' + file.originalname
//         cb(null, uniqueName)
//     }
// })

// const fileFilter = (req: any, file: any, cb: any) => {
//     if (file.mimetype === 'model/gltf+json' ||
//         file.mimetype === 'model/gltf-binary' ||
//         file.originalname.endsWith('.gltf') ||
//         file.originalname.endsWith('.glb')) {
//             cb(null, true)
//     } else {
//         cb(new Error('Допускаются только файлы форматов GTLF и GBL!'), false)
//     }
// }

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 50 * 1024 * 1024,
//         files: 1
//     }
// })

// export default upload