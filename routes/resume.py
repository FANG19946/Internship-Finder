import os
import uuid
import subprocess

from flask import session, request, redirect, url_for, flash, send_file

from app import app
from routes.decorators import login_required
from repo.profile import is_profile_complete, get_missing_profile_sections
from repo.users import get_user_by_id
from resume.generate import generate_resume_text

@app.route("/resume", methods=["POST"])
@login_required
def generate_resume():
    user_id = session["user_id"]

    
    missing = get_missing_profile_sections(user_id)

    if missing:
        flash(f"Please add the following before searching: {', '.join(missing)}.")
        return redirect(url_for("profile"))


    job_skills_raw = request.form.get("job_skills", "")
    job_skills = []

    for skill in job_skills_raw.split(","):
        skill = skill.strip()

        if skill:
            job_skills.append(skill)

    output_format = request.form.get("format")

    user = get_user_by_id(user_id)
    name = user["name"]

    tex_content = generate_resume_text(user_id, job_skills, name)

    #resume folder
    os.makedirs("generated_resumes", exist_ok=True)

    #unique folder for each resume
    unique_id = uuid.uuid4().hex[:8]
    base_filename = f"resume_{user_id}_{unique_id}"
    resume_dir = os.path.join("generated_resumes", base_filename)

    os.makedirs(resume_dir, exist_ok=True)

    tex_filepath = os.path.join(resume_dir, f"{base_filename}.tex")

    with open(tex_filepath, "w") as f:
        f.write(tex_content)

    if output_format == "tex":
        return send_file(tex_filepath, as_attachment=True, download_name="resume.tex")


    try:
        result = subprocess.run(
            [
                "pdflatex",
                "-interaction=nonstopmode",
                "-output-directory",
                resume_dir,
                tex_filepath,
            ],
            capture_output=True,
            text=True,
            timeout=20,
        )

        pdf_filepath = os.path.join(resume_dir, f"{base_filename}.pdf")

        if result.returncode != 0 or not os.path.exists(pdf_filepath):
            flash("PDF generation failed. Downloading the .tex file instead.")
            return send_file(tex_filepath, as_attachment=True, download_name="resume.tex")

        return send_file(pdf_filepath, as_attachment=True, download_name="resume.pdf")

    except subprocess.TimeoutExpired:
        flash("PDF generation timed out. Downloading the .tex file instead.")
        return send_file(tex_filepath, as_attachment=True, download_name="resume.tex")


    