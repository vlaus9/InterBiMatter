import { useAppSelector } from './app/hooks.ts'
import SmartButton from './components/SmartButton/SmartButtonComponent.tsx'
import { SmartButtonData } from './components/SmartButton/data/SmartButtonData.ts'
import ModalWindow from './components/ModalWindow/ModalWindow.tsx'
import LoginForm from './components/Auth/LoginForm.tsx'
import Profile from './components/Profile/Profile.tsx'
import RegisterForm from './components/Auth/RegisterForm.tsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'



const App = () => {

  const location = useLocation()

  const pageVariants: Variants = {
    initial: {
      x: '100vw',
      scale: 0.8,
      rotateY: 90,
      opacity: 0
    },
    in: {
      x: 0,
      scale: 1,
      rotateY: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        mass: 1.2,
        restDelta: 0.001
      }
    },
    out: {
      x: '-100vw',
    scale: 0.8,
    rotateY: -90,
    opacity: 0,
    transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20,
        mass: 1.2,
        restDelta: 0.001
      }
    }
  }

  return (
    <>

    <div className='absolute w-full h-full bg-[black] overflow-hidden'> 


      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={
            <motion.div
              initial='initial'
              animate='in'
              exit='out'
              variants={pageVariants}
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
              variants={pageVariants}
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