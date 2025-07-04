import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

//Pages
import Home from './pages/Home/Home.jsx'
import Projects from './pages/Projects/Projects.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import Account from './pages/Account/Account.jsx'
import Logout from './pages/Auth/Logout.jsx'
import ProjectDetails from './pages/ProjectDetails/ProjectDetails.jsx'
import PostDetails from './pages/PostDetails/PostDetails.jsx'
import SavedPosts from './pages/SavedPosts/SavedPosts.jsx'
import NotFound from './pages/NotFound.jsx'

//NavBar
import NavBar from './components/NavBar/NavBar.jsx';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className='route-body'>
        <Routes>
          <Route path='/posts' element={<Home />} />
          <Route path='/' element={<Projects />} />
          <Route path='/saved-posts' element={<SavedPosts />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/account' element={<Account />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/post/:postId' element={<PostDetails />} />
          <Route path='/project/:projectId' element={<ProjectDetails />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
