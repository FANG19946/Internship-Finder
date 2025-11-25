const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const {
  generateResume,
  generateResumeModern,
  generateResumeCompact
} = require("./generateResume");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/generate-resume", async (req, res) => {
  const { user, template } = req.body;

  if (!user || !template) {
    return res.status(400).json({ error: "Missing user or template in request body" });
  }

  // Defensive defaults
  user.skills = Array.isArray(user.skills) ? user.skills : [];
  user.projects = Array.isArray(user.projects) ? user.projects : [];
  user.experience = Array.isArray(user.experience) ? user.experience : [];
  user.education = Array.isArray(user.education) ? user.education : [];
  user.achievements = Array.isArray(user.achievements) ? user.achievements : [];
  user.links = Array.isArray(user.links) ? user.links : [];

  let generatorFn;
  switch (template.toLowerCase()) {
    case "modern":
      generatorFn = generateResumeModern;
      break;
    case "compact":
      generatorFn = generateResumeCompact;
      break;
    case "classic":
    default:
      generatorFn = generateResume;
      break;
  }

  const filename = path.join(__dirname, `resume_${Date.now()}.pdf`);

  try {
    // Generate the PDF to disk
    await generatorFn(user, filename);

    // Stream it back to client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="resume.pdf"`);

    const fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);

    // Optional: delete file after sending
    fileStream.on("end", () => fs.unlink(filename, () => {}));

  } catch (err) {
    console.error("❌ Error generating resume:", err);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Resume server running on http://localhost:${PORT}`);
});
