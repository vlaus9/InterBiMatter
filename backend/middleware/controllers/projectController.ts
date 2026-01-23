import { Request, Response } from 'express'
import { organizeProjectFiles, convertToGLB } from '../upload'
import path from 'path'
import Project from '../../models/Project'

declare global {
    namespace Express {
        interface Request {
            projectId?: string
        }
    }
}

export const getProjectAll = async (req: Request, res: Response) => {
    try {
        
        const { user } = req.query

        const projects = await Project.find({ autor: user }).sort({ createdAt: -1 })

        const projectsWithUrls = projects.map(project => ({
            ...project.toObject(),
            modelUrl: `${req.protocol}://${req.get('host')}/uploads/${path.basename(project.modelPath)}`
        }))

        res.status(200).json({
            status: 'success',
            result: projects.length,
            data: { projects }
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: "Ошибка при получении проектов"
        })
    }
}

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id)

        if (!project) {
            return res.status(404).json({
                status: 'fail',
                message: 'Проекты не найдены'
            })
        }

        const projectWithUrl = {
            ...project.toObject(),
            modelUrl: `${req.protocol}://${req.get('host')}/uploads/${path.basename(project.modelPath)}`
        }

        return res.status(200).json({
            status: 'success',
            data: { project: projectWithUrl }
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Ошибка при получении проекта'
        })
    }
}

export const createProject = async (req: Request, res: Response) => {
 try {
    if (!req.file) {
        return res.status(400).json({
            status: 'fail',
            message: 'Файл модели обязателен'
        })
    }

    const files = req.files as Express.Multer.File[]

    const projectId = req.projectId || `project_${Date.now()}`

    const { projectDir, organizedFiles, mainGltfFile} = await organizeProjectFiles(files, projectId)

    let glbPath: string | null = null
     
    if (mainGltfFile) {
        try {
            glbPath = await convertToGLB(mainGltfFile, projectDir)
        } catch (conversionError) {
            console.warn('Конвертация не удалась, используем оригинал:', conversionError)
        }
    }

    let modelUrl = ''

    if (glbPath) {
        modelUrl = `/uploads/${projectId}/model.glb`
    } else if (mainGltfFile) {
        modelUrl = `/uploads/${projectId}/original/${path.basename(mainGltfFile)}`
    } else {
        const modelFile = organizedFiles.find(f => f.type === 'model')
        if (modelFile) {
            modelUrl = `/uploads/${projectId}/original/${modelFile.originalName}`
        }
    }

    const newProject = await Project.create({
        id: projectId,
        name: req.body.name,
        creationDate: Date.now(),
        autor: req.body.autor,
        modelPath: modelUrl,
        files: organizedFiles.map(f => ({
            name: f.originalName,
            type: f.type,
            path: f.path.replace(/^.*uploads[\\/]/, '')
        }))
    })

    const responseData = {
        id: newProject.id.toString(),
        name: newProject.name,
        creationDate: newProject.creationDate,
        autor: newProject.autor,
        modelPath: newProject.modelPath,
        files: newProject.files
    }

    res.status(201).json({
        status: 'success',
        data: { project: responseData }
    })
    }
    catch (error: any) {
        console.error('Ошибка создания проекта:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Ошибка при создании проекта'
        })
    }
}

 export const deleteProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id)

        if (!project) {
            res.status(404).json({
                status: 'fail',
                message: 'Проект не найден'
            })
        } 

        const fs = require('fs').promises
        const path = require('path')
        const filePath = path.join(__dirname, '../../uploads', project?.modelPath)

        try {
            await fs.unlink(filePath)
        } catch (error) {
            console.log('Файл уже удален или его не существует')
        }

        await Project.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Ошибка при удалении проекта'
        })
    }
 }
