// generateResume.js
import jsPDF from "jspdf";

// Helper: clickable links (for display purposes)
const formatLinks = (links = []) => {
  return links.map(l => typeof l === "string" ? l : l.text || l.url).join(" | ");
};

// Helper: format projects/experience
const formatList = (items = [], titleKey = "title") =>
  items.map(item => {
    const header = item[titleKey] ? `${item[titleKey]}${item.company ? " | " + item.company : ""}${item.duration ? " | " + item.duration : ""}` : "";
    const description = Array.isArray(item.description) ? item.description.join("\n") : item.description || "";
    return `${header}\n${description}\n`;
  }).join("\n");

// Classic Resume (single function, simple)
export function generateResume(data, type = "classic") {
  const doc = new jsPDF();

  let y = 10;

  doc.setFontSize(20);
  doc.text(data.name || "", 105, y, { align: "center" });

  y += 10;
  doc.setFontSize(12);
  doc.text(`${data.title || ""} | ${data.email || ""} | ${data.phone || ""}`, 105, y, { align: "center" });

  y += 10;
  doc.text(`Address: ${data.address || ""}`, 105, y, { align: "center" });

  y += 10;
  doc.text(`Links: ${formatLinks(data.links)}`, 105, y, { align: "center" });

  y += 15;
  doc.setFontSize(14);
  doc.text("Experience", 10, y);
  doc.setFontSize(11);
  y += 5;
  doc.text(formatList(data.experience, "role"), 10, y);

  y += 5;
  doc.setFontSize(14);
  doc.text("Projects", 10, y);
  doc.setFontSize(11);
  y += 5;
  doc.text(formatList(data.projects, "title"), 10, y);

  y += 5;
  doc.setFontSize(14);
  doc.text("Skills", 10, y);
  doc.setFontSize(11);
  y += 5;
  doc.text((data.skills || []).join(", "), 10, y);

  if (data.education?.length) {
    y += 5;
    doc.setFontSize(14);
    doc.text("Education", 10, y);
    doc.setFontSize(11);
    y += 5;
    doc.text(formatList(data.education, "degree"), 10, y);
  }

  if (data.achievements?.length) {
    y += 5;
    doc.setFontSize(14);
    doc.text("Achievements", 10, y);
    doc.setFontSize(11);
    y += 5;
    doc.text(data.achievements.join("\n"), 10, y);
  }

  // Save file
  doc.save(type === "modern" ? "resume_modern.pdf" : type === "compact" ? "resume_compact.pdf" : "resume.pdf");
  console.log(`✅ Resume generated (${type})`);
}
