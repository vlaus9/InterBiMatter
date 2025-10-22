import SmartButton from '../components/SmartButton/SmartButtonComponent'
import { SmartButtonData } from '../components/SmartButton/data/SmartButtonData'

const App = () => {
  return (
    <>
      <body className='relative'>
          <SmartButton  config={SmartButtonData[0]}/>
      </body>
      
    </>
  )
}

export default App
