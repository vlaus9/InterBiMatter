import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'

const getNextNameFolder = async (dirPath: string) => {
    const items = await fs.readdir(dirPath, { withFileTypes: true})
    const folders = items.filter(item => item.isDirectory()).map(item => item.name)
    let nextNumber: number[] = [1]
    for (const strEl of folders) {
        const numbEl = Number(strEl)
        if (numbEl > nextNumber[0]) {
            nextNumber.push(numbEl)
            nextNumber.shift()
        }
    }
    
    return String(nextNumber[0] + 1)
}

const createVersionDir =  async (projectId: string) => {
    const dir = path.join(__dirname, '../../uploads', projectId)
    const nextVersionDir = path.join(dir, await getNextNameFolder(dir))
    
    await fs.mkdir(nextVersionDir, { recursive: true })
    return nextVersionDir
}

const storage = multer.diskStorage({
    destination: async (req: any, file, cb) => {
        const projectId = req.params.projectId
        if (!projectId) {
            console.log('В запросе отсутствует projectId')
        }

        req.projectDir = await createVersionDir(projectId)
        
        cb(null, req.projectDir)
    }, 
    filename: (req: any, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

const add = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 *1024
  }  
})

export default add