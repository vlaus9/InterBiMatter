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
    
    return nextVersionDir
}

const storage = multer.diskStorage({
    destination: (req: any, file, cb) => {
        req.projectDir = createVersionDir(req.projectId)
        
        cb(null, req.projectDir)
    }
})

const add = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 *1024
  }  
})

export default add