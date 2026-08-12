import os
import uuid

from flask import session, request, redirect, url_for, flash, send_file

from app import app
from routes.decorators import login_required
from repo.profile import is_profile_complete
from repo.users import get_user_by_id
from resume.generate import generate_resume_text

@app.route("/resume", methods=["POST"])
@login_required
def generate_resume():
    user_id = session["user_id"]

    if not is_profile_complete(user_id):
        flash("Please complete your profile before generating a resume.")
        return redirect(url_for("profile"))


    job_skills_raw = request.form.get("job_skills", "")
    job_skills = []

    for skill in job_skills_raw.split(","):
        skill = skill.strip()

        if skill:
            job_skills.append(skill)

    user = get_user_by_id(user_id)
    name = user["name"]

    tex_content = generate_resume_text(user_id, job_skills, name)

    os.makedirs("generated_resumes", exist_ok=True)

    unique_id = uuid.uuid4().hex[:8]
    filename = f"resume_{user_id}_{unique_id}.tex"

    filepath = os.path.join("generated_resumes", filename)

    with open(filepath, "w") as f:
        f.write(tex_content)

    return send_file(filepath, as_attachment=True, download_name="resume.tex")