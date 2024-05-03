import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Resources from './pages/Resources';
import Post from './pages/Post';
import Admin  from './pages/Admin';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/post" element={<Post />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </MainLayout>
  );
}

export default App;