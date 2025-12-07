import { Request, Response } from 'express'
import Project, { IProject } from '../../models/Project'
import upload from '../upload'
import mongoose from 'mongoose'

export const getProjectAll = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 })
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
                status: 'sail',
                message: 'Проекты не найдены'
            })
        }

        return res.status(200).json({
            status: 'success',
            data: { project }
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
        id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        creationDate: Date.now(),
        //НАДО ПРОПИСАТЬ АВТОРА ЧТОБЫ ШЕЛ ИЗ ПОЛЬЗОВАТЕЛЯ
    })
 }
}