import express from "express";
import { generateResume, generateResumeModern, generateResumeCompact } from "../resume/generateResume.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
    const data = req.body;

    // choose template
    const file = generateResume(data);  // or Modern / Compact

    res.download(file);
});

export default router;
