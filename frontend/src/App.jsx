import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Hero from './components/Hero'
import JobsPage from './components/JobsPage'
import JobDetailsPage from './components/JobDetailsPage.jsx';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobsPage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App
