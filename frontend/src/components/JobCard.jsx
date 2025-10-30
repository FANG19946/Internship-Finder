import React from "react";
import "./JobsPage.css";

const JobCard = ({ title, company, location, salary, type, skills }) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <h2 className="job-title">{title}</h2>
        <p className="company-name">{company}</p>
      </div>

      <div className="job-info">
        <p>📍 {location}</p>
        <p>💰 {salary}</p>
        <p>💼 {type}</p>
      </div>

      <div className="skills-section">
        <div className="skills-list">
          {skills.map((skill, index) => (
            <span key={index} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
