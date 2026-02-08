import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'

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

//НАДО ПОДУМАТЬ КАК МОЖНО СОХРАНЯТЬ ВРЕМЕННЫЕ ФАЙЛЫ В ОТДЕЛЬНЫЕ ПАПКИ И КАК БРАТЬ ИХ ИМЯ


// export const convertToGLB = async (files: Express.Multer.File[], projectId: string): Promise<string> => {
//     try {
//        const tempDir = path.join(__dirname, '../../temp')
//        console.log([tempDir, 'писька'])

//     //    if (fs.existsSync(tempDir)) {
//     //     fs.rmSync(tempDir, { recursive: true })
//     //    }

//     //    fs.mkdirSync(tempDir, { recursive: true })

//        for (const file of files) {
//         if (file.path && fs.existsSync(file.path)) {
//             const filePath = path.join(tempDir, file.originalname)
//             fs.writeFileSync(file.path, filePath)
//         }
        
//        }

//        const gltfFile = files.find(f => 
//         f.originalname.toLowerCase().endsWith('.gltf')
//        )

//        if (!gltfFile) {
//         throw new Error("GLTF файл не был найден в загруженных")
//        }

//        const gltfPath = path.join(tempDir, gltfFile.originalname)

//        const io = new NodeIO()
//             .registerExtensions(ALL_EXTENSIONS)
//             .registerDependencies(KHRONOS_EXTENSIONS as unknown as { [key: string]: unknown})

//        const document = await io.read(gltfPath)
    
//        const outputPath = path.join('uploads', projectId, 'model.glb')
//        const outputDir = path.dirname(outputPath)
//        if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true })
//        }

//        await io.write(outputPath, document)

//     //    fs.rmSync(tempDir, { recursive: true })

//        const stats = fs.statSync(outputPath)
//        console.log(`Конвертация успешна на ${(stats.size / 1024).toFixed(1)} KB`)

//        return outputPath

//     } catch (error: any) {
//         console.error(`Ошибка конвертации: ${error}`)
        
//         // const ext = path.extname(gltfPath).toLowerCase()

//         // if (ext === '.glb') {
//         //     try {
//         //         const outputPath = path.join(outputDir, 'model.glb')
//         //         fs.copyFileSync(gltfPath, outputPath)
//         //         console.log('Файл уже в формате GLB, копирнули его')
//         //         return outputPath
//         //     } catch (copyError) { 
//         //         console.error('Ошибка копирования файла GLB:', copyError)
//         //     }
//         // }
//         throw new Error (`Ошибка конвертации GLTF в GLB: ${error.message}`)
//     }
    
// }



// export const convertToGLB = async (gltfPath: string, outputDir: string): Promise<string> => {
//     try {
//         const { exec } = require('child_process')
//         const util = require('util')
//         const execAsync = util.promisify(exec)

//         const outputPath = path.join(outputDir, 'model.glb')

//         await execAsync(`npx gltf-transform optimize "${gltfPath}" "${outputPath}"`)
//         console.log(`Конвертация прошла успешно: ${outputPath}`)
        
//         return outputPath
//     } catch (error) {
//         console.error(`Ошибка конвертации: ${error}`)
//         throw new Error('Произошла ошибка конвертации в GLB')
//     }
// }





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

            if (!mainGltfFile) {
                mainGltfFile = destination
            }
        }
        else if (ext === 'bin') {
            destination = path.join(projectDir, 'original', file.originalname)
            fileType = 'binary'
        }
        else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            destination = path.join(projectDir, 'textures', file.originalname)
            fileType = 'texture'
        }
        else if (ext === '.mtl') {
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

