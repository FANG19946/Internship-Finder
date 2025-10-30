const fs = require("fs");
const PdfPrinter = require("pdfmake");

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold"
  }
};

const printer = new PdfPrinter(fonts);

// function makeClickableText(text) {
//   if (!text) return text;

//   const urlRegex = /^(https?:\/\/[^\s]+)$/i;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const phoneRegex = /^[+]?[0-9\s\-()]+$/;

//   if (urlRegex.test(text)) {
//     return { text, link: text, color: "blue", decoration: "underline" };
//   } else if (emailRegex.test(text)) {
//     return { text, link: `mailto:${text}`, color: "blue", decoration: "underline" };
//   } else if (phoneRegex.test(text)) {
//     return { text, link: `tel:${text}`, color: "blue", decoration: "underline" };
//   } else {
//     return { text };
//   }
// }


// function generateResume(data, filename = "resume.pdf") {
//   const docDefinition = {
//     pageMargins: [50, 40, 50, 40],

//     content: [
//       // Header
//       {
//         text: data.name,
//         style: "header",
//         alignment: "center",
//       },
//       {
//         text: `${data.title} | ${makeClickableText(data.phone)} | ${makeClickableText(data.email)}`,
//         style: "subheader",
//         alignment: "center",
//       },
//       {
//         text: `Address: ${data.address}`,
//         style: "subheader",
//         alignment: "center",
//       },
//       {
//         //text: (data.links || []).join(" | "),
//         stack: (data.links || []).map(link => makeClickableText(link)),
//         style: "subheader",
//         alignment: "center",
//         margin: [0, 0, 0, 20]
//       },

//       // Work Experience
//       {
//         text: "Work Experience",
//         style: "sectionHeader"
//       },
//       ...generateExperienceSection(data.experience),

//       // Projects
//       {
//         text: "Projects",
//         style: "sectionHeader"
//       },
//       ...generateProjectSection(data.projects),

//       // Education
//       {
//         text: "Education",
//         style: "sectionHeader"
//       },
//       ...generateEducationSection(data.education),

//       // Skills
//       {
//         text: "Skills",
//         style: "sectionHeader"
//       },
//       {
//         ul: data.skills.map(skill => `${skill}`)
//       },

//       // Achievements (Optional)
//       ...(data.achievements?.length
//         ? [
//             { text: "Achievements", style: "sectionHeader" },
//             { ul: data.achievements }
//           ]
//         : []
//       ),
//     ],

//     styles: {
//       header: { fontSize: 20, bold: true, margin: [0, 0, 0, 5] },
//       subheader: { fontSize: 11, margin: [0, 2, 0, 2] },
//       sectionHeader: { fontSize: 14, bold: true, margin: [0, 15, 0, 10] },
//       expTitle: { bold: true, margin: [0, 5, 0, 3] }
//     },

//     defaultStyle: {
//       font: "Helvetica",
//       fontSize: 11
//     }
//   };

//   const pdfDoc = printer.createPdfKitDocument(docDefinition);
//   pdfDoc.pipe(fs.createWriteStream(filename));
//   pdfDoc.end();

//   console.log(`✅ Resume generated successfully: ${filename}`);
// }

// Helper to make clickable text
const makeClickableText = (link) => {
  // If link is an object like { text: "GitHub", url: "https://github.com/..." }
  if (typeof link === "object" && link.url) {
    return {
      text: link.text || link.url,
      link: link.url,
      color: "blue",
      decoration: "underline"
    };
  }
  // If link is plain string
  if (typeof link === "string" && link.startsWith("http")) {
    return {
      text: link,
      link,
      color: "blue",
      decoration: "underline"
    };
  }
  // Otherwise, just return normal text
  return { text: link || "" };
};

function generateResume(data, filename = "resume.pdf") {
  const docDefinition = {
    pageMargins: [50, 40, 50, 40],

    content: [
      // Header
      { text: data.name, style: "header", alignment: "center" },
      {
        text: [
          data.title,
          " | ",
          makeClickableText(data.phone),
          " | ",
          makeClickableText(data.email)
        ],
        style: "subheader",
        alignment: "center"
      },
      { text: `Address: ${data.address}`, style: "subheader", alignment: "center" },

      {
        text: (data.links || []).flatMap((link, i, arr) => {
          const clickable = makeClickableText(link);
          return i < arr.length - 1
            ? [clickable, { text: " | ", color: "black" }]
            : [clickable];
        }),
        alignment: "center",
        style: "subheader",
        margin: [0, 5, 0, 20]
      },


      // Work Experience
      { text: "Work Experience", style: "sectionHeader" },
      ...generateExperienceSection(data.experience),

      // Projects
      { text: "Projects", style: "sectionHeader" },
      ...generateProjectSection(data.projects),

      // Education
      { text: "Education", style: "sectionHeader" },
      ...generateEducationSection(data.education),

      // Skills
      { text: "Skills", style: "sectionHeader" },
      { ul: data.skills.map(skill => `${skill}`) },

      // Achievements (optional)
      ...(data.achievements?.length
        ? [
            { text: "Achievements", style: "sectionHeader" },
            { ul: data.achievements }
          ]
        : [])
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


function generateResumeModern(data, filename = "resume_modern.pdf") {
  const docDefinition = {
    pageMargins: [40, 50, 40, 50],

    content: [
      {
        columns: [
          {
            width: '*',
            text: `${data.name}\n${data.title}`,
            style: "headerText"
          },
          {
            width: 'auto',
            stack: [
              { text: data.email },
              { text: data.phone },
              { text: data.address },
              {
                text: data.links.flatMap((link, i) => {
                  const clickable = makeClickableText(link);
                  // Each item must be an object, not just text
                  const parts = [clickable];
                  if (i < data.links.length - 1) parts.push({ text: ' | ', color: '#555' });
                  return parts;
                }),
                style: 'contactInfo',
                alignment: 'right'
              }
            ],
            alignment: 'right',
            style: 'contactInfo'
          }
        ],
        margin: [0, 0, 0, 10],
        fillColor: "#2E3A59"//,
        //color: "white"
      },

      sectionDivider("Professional Experience"),
      ...generateExperienceSection(data.experience),

      sectionDivider("Projects"),
      ...generateProjectSection(data.projects),

      sectionDivider("Skills"),
      { ul: data.skills },

      ...(data.achievements?.length
        ? [
            sectionDivider("Achievements"),
            { ul: data.achievements }
          ] : [] ),

      sectionDivider("Education"),
      ...generateEducationSection(data.education),
    ],

    styles: {
      headerText: { bold: true, fontSize: 18, margin: [10, 10] },
      contactInfo: { fontSize: 10, margin: [10, 10] },
      sectionLabel: { bold: true, fontSize: 13, margin: [0, 15, 0, 6], color: "#2E3A59" },
      expTitle: { bold: true, margin: [0, 2, 0, 2] }
    },

    defaultStyle: {
      font: "Helvetica",
      fontSize: 10
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filename));
  pdfDoc.end();
  console.log(`✅ Modern Resume created: ${filename}`);
}

// Helper for section headings
function sectionDivider(title) {
  return {
    text: title,
    style: "sectionLabel",
    decoration: "underline",
    decorationStyle: "solid",
    decorationColor: "#2E3A59"
  };
}

function generateResumeCompact(data, filename = "resume_compact.pdf") {
  const docDefinition = {
    pageMargins: [40, 40, 40, 40],

    content: [
      {
        text: data.name,
        style: "header"
      },
      {
        text: `${data.title}\n${data.email} | ${data.phone}\n${data.address}`,
        style: "subheader",
        margin: [0, 0, 0, 10]
      },

      {
        columns: [
          {
            width: "30%",
            stack: [
              { text: "Skills", style: "sectionHeader" },
              { ul: data.skills },

              ...(data.achievements?.length
                ? [
                    { text: "Achievements", style: "sectionHeader", margin: [0,10,0,0] },
                    { ul: data.achievements }
                  ] : []),

              { text: "Links", style: "sectionHeader", margin: [0,10,0,0] },
              {
                ul: (data.links || []).map(link => makeClickableText(link))
              }

            ]
          },

          {
            width: "70%",
            stack: [
              { text: "Experience", style: "sectionHeader" },
              ...generateExperienceSection(data.experience),

              { text: "Projects", style: "sectionHeader" },
              ...generateProjectSection(data.projects),

              { text: "Education", style: "sectionHeader" },
              ...generateEducationSection(data.education)
            ]
          }
        ]
      }
    ],

    styles: {
      header: { fontSize: 20, bold: true },
      subheader: { fontSize: 10, margin: [0, 0, 0, 10] },
      sectionHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 5], color: "#2E3A59" },
      expTitle: { bold: true, margin: [0, 2, 0, 2] }
    },

    defaultStyle: {
      font: "Helvetica",
      fontSize: 10
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filename));
  pdfDoc.end();
  console.log(`✅ Compact Resume created: ${filename}`);
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
  return projects.flatMap(proj => {
    const headerParts = [];

    // Project title (always shown)
    headerParts.push({ text: proj.title, style: "expTitle" });

    if (proj.link) {
      headerParts.push({
        text: " (link)",
        link: proj.link,
        color: "blue"
      });
    }

    // Add company and duration if present
    const details = [];
    if (proj.company) details.push(proj.company);
    if (proj.duration) details.push(proj.duration);

    const headerLine = {
      text: headerParts,
      margin: [0, 2, 0, 2]
    };

    const companyLine = details.length
      ? {
          text: details.join(" | "),
          style: "subheader",
          margin: [0, 0, 0, 4]
        }
      : null;

    // Description text (list format)
    const descriptionArray = Array.isArray(proj.description)
      ? proj.description
      : [proj.description].filter(Boolean);

    return [
      headerLine,
      ...(companyLine ? [companyLine] : []),
      ...descriptionArray.map(item => `• ${item}`),
      ..."\n"
    ];
  });
}

function generateEducationSection(education = []) {
  return education.map(edu => ({
    text: `${edu.degree} | ${edu.institution} | ${edu.graduation} | CGPA: ${edu.cgpa}`,
    //alignment: "center",
    margin: [0, 2, 0, 2]
  }));
}

module.exports = { generateResume, generateResumeModern, generateResumeCompact };
