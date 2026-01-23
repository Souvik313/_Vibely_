import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import { SocketProvider } from './context/SocketContext.jsx';
import App from './App.jsx';

function RootComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    console.log("📦 Root - Loading user from localStorage:", loggedInUser);
    setUser(loggedInUser);

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      console.log("📦 Root - Storage changed, new user:", updatedUser);
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <SocketProvider user={user}>
          <App />
        </SocketProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<RootComponent />);
