import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedProfile from './pages/Profile';
import ProtectedApplications from './pages/Applications';
import ApplicationForm from './components/ApplicationForm';
import ProtectedApplicationDetail from './components/ApplicationDetail';
import Unauthorized from './pages/Unauthorized';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/applications" element={<ProtectedApplications />} />
          <Route path="/applications/:id" element={<ProtectedApplicationDetail />} />
          <Route path="/applications/apply" element={<ApplicationForm />} />
          <Route path="/profile" element={<ProtectedProfile />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
