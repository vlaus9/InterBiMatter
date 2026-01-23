import { Router } from "express"
import { createProject, getProjectById, getProjectAll, deleteProject } from "../controllers/projectController"
import upload from "../upload"

const projectRouter: Router = Router()

projectRouter.post('/createProject', upload.array('files', 20), createProject)
projectRouter.get('/getProject/:id', getProjectById)
projectRouter.get('/getProjectsAll', getProjectAll)
projectRouter.delete('/delProject/:id', deleteProject)

export default projectRouter