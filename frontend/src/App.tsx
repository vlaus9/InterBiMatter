import { useEffect, useState } from 'react'
import { useAppSelector } from './app/hooks.ts'
import SmartButton from './components/SmartButton/SmartButtonComponent.tsx'
import { SmartButtonData } from './components/SmartButton/data/SmartButtonData.ts'
import ModalWindow from './components/ModalWindow/ModalWindow.tsx'
import LoginForm from './components/Auth/LoginForm.tsx'
import Profile from './components/Profile/Profile.tsx'
import RegisterForm from './components/Auth/RegisterForm.tsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, type Variants, type Variant } from 'framer-motion'
import { AnimateVariants } from './components/Auth/animate/animateVariants.ts'


const App = () => {

  const location = useLocation()
  const [ splash, setSplash ] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  

  return (
    <>

    <div className='absolute w-full h-full bg-[black] overflow-hidden'> 

    
      <AnimatePresence mode='wait'>
          { splash ? (
      
            <motion.div
              key='splash'
              initial='initial'
              animate='in'
              exit='out'
              variants={AnimateVariants.startSplashVariants}
              className='fixed inset-0 flex items-center justify-center'
              style={{backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,7)'}}>
              <motion.h1
                  variants={AnimateVariants.startTextVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  className='text-[76px] text-[var(--text-primary)] whitespace-nowrap overflow-hidden'
                  style={{ fontWeight: '700' }}>
                  BiMatter
                </motion.h1>
            </motion.div>
          ) : (
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={
            <motion.div
              initial='initial'
              animate='in'
              exit='out'
              variants={AnimateVariants.PageVariants}
              style={{
                perspective: 1200,
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%'
              }}>
                <LoginForm />
              </motion.div>
              }
              />

          <Route path='/register' element={
            <motion.div
              initial='initial'
              animate='in'
              exit='out'
              variants={AnimateVariants.PageVariants}
              style={{
                perspective: 1200,
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%'
              }}>
                <RegisterForm />
              </motion.div>
              }
          />

        </Routes>
        )}
      </AnimatePresence>
    </div>  
      
    </>
  )
}

export default App

{/* <LoginForm /> */}
    {/* <Profile />
    
      <div className='relative'>
        <div className='absolute flex flex-col w-auto left-[1vw] top-[80px]'>

          <div className='absolute rounded-[20px] top-[0] w-[70px] bg-[var(--button-group-primary-bg)] h-full shadow-[0_0_0_2px_#878585d6]'> 
          </div>

          {SmartButtonData.map((el) => {
            return (
                    <div key={el.id}>
                    <SmartButton config={el}/>
                    </div>
                    )
          })}
          
        </div>

        <ModalWindow />
      </div> */}