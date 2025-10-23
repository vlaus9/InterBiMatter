import SmartButton from '../components/SmartButton/SmartButtonComponent'
import { SmartButtonData } from '../components/SmartButton/data/SmartButtonData.ts'
import ModalWindow from '../components/ModalWindow/ModalWindow.tsx' 
import { ModalWindowData } from '../components/ModalWindow/data/ModalWindowData.ts'

const App = () => {

  return (
    <>
      <div className='relative'>
        <div className='absolute flex flex-col border w-auto left-[10px] top-[80px]'>
          <div>
            <SmartButton  config={SmartButtonData[0]}/>
          </div>
        </div>

        <ModalWindow config={ModalWindowData[0]}/>
      </div>
      
    </>
  )
}

export default App
