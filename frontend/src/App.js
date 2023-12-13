import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import VideoPage from './pages/VideoPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UploadVideoPage from './pages/UploadVideoPage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'

function App() {
  return (
    <Router>
      <Header/>
      <main>
        <Routes>
          <Route path="/" element={<HomePage/>} exact/>
          <Route path="/video/:id" element={<VideoPage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/upload_video" element={<UploadVideoPage/>}/>
          <Route path="/:str" element={<ProfilePage/>}/>
          <Route path="/edit_profile" element={<EditProfilePage/>}/>
        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;
