import { Request, Response } from 'express'
import path from 'path'
import Project from '../../models/Project'
import mongoose from 'mongoose'

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

    const newProject = await Project.create({
        id: new mongoose.Types.ObjectId().toString(),
        name: req.body.name,
        creationDate: Date.now(),
        autor: req.body.autor,
        modelPath: req.file.filename,
    })

    const responseData = {
        id: newProject.id.toString(),
        name: newProject.name,
        creationDate: newProject.creationDate,
        autor: newProject.autor,
        modelPath: newProject.modelPath,
        modelUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    }

    res.status(201).json({
        status: 'success',
        data: { project: responseData }
    })
 } catch (error: any) {
    res.status(400).json({
        status: 'error',
        message: error.message || 'Ошибка при создании проекта'
    })
 }}


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
