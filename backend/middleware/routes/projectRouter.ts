import { Router } from "express"
import { createProject, getProjectById, getProjectAll, deleteProject, addFileToProject } from "../controllers/projectController"
import upload from "../upload"
import add from "../add"

const projectRouter: Router = Router()

projectRouter.post('/createProject', upload.array('files', 20), createProject)
projectRouter.post('/addFileToProject/:projectId', add.single('file'), addFileToProject)
projectRouter.get('/getProject/:id', getProjectById)
projectRouter.get('/getProjectsAll', getProjectAll)
projectRouter.delete('/delProject/:id', deleteProject)

export default projectRouter