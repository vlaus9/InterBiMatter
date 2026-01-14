import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from './app/hooks.ts'
import useAutoLogOut from './components/Auth/hooks/useAutoLogOut.ts'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { checkAuth } from './components/Auth/slices/authSlice.ts'
import Splash from './components/Splash/Splash.tsx'
import RouteLoginForm from './components/Routes/RouteLoginForm.tsx'
import RouteRegisterForm from './components/Routes/RouteRegisterForm.tsx'
import RouteProject from './components/Routes/RouteProject.tsx'
import RouteProfile from './components/Routes/RouteProfile.tsx'
import CreateProjectForm from './components/CreateProjectForm/CreateProjectForm.tsx'


const App = () => {

  useAutoLogOut()

  const location = useLocation()
  const dispatch = useAppDispatch()
  const [ splash, setSplash ] = useState(true)
  const { isAuth }  = useAppSelector((state) => state.authSlice)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])
  

  return (
    <>

    <div className='absolute w-full h-full bg-[black] overflow-hidden'> 

    
      <AnimatePresence mode='wait'>
          { splash ? (<Splash />) : (
        <Routes location={location} key={location.pathname}>
          <Route path='/login' element={<RouteLoginForm/>}/>
          <Route path='/' element={<RouteProject />}/>
          <Route path='/register' element={<RouteRegisterForm />}/>
          <Route path='/profile' element={<RouteProfile />}/>
          {/* <Route path='/createProject' element={<CreateProjectForm />}/> */}
        </Routes>
        )
        
        }
      </AnimatePresence>
    </div>  
      
    {/* <CreateProjectForm /> */}

    </>
  )
}

export default App
