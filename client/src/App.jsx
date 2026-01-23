import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Route , Router , Routes} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './pages/Home/Home.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Register from './pages/Register/Register.jsx';
import Login from './pages/Login/Login.jsx';
import PostCard from './components/PostCard/PostCard.jsx';
import CreatePost from './pages/CreatePost/CreatePost.jsx';
import SavedPosts from './pages/SavedPosts/SavedPosts.jsx';
import EditProfile from './pages/EditProfile/EditProfile.jsx';
import About from './pages/About/About.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Chat from './pages/Chat/Chat.jsx';
import './App.css'
import { SocketProvider } from './context/SocketContext.jsx';

function App() {

  return (
   <>
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/register" element = {<Register />} />
      <Route path="/login" element = {<Login />} />
      <Route path = "/profile/:userId" element = {<Profile />} />
      <Route path = "/post/:postId" element = {<PostCard />} />
      <Route path = "/create-post" element={<CreatePost />} />
      <Route path = "/saved-posts" element = {<SavedPosts />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact'  element={<Contact />} />
      <Route path='/edit-profile' element={<EditProfile />} />
      <Route path='/chat/:conversationId' element={<Chat />} />
    </Routes>
    <Footer />
   </>
  )
}

export default App;
