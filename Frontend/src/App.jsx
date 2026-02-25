import './App.css'
import { SignInButton } from '@clerk/clerk-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>Welcome to the app</h1>
    <SignInButton />
    </>
  )
}

export default App
