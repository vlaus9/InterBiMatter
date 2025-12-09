// import { createSlice } from "@reduxjs/toolkit";

// interface IProjectList {
//     id: number | null
//     name: string
//     creationDate: Date | null
//     autor: string
//     modelPath: string
// }

// const initialState: IProjectList = {
//     id: null,
//     name: '',
//     creationDate: null,
//     autor: '',
//     modelPath: ''
// }

// const projectList = createSlice({ 
//     name: 'projectList',
//     initialState,
//     reducers: {
//         createProject: ((state, action) => {
//             state.id = action.payload.id
//             state.name = action.payload.name,
//             state.creationDate = action.payload.createDate,
//             state.autor = action.payload.autor
//         })
//     }
// })

// export const { createProject } = projectList.actions
// export default projectList.reducer