const { generateResume, generateResumeModern, generateResumeCompact } = require('./generateResume');

function CreateCustomResume(usr, jb) {
    const requiredSkills = new Set(jb.skills_required);
    const userSkills = new Set(usr.skills);

    // Find matching skills between job and user
    const matchingSkills = [...requiredSkills].filter(skill => userSkills.has(skill));

    // Filter relevant projects based on skill intersection
    const relevantProjects = usr.projects.filter(project =>
        project.skills.some(skill => requiredSkills.has(skill))
    );

    const resumeData = {
        name: usr.name,
        title: usr.title,
        email: usr.email,
        phone: usr.phone,
        address: usr.address,
        links: usr.links, 
        skills: matchingSkills,
        projects: relevantProjects.map(p => ({
            title: p.title,
            link: p.link,
            description: p.description,
            skills_used: p.skills,
            company: p.company,
            duration: p.duration
        })),
        education: usr.education,
        experience: usr.experience,
        achievements: usr.achievements
    };

    generateResume(resumeData);
    generateResumeModern(resumeData, "resume_modern.pdf");
    generateResumeCompact(resumeData, "resume_compact.pdf");
    return;
}

// Creating mock 'usr' object using existing data
const usr = {
  name: "Harshit Singh Bhomawat",
  title: "Software Engineer",
  email: "harshitbhomawat@gmail.com",
  phone: "6264038742",
  address: "D-230, Deendayal Nagar, Ratlam, (M.P.)",
  //links: ["LinkedIn", "Github", "CodeChef", "LeetCode"],
  links: [
    { text: "LinkedIn", url: "https://linkedin.com/in/harshit" },
    { text: "GitHub", url: "https://github.com/harshit" },
    { text: "CodeChef", url: "https://www.codechef.com/users/harshit" },
    { text: "LeetCode", url: "https://leetcode.com/harshit" }
  ],
  skills: ["C++", "Python", "Linux", "Socket Programming", "ZeroMQ", "Django"],
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "Acropolis Institute of Technology",
      graduation: "2022",
      cgpa: "8.13",
    },
  ],
  experience: [
    {
      role: "Programmer Analyst",
      company: "Algowire Trading Technologies",
      duration: "Oct 2022 – Present",
      description: [
        "Developed Linux-based C++ apps using Socket programming and ZeroMQ.",
        "Enhanced performance using optimized multithreading."
      ],
    },
  ],
  projects: [
    {
      title: "Flashcard Generator App",
      link: "https://github.com/harshit/flashcard-generator",
      description: [
        "NLP-powered flashcard generator with quiz and MCQ modes.",
        "Built from scratch using C++, Linux sockets, and ZeroMQ.",
        "Built collaborative filtering-based system using Python ML stack.",
        "Full-stack job listing platform using MERN stack."
      ],
      skills: ["Python", "NLP", "Streamlit"],
      company: "Personal Project",
      duration: "Jan 2023 – Apr 2023"
    },
    {
      title: "Key-Value Store with Client-Server Architecture",
      link: "https://github.com/harshit/key-value-store",
      description: "Built from scratch using C++, Linux sockets, and ZeroMQ.",
      skills: ["C++", "Linux", "Socket Programming", "ZeroMQ"],
      company: "Personal Project",
      duration: "Aug 2022 – Dec 2022"
    },
    {
      title: "Movie Recommendation System",
      description: "Built collaborative filtering-based system using Python ML stack.",
      skills: ["Python", "Pandas", "Machine Learning"]
      // ❌ No company, no duration → edge case test
    },
    {
      title: "Campus Recruitment Portal",
      description: "Full-stack job listing platform using MERN stack.",
      skills: ["ReactJS", "NodeJS", "MongoDB"],
      company: "College Mini Project",
      duration: "Feb 2021 – May 2021"
    },
    {
      title: "Portfolio Website",
      description: "Personal portfolio built with modern responsive UI.",
      skills: ["HTML", "CSS", "JavaScript", "ReactJS"]
      // ❌ another edge case: no company, no duration
    },
    {
      title: "Attendance Management System",
      description: "DBMS project using MySQL with CRUD operations.",
      skills: ["MySQL", "DBMS"],
      duration: "Nov 2020 – Jan 2021"
      // ❌ Missing company only
    }
  ],
  achievements: ["GATE CS Rank 200"]
};

// Creating mock 'jb' object with required skills
const jb = {
  title: "Backend Developer Intern",
  skills_required: ["Python", "Django", "Linux", "Socket Programming"]
};

// ✅ Call CreateCustomResume to test
CreateCustomResume(usr, jb);


// generateResume({
//   name: "Harshit Singh Bhomawat",
//   title: "Software Engineer",
//   email: "harshitbhomawat@gmail.com",
//   phone: "6264038742",
//   address: "D-230, Deendayal Nagar, Ratlam, (M.P.)",
//   links: ["LinkedIn", "Github", "CodeChef", "LeetCode"],
//   skills: ["C++", "Python", "Linux", "Socket Programming", "ZeroMQ", "Django"],
//   education: [
//     {
//       degree: "B.Tech in Computer Science",
//       institution: "Acropolis Institute of Technology",
//       graduation: "2022",
//       cgpa: "8.13",
//     },
//   ],
//   experiences: [
//     {
//       role: "Programmer Analyst",
//       company: "Algowire Trading Technologies",
//       duration: "Oct 2022 – Present",
//       description: [
//         "Developed Linux-based C++ apps using Socket programming and ZeroMQ.",
//         "Enhanced performance using optimized multithreading."
//       ],
//     },
//   ],
//   projects: [
//     {
//       title: "Flashcard Generator App",
//       company: "Personal Project",
//       duration: "2023",
//       description: [
//         "Built NLP-powered flashcard generator using Streamlit & Spacy.",
//         "Implemented quiz and MCQ mode.",
//       ],
//     },
//   ],
//   achievements: ["GATE CS Rank 200"]
// });
