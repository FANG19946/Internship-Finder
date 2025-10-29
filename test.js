const { generateResume } = require('./generateResume');

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
            description: p.description,
            skills_used: p.skills
        })),
        education: usr.education,
        experience: usr.experience,
        achievements: usr.achievements
    };

    return generateResume(resumeData);
}

// Creating mock 'usr' object using existing data
const usr = {
  name: "Harshit Singh Bhomawat",
  title: "Software Engineer",
  email: "harshitbhomawat@gmail.com",
  phone: "6264038742",
  address: "D-230, Deendayal Nagar, Ratlam, (M.P.)",
  links: ["LinkedIn", "Github", "CodeChef", "LeetCode"],
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
      description: [
        "Built NLP-powered flashcard generator using Streamlit & Spacy.",
        "Implemented quiz and MCQ mode."
      ],
      skills: ["Python", "Streamlit", "Spacy"]
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
