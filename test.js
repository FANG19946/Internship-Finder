const { generateResume } = require('./generateResume');

generateResume({
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
  experiences: [
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
      company: "Personal Project",
      duration: "2023",
      description: [
        "Built NLP-powered flashcard generator using Streamlit & Spacy.",
        "Implemented quiz and MCQ mode.",
      ],
    },
  ],
  achievements: ["GATE CS Rank 200"]
});
