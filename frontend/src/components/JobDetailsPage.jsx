import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./JobsPage.css";

const JobDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state;

  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleGenerateClick = () => {
    if (!selectedTemplate) {
      alert("Please select a template first!");
      return;
    }
    alert(`Resume generated using template: ${selectedTemplate}`);
    setShowModal(false);
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
                    className={`template-card ${
                    selectedTemplate === template.name ? "selected" : ""
                    }`}
                    onClick={() => handleTemplateSelect(template.name)}
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
