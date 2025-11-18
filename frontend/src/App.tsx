import SmartButton from './components/SmartButton/SmartButtonComponent.tsx'
import { SmartButtonData } from './components/SmartButton/data/SmartButtonData.ts'
import ModalWindow from './components/ModalWindow/ModalWindow.tsx'
import LoginForm from './components/Auth/LoginForm.tsx'
import Profile from './components/Profile/Profile.tsx'
import { useAppSelector } from './app/hooks.ts'


const App = () => {

  const { user } = useAppSelector((state) => state.authSlice)

  console.log(user)
  return (
    <>

    <div className='absolute w-full h-full bg-[black]'> 

    <LoginForm />
    <Profile />
    
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
      </div>


    </div>  
      
    </>
  )
}

export default App
