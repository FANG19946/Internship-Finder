import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./JobsPage.css";
// import { generateResume } from "./generateResume";


const JobDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state;
  console.log("Job details page received job:", job); // log job details

  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [user, setUser] = useState(null); // add this state for user
  const [loading, setLoading] = useState(true); // add loading state if needed

  const userId = sessionStorage.getItem("userId"); // get userId



  useEffect(() => {
    if (!userId) {
      alert("User not logged in");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user data:", data); // log data
        setUser(data);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!job) {
    return (
      <div className="jobs-page">
        <div className="jobs-container">
          <p>Job details not found. Go back to listings.</p>
          <button onClick={() => navigate("/")}>Back to Jobs</button>
        </div>
      </div>
    );
  }

  const handleGenerateResume = () => {
    setShowModal(true);
  };

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template.name);
  };

const handleGenerateClick = async () => {
  if (!user || !selectedTemplate) return;

  try {

    const requiredSkills = new Set(job.skills);
    const userSkills = new Set(user.skills);
    console.log("Inside Create Custom Resume1")
    console.log("Job required skills:", requiredSkills);
    console.log("User skills:", userSkills);

    const requiredSkillsLower = new Set([...requiredSkills].map(s => s.toLowerCase()));
    const userSkillsLower = new Set([...userSkills].map(s => s.toLowerCase()));

    // Find matching skills between job and user
    const matchingSkills = [...requiredSkillsLower].filter(skill => userSkillsLower.has(skill));
    console.log("Matching skills:", matchingSkills);
    // Filter relevant projects based on skill intersection
    const relevantProjects = user.projects.filter(project =>
        project.skills.some(skill => requiredSkillsLower.has(skill.toLowerCase()))
    );

    console.log("Relevant projects:", relevantProjects);

    const resumeData = {
        name: user.name,
        title: user.title,
        email: user.email,
        phone: user.phone,
        address: user.address,
        links: user.links, 
        skills: matchingSkills,
       // projects: user.projects,  // include all skills instead of filtering projects
        projects: relevantProjects.map(p => ({
            title: p.title,
            link: p.link,
            description: p.description,
            skills_used: p.skills,
            company: p.company,
            duration: p.duration
        })),
        education: user.education,
        experience: user.experiences,
        achievements: user.achievements
    };

    console.log("Generated resume data:", resumeData.experience); // log resume data

    const res = await fetch("http://localhost:5000/api/resume/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: resumeData, template: selectedTemplate })
    });

    if (!res.ok) throw new Error("Failed to generate resume");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_${selectedTemplate}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("❌ Error generating resume. See console.");
  }
};





  const templates = [
    {
      name: "Classic",
      image: "/resumeTemplateClassic.png", // use actual local image path or URL
    },
    {
      name: "Modern",
      image: "/resumeTemplateModern.png",
    },
    {
      name: "Compact",
      image: "/resumeTemplateCompact.png",
    }
  ];


  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <h1 className="job-title">{job.title}</h1>
        <p className="company-name">{job.company}</p>

        <div className="job-info">
          <p>📍 Location: {job.location}</p>
          <p>💰 Salary: {job.salary}</p>
          <p>💼 Type: {job.type}</p>
        </div>

        <h3>Required Skills:</h3>
        <div className="skills-list">
          {job.skills.map((skill, index) => (
            <span key={index} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <button className="generate-btn" onClick={handleGenerateResume}>
            Generate Resume
          </button>

          <button
            className="posting-btn"
            onClick={() => window.open(job.link, "_blank")}
          >
            Go to Posting
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "2rem",
            background: "transparent",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
          }}
        >
          ← Back to Job Listings
        </button>
      </div>

      {/* Resume Template Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="modal-title">Select a template for your resume:</h2>

            <div className="template-options">
              {templates.map((template, index) => (
                <div
                  key={index}
                  className={`template-card ${selectedTemplate === template.name ? "selected" : ""
                    }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <img src={template.image} alt={template.name} />
                  <p className="template-name">{template.name}</p>
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="close-modal" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="generate-btn"
                onClick={handleGenerateClick}
                disabled={!selectedTemplate}
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/*{showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
          >
            <h2>Select a Resume Template</h2>
            <div className="template-options">
              {["Template 1", "Template 2", "Template 3"].map((t, index) => (
                <div
                  key={index}
                  className={`template-card ${
                    selectedTemplate === t ? "selected" : ""
                  }`}
                  onClick={() => handleTemplateSelect(t)}
                >
                  <img
                    src={`https://via.placeholder.com/150?text=${encodeURIComponent(
                      t
                    )}`}
                    alt={t}
                  />
                  <p>{t}</p>
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className="generate-btn" onClick={handleGenerateClick}>
                Generate
              </button>
            </div>
          </div>
        </div>
      )}*/}
    </div>
  );
};

export default JobDetailsPage;


// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./JobsPage.css";

// const JobDetailsPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const job = location.state;

//   if (!job) {
//     return (
//       <div className="jobs-page">
//         <div className="jobs-container">
//           <p>Job details not found. Go back to listings.</p>
//           <button onClick={() => navigate("/")}>Back to Jobs</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="jobs-page">
//       <div className="jobs-container">
//         <h1 className="job-title">{job.title}</h1>
//         <p className="company-name">{job.company}</p>

//         <div className="job-info">
//           <p>📍 Location: {job.location}</p>
//           <p>💰 Salary: {job.salary}</p>
//           <p>💼 Type: {job.type}</p>
//         </div>

//         <h3>Required Skills:</h3>
//         <div className="skills-list">
//           {job.skills.map((skill, index) => (
//             <span key={index} className="skill-badge">
//               {skill}
//             </span>
//           ))}
//         </div>

//         <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
//           <button
//             className="generate-btn"
//             onClick={() => alert("Resume generation coming soon!")}
//           >
//             Generate Resume
//           </button>

//           <button
//             className="posting-btn"
//             onClick={() => window.open(job.link, "_blank")}
//           >
//             Go to Posting
//           </button>
//         </div>

//         <button
//           onClick={() => navigate(-1)}
//           style={{
//             marginTop: "2rem",
//             background: "transparent",
//             border: "none",
//             color: "#007bff",
//             cursor: "pointer",
//           }}
//         >
//           ← Back to Job Listings
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JobDetailsPage;
