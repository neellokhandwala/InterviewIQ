import  { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

function HomePage() {
    const [books,setBooks] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [error,setError] = useState(null)

    useEffect(() => {
        const getBooks = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/books");
                const data = await res.json();
                setBooks(data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);            }
        }

        getBooks();
    },[]);

    return <div>
        <button className="btn btn-secondary" onClick={() => toast.success("This is a success")}>Click me</button>
        <SignedOut>
            <SignInButton mode="modal">
                <button>Login</button>
            </SignInButton>
        </SignedOut>

        <SignedIn>
            <SignOutButton/>
        </SignedIn>

        <UserButton />

    </div>
}


export default HomePage;