import { Router } from "express"
import { createProject, getProjectById, getProjectAll, deleteProject, addFiles } from "../controllers/projectController"
import upload from "../upload"

const projectRouter: Router = Router()

projectRouter.post('/createProject', upload.array('files', 20), createProject)
projectRouter.post('/addFiles/:id', upload.array('files', 20), addFiles)
projectRouter.get('/getProject/:id', getProjectById)
projectRouter.get('/getProjectsAll', getProjectAll)
projectRouter.delete('/delProject/:id', deleteProject)

export default projectRouter