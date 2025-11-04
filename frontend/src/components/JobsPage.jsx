import React, { useState } from "react";
import JobCard from "./JobCard";
import "./JobsPage.css";
import { useNavigate } from "react-router-dom";

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      location: "Remote",
      salary: "$120k - $150k",
      type: "Full-Time",
      skills: ["React", "JavaScript", "Tailwind CSS", "HTML"],
      link: "https://careers.google.com/",
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "Amazon",
      location: "Bangalore, IN",
      salary: "$110k - $130k",
      type: "Contract",
      skills: ["Node.js", "Express", "MongoDB", "API Design"],
      link: "https://www.amazon.jobs/",
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "Microsoft",
      location: "Hyderabad, IN",
      salary: "$90k - $105k",
      type: "Full-Time",
      skills: ["SQL", "Excel", "Power BI", "Python"],
      link: "https://careers.microsoft.com/",
    },
    {
      id: 4,
      title: "ML Engineer",
      company: "OpenAI",
      location: "Remote",
      salary: "$150k - $180k",
      type: "Full-Time",
      skills: ["Python", "TensorFlow", "Deep Learning", "NLP"],
      link: "https://openai.com/careers",
    },
    {
      id: 5,
      title: "Fullstack Developer",
      company: "StartupX",
      location: "Pune, IN",
      salary: "$95k - $110k",
      type: "Part-Time",
      skills: ["React", "Node.js", "Postgres", "AWS"],
      link: "https://www.linkedin.com/jobs",
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "InfraCorp",
      location: "Mumbai, IN",
      salary: "$130k - $160k",
      type: "Full-Time",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
      link: "https://www.naukri.com/",
    },
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🧭 Handle Job Click → Navigate to new page
  const handleJobClick = (job) => {
    navigate(`/job/${job.id}`, { state: job });
  };

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <h1 className="jobs-title">Job Listings</h1>
        <p className="jobs-subtitle">Find your next opportunity.</p>

        {/* 🔍 Search Bar */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 🧱 Job Grid */}
        <div className="jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                style={{ cursor: "pointer" }}
              >
                <JobCard {...job} />
              </div>
            ))
          ) : (
            <p className="no-jobs">No jobs found matching your search term.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;


// import React, { useState } from "react";
// import JobCard from "./JobCard";
// import "./JobsPage.css";

// const JobsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedJob, setSelectedJob] = useState(null); // 👈 for modal

//   const jobs = [
//     {
//       id: 1,
//       title: "Frontend Developer",
//       company: "Google",
//       location: "Remote",
//       salary: "$120k - $150k",
//       type: "Full-Time",
//       skills: ["React", "JavaScript", "Tailwind CSS", "HTML"],
//       link: "https://careers.google.com/",
//     },
//     {
//       id: 2,
//       title: "Backend Engineer",
//       company: "Amazon",
//       location: "Bangalore, IN",
//       salary: "$110k - $130k",
//       type: "Contract",
//       skills: ["Node.js", "Express", "MongoDB", "API Design"],
//       link: "https://www.amazon.jobs/",
//     },
//     {
//       id: 3,
//       title: "Data Analyst",
//       company: "Microsoft",
//       location: "Hyderabad, IN",
//       salary: "$90k - $105k",
//       type: "Full-Time",
//       skills: ["SQL", "Excel", "Power BI", "Python"],
//       link: "https://careers.microsoft.com/",
//     },
//     {
//       id: 4,
//       title: "ML Engineer",
//       company: "OpenAI",
//       location: "Remote",
//       salary: "$150k - $180k",
//       type: "Full-Time",
//       skills: ["Python", "TensorFlow", "Deep Learning", "NLP"],
//       link: "https://openai.com/careers",
//     },
//     {
//       id: 5,
//       title: "Fullstack Developer",
//       company: "StartupX",
//       location: "Pune, IN",
//       salary: "$95k - $110k",
//       type: "Part-Time",
//       skills: ["React", "Node.js", "Postgres", "AWS"],
//       link: "https://www.linkedin.com/jobs",
//     },
//     {
//       id: 6,
//       title: "DevOps Engineer",
//       company: "InfraCorp",
//       location: "Mumbai, IN",
//       salary: "$130k - $160k",
//       type: "Full-Time",
//       skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
//       link: "https://www.naukri.com/",
//     },
//   ];

//   const filteredJobs = jobs.filter(
//     (job) =>
//       job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.company.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const closeModal = () => setSelectedJob(null);

//   return (
//     <div className="jobs-page">
//       <div className="jobs-container">
//         <h1 className="jobs-title">Job Listings</h1>
//         <p className="jobs-subtitle">Find your next opportunity.</p>

//         {/* 🔍 Search Bar */}
//         <div className="search-bar">
//           <span className="search-icon">🔍</span>
//           <input
//             type="text"
//             placeholder="Search by title or company..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* 🧱 Job Grid */}
//         <div className="jobs-grid">
//           {filteredJobs.length > 0 ? (
//             filteredJobs.map((job) => (
//               <div key={job.id} onClick={() => setSelectedJob(job)}>
//                 <JobCard {...job} />
//               </div>
//             ))
//           ) : (
//             <p className="no-jobs">No jobs found matching your search term.</p>
//           )}
//         </div>
//       </div>

//       {/* 🪟 Modal Popup */}
//       {selectedJob && (
//         <div
//           className="job-modal-overlay"
//           onClick={closeModal}
//         >
//           <div
//             className="job-modal-content"
//             onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//           >
//             <button className="close-btn" onClick={closeModal}>
//               ✖
//             </button>
//             <h2>{selectedJob.title}</h2>
//             <p><strong>Company:</strong> {selectedJob.company}</p>
//             <p><strong>Location:</strong> {selectedJob.location}</p>
//             <p><strong>Salary:</strong> {selectedJob.salary}</p>
//             <p><strong>Type:</strong> {selectedJob.type}</p>
//             <p>
//               <strong>Skills:</strong> {selectedJob.skills.join(", ")}
//             </p>

//             <div className="modal-buttons">
//               <button
//                 className="generate-btn"
//                 onClick={() => alert("Resume generation coming soon!")}
//               >
//                 Generate Resume
//               </button>
//               <button
//                 className="posting-btn"
//                 onClick={() => window.open(selectedJob.link, "_blank")}
//               >
//                 Go to Posting
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobsPage;


// import React, { useState } from "react";
// import JobCard from "./JobCard";
// import "./JobsPage.css";

// const JobsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const jobs = [
//     {
//       id: 1,
//       title: "Frontend Developer",
//       company: "Google",
//       location: "Remote",
//       salary: "$120k - $150k",
//       type: "Full-Time",
//       skills: ["React", "JavaScript", "Tailwind CSS", "HTML"],
//     },
//     {
//       id: 2,
//       title: "Backend Engineer",
//       company: "Amazon",
//       location: "Bangalore, IN",
//       salary: "$110k - $130k",
//       type: "Contract",
//       skills: ["Node.js", "Express", "MongoDB", "API Design"],
//     },
//     {
//       id: 3,
//       title: "Data Analyst",
//       company: "Microsoft",
//       location: "Hyderabad, IN",
//       salary: "$90k - $105k",
//       type: "Full-Time",
//       skills: ["SQL", "Excel", "Power BI", "Python"],
//     },
//     {
//       id: 4,
//       title: "ML Engineer",
//       company: "OpenAI",
//       location: "Remote",
//       salary: "$150k - $180k",
//       type: "Full-Time",
//       skills: ["Python", "TensorFlow", "Deep Learning", "NLP"],
//     },
//     {
//       id: 5,
//       title: "Fullstack Developer",
//       company: "StartupX",
//       location: "Pune, IN",
//       salary: "$95k - $110k",
//       type: "Part-Time",
//       skills: ["React", "Node.js", "Postgres", "AWS"],
//     },
//     {
//       id: 6,
//       title: "DevOps Engineer",
//       company: "InfraCorp",
//       location: "Mumbai, IN",
//       salary: "$130k - $160k",
//       type: "Full-Time",
//       skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
//     },
//   ];

//   const filteredJobs = jobs.filter(
//     (job) =>
//       job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.company.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="jobs-page">
//       <div className="jobs-container">
//         <h1 className="jobs-title">Job Listings</h1>
//         <p className="jobs-subtitle">Find your next opportunity.</p>

//         {/* 🔍 Search Bar */}
//         <div className="search-bar">
//           <span className="search-icon">🔍</span>
//           <input
//             type="text"
//             placeholder="Search by title or company..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* 🧱 Job Grid */}
//         <div className="jobs-grid">
//           {filteredJobs.length > 0 ? (
//             filteredJobs.map((job) => <JobCard key={job.id} {...job} />)
//           ) : (
//             <p className="no-jobs">No jobs found matching your search term.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobsPage;
