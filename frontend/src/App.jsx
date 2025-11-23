import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from './components/Hero';
import JobsPage from './components/JobsPage';
import JobDetailsPage from './components/JobDetailsPage';
import ProfilePage from './components/ProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />                  {/* Landing / Hero */}
        <Route path="/jobs" element={<JobsPage />} />         {/* Jobs listing */}
        <Route path="/job/:id" element={<JobDetailsPage />} /> {/* Job details */}
        <Route path="/profile" element={<ProfilePage />} />  {/* Profile page */}
      </Routes>
    </Router>
  );
}

export default App;
