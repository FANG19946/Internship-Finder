const fs = require("fs");
const PdfPrinter = require("pdfmake");

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold"
  }
};

const printer = new PdfPrinter(fonts);

function generateResume(data, filename = "resume.pdf") {
  const docDefinition = {
    pageMargins: [50, 40, 50, 40],

    content: [
      // Header
      {
        text: data.name,
        style: "header",
        alignment: "center",
      },
      {
        text: `${data.title} | ${data.phone} | ${data.email}`,
        style: "subheader",
        alignment: "center",
      },
      {
        text: `Address: ${data.address}`,
        style: "subheader",
        alignment: "center",
      },
      {
        text: (data.links || []).join(" | "),
        style: "subheader",
        alignment: "center",
        margin: [0, 0, 0, 20]
      },

      // Work Experience
      {
        text: "Work Experience",
        style: "sectionHeader"
      },
      ...generateExperienceSection(data.experiences),

      // Projects
      {
        text: "Projects",
        style: "sectionHeader"
      },
      ...generateProjectSection(data.projects),

      // Education
      {
        text: "Education",
        style: "sectionHeader"
      },
      ...generateEducationSection(data.education),

      // Skills
      {
        text: "Skills",
        style: "sectionHeader"
      },
      {
        ul: data.skills.map(skill => `${skill}`)
      },

      // Achievements (Optional)
      ...(data.achievements?.length
        ? [
            { text: "Achievements", style: "sectionHeader" },
            { ul: data.achievements }
          ]
        : []
      ),
    ],

    styles: {
      header: { fontSize: 20, bold: true, margin: [0, 0, 0, 5] },
      subheader: { fontSize: 11, margin: [0, 2, 0, 2] },
      sectionHeader: { fontSize: 14, bold: true, margin: [0, 15, 0, 10] },
      expTitle: { bold: true, margin: [0, 5, 0, 3] }
    },

    defaultStyle: {
      font: "Helvetica",
      fontSize: 11
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filename));
  pdfDoc.end();

  console.log(`✅ Resume generated successfully: ${filename}`);
}

function generateExperienceSection(experiences = []) {
  return experiences.flatMap(exp => [
    {
      text: `${exp.role} | ${exp.company} | ${exp.duration}`,
      style: "expTitle"
    },
    ...(Array.isArray(exp.description)
      ? exp.description.map(item => `• ${item}`)
      : [exp.description])
  ]);
}

function generateProjectSection(projects = []) {
  return projects.flatMap(proj => [
    {
      text: `- ${proj.title} | ${proj.company} | ${proj.duration}`,
      style: "expTitle"
    },
    ...(Array.isArray(proj.description)
      ? proj.description.map(item => `• ${item}`)
      : [proj.description])
  ]);
}

function generateEducationSection(education = []) {
  return education.map(edu => ({
    text: `${edu.degree} | ${edu.institution} | ${edu.graduation} | CGPA: ${edu.cgpa}`,
    alignment: "center",
    margin: [0, 2, 0, 2]
  }));
}

module.exports = { generateResume };
