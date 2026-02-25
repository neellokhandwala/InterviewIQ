import './App.css'
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/clerk-react'

function App() {

  return (
    <>
    <h1>Welcome to the app</h1>
    <SignedOut>
      <SignInButton mode="modal">
        <button>
          Log In
        </button>
      </SignInButton>
    </SignedOut>

    <SignedIn>
      <SignOutButton />
    </SignedIn>
    </>
  );
}

export default App
