import fs from "fs";
import PdfPrinter from "pdfmake";

// PDF fonts
const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold"
  }
};

const printer = new PdfPrinter(fonts);

// Helper: clickable text
export const makeClickableText = (link) => {
  if (typeof link === "object" && link.url) {
    return { text: link.text || link.url, link: link.url, color: "blue", decoration: "underline" };
  }
  if (typeof link === "string" && link.startsWith("http")) {
    return { text: link, link, color: "blue", decoration: "underline" };
  }
  return { text: link || "" };
};

// Section helpers
function sectionDivider(title) {
  return { text: title, style: "sectionLabel", decoration: "underline", decorationStyle: "solid", decorationColor: "#2E3A59" };
}

function generateExperienceSection(experiences = []) {
  console.log("Generating experience section with experiences:", experiences);
  return experiences.flatMap(exp => [
    { text: `${exp.role} | ${exp.company} | ${exp.duration}`, style: "expTitle" },
    ...(Array.isArray(exp.description) ? exp.description.map(i => `• ${i}`) : [exp.description])
  ]);
}

function generateProjectSection(projects = []) {
  return projects.flatMap(proj => {
    const headerParts = [{ text: proj.title, style: "expTitle" }];
    if (proj.link) headerParts.push({ text: " (link)", link: proj.link, color: "blue" });

    const details = [];
    if (proj.company) details.push(proj.company);
    if (proj.duration) details.push(proj.duration);

    const headerLine = { text: headerParts, margin: [0, 2, 0, 2] };
    const companyLine = details.length ? { text: details.join(" | "), style: "subheader", margin: [0, 0, 0, 4] } : null;
    const descriptionArray = Array.isArray(proj.description) ? proj.description : [proj.description].filter(Boolean);

    return [headerLine, ...(companyLine ? [companyLine] : []), ...descriptionArray.map(item => `• ${item}`), ..."\n"];
  });
}

function generateEducationSection(education = []) {
  return education.map(edu => ({
    text: `${edu.degree} | ${edu.institution} | ${edu.graduation} | CGPA: ${edu.cgpa}`,
    margin: [0, 2, 0, 2]
  }));
}

// Classic Resume
export function generateResume(data, filename = "resume.pdf") {
  const docDefinition = {
    pageMargins: [50, 40, 50, 40],
    content: [
      { text: data.name, style: "header", alignment: "center" },
      { text: [data.title, " | ", makeClickableText(data.phone), " | ", makeClickableText(data.email)], style: "subheader", alignment: "center" },
      { text: `Address: ${data.address}`, style: "subheader", alignment: "center" },
      { text: (data.links || []).flatMap((link, i, arr) => { const clickable = makeClickableText(link); return i < arr.length - 1 ? [clickable, { text: " | " }] : [clickable]; }), alignment: "center", style: "subheader", margin: [0, 5, 0, 20] },
      { text: "Work Experience", style: "sectionHeader" }, ...generateExperienceSection(data.experience),
      { text: "Projects", style: "sectionHeader" }, ...generateProjectSection(data.projects),
      { text: "Education", style: "sectionHeader" }, ...generateEducationSection(data.education),
      { text: "Skills", style: "sectionHeader" }, { ul: data.skills },
      ...(data.achievements?.length ? [{ text: "Achievements", style: "sectionHeader" }, { ul: data.achievements }] : [])
    ],
    styles: {
      header: { fontSize: 20, bold: true, margin: [0, 0, 0, 5] },
      subheader: { fontSize: 11, margin: [0, 2, 0, 2] },
      sectionHeader: { fontSize: 14, bold: true, margin: [0, 15, 0, 10] },
      expTitle: { bold: true, margin: [0, 5, 0, 3] }
    },
    defaultStyle: { font: "Helvetica", fontSize: 11 }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filename));
  pdfDoc.end();
  console.log(`✅ Resume generated: ${filename}`);
}

// Modern Resume
export function generateResumeModern(data, filename = "resume_modern.pdf") {
  const docDefinition = {
    pageMargins: [40, 50, 40, 50],
    content: [
      { columns: [
          { width: '*', text: `${data.name}\n${data.title}`, style: "headerText" },
          { width: 'auto', stack: [
            { text: data.email }, { text: data.phone }, { text: data.address },
            { text: data.links.flatMap((link, i) => { const clickable = makeClickableText(link); return i < data.links.length-1 ? [clickable, { text:' | ', color:'#555'}] : [clickable]; }), style: 'contactInfo', alignment:'right' }
          ], alignment:'right', style:'contactInfo' }
      ], margin:[0,0,0,10], fillColor:"#2E3A59" },
      sectionDivider("Professional Experience"), ...generateExperienceSection(data.experience),
      sectionDivider("Projects"), ...generateProjectSection(data.projects),
      sectionDivider("Skills"), { ul: data.skills },
      ...(data.achievements?.length ? [sectionDivider("Achievements"), { ul: data.achievements }] : []),
      sectionDivider("Education"), ...generateEducationSection(data.education)
    ],
    styles: {
      headerText: { bold: true, fontSize: 18, margin: [10,10] },
      contactInfo: { fontSize: 10, margin: [10,10] },
      sectionLabel: { bold: true, fontSize: 13, margin: [0,15,0,6], color: "#2E3A59" },
      expTitle: { bold: true, margin: [0,2,0,2] }
    },
    defaultStyle: { font:"Helvetica", fontSize:10 }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filename));
  pdfDoc.end();
  console.log(`✅ Modern Resume: ${filename}`);
}

// Compact Resume
export function generateResumeCompact(data, filename = "resume_compact.pdf") {
  const docDefinition = {
    pageMargins: [40, 40, 40, 40],
    content: [
      { text: data.name, style: "header" },
      { text: `${data.title}\n${data.email} | ${data.phone}\n${data.address}`, style: "subheader", margin:[0,0,0,10] },
      { columns: [
        { width:"30%", stack: [
            { text:"Skills", style:"sectionHeader" }, { ul: data.skills },
            ...(data.achievements?.length ? [{ text:"Achievements", style:"sectionHeader", margin:[0,10,0,0]}, { ul:data.achievements }] : []),
            { text:"Links", style:"sectionHeader", margin:[0,10,0,0]}, { ul: (data.links||[]).map(makeClickableText) }
        ]},
        { width:"70%", stack: [
            { text:"Experience", style:"sectionHeader" }, ...generateExperienceSection(data.experience),
            { text:"Projects", style:"sectionHeader" }, ...generateProjectSection(data.projects),
            { text:"Education", style:"sectionHeader" }, ...generateEducationSection(data.education)
        ]}
      ]}
    ],
    styles: {
      header: { fontSize: 20, bold:true },
      subheader: { fontSize:10, margin:[0,0,0,10] },
      sectionHeader: { fontSize:12, bold:true, margin:[0,10,0,5], color:"#2E3A59" },
      expTitle: { bold:true, margin:[0,2,0,2] }
    },
    defaultStyle: { font:"Helvetica", fontSize:10 }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filename));
  pdfDoc.end();
  console.log(`✅ Compact Resume: ${filename}`);
}
