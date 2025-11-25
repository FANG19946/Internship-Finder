import express from "express";
import path from "path";
import fs from "fs";
import { generateResume, generateResumeCompact, generateResumeModern } from "../utils/generateResume.js";


const router = express.Router();

router.post("/generate", (req, res) => {
  console.log("Working tilll here.");
  const { data, template } = req.body;
  console.log(template+"Recieved template"); // Debug log
  console.log(data+"Recieved data"); // Debug log
  if (!data || !template) return res.status(400).json({ error: "Missing data or template" });

  const filename = path.join(process.cwd(), `temp_${Date.now()}.pdf`);

  try {
    if (template === "Classic") generateResume(data, filename);
    else if (template === "Modern") generateResumeModern(data, filename);
    else if (template === "Compact") generateResumeCompact(data, filename);
    else return res.status(400).json({ error: "Unknown template" });

    const stream = fs.createReadStream(filename);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${data.name}.pdf"`);
    stream.pipe(res);
    stream.on("end", () => fs.unlinkSync(filename));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

export default router;
