from flask import session, render_template, request, redirect, url_for, flash

from app import app
from routes.decorators import login_required

from repo.profile import (
    get_full_profile,
    add_achievement,
    add_education,
    add_experience,
    add_project,
    add_link,
    delete_education,
    delete_experience,
    delete_project,
    delete_achievement,
    delete_link
)

from repo.users import add_user_skill, get_user_skills, delete_user_skill

@app.route("/profile")
@login_required
def profile():
    user_id = session["user_id"]

    profile = get_full_profile(user_id)
    skills = get_user_skills(user_id)

    return render_template("profile.html", profile = profile, skills = skills)


#-----------ADD ROUTES-----------

@app.route("/profile/education", methods = ["POST"])
@login_required
def add_education_route():
    user_id = session["user_id"]

    institute = request.form["institute"]
    degree = request.form["degree"]
    grade_type = request.form["grade_type"]
    grade_value = request.form["grade_value"]
    start_date = request.form["start_date"]
    end_date = request.form.get("end_date")

    add_education(user_id, institute, degree, grade_type, grade_value, start_date, end_date)

    return redirect(url_for("profile"))


@app.route("/profile/experience", methods=["POST"])
@login_required
def add_experience_route():
    user_id = session["user_id"]

    company = request.form["company"]
    role = request.form["role"]
    summary = request.form["summary"]
    start_date = request.form["start_date"]
    end_date = request.form.get("end_date")

    add_experience(user_id, company, role, summary, start_date, end_date)

    return redirect(url_for("profile"))


@app.route("/profile/achievement", methods=["POST"])
@login_required
def add_achievement_route():
    user_id = session["user_id"]
    
    title = request.form["title"]

    add_achievement(user_id, title)

    return redirect(url_for("profile"))


@app.route("/profile/skill", methods=["POST"])
@login_required
def add_skill_route():
    user_id = session["user_id"]

    skill_input = request.form["skill"]

    for skill in skill_input.split(","):
        skill = skill.strip()

        if skill:
            add_user_skill(user_id, skill)

    return redirect(url_for("profile"))


@app.route("/profile/project", methods=["POST"])
@login_required
def add_project_route():
    user_id = session["user_id"]

    title = request.form["title"]
    summary = request.form["summary"]
    project_date = request.form["project_date"]

    skills = []

    for skill in request.form["skills"].split(","):
        skill = skill.strip()

        if skill:
            skills.append(skill)

    add_project(user_id, title, summary, project_date, skills)

    return redirect(url_for("profile"))


@app.route("/profile/link", methods=["POST"])
@login_required
def add_link_route():
    user_id = session["user_id"]

    label = request.form["label"]

    if label == "__custom__":
        label = request.form.get("label_custom", "").strip()

    url = request.form["url"]

    if not label:
        flash("Please enter a custom label.")
        return redirect(url_for("profile"))

    add_link(user_id, label, url)

    return redirect(url_for("profile"))

#-----------DELETE ROUTES-----------

@app.route("/profile/education/<int:edu_id>/delete", methods=["POST"])
@login_required
def delete_education_route(edu_id):
    user_id = session["user_id"]
    delete_education(user_id, edu_id)

    return redirect(url_for("profile"))


@app.route("/profile/experience/<int:exp_id>/delete", methods=["POST"])
@login_required
def delete_experience_route(exp_id):
    user_id = session["user_id"]
    delete_experience(user_id, exp_id)

    return redirect(url_for("profile"))


@app.route("/profile/project/<int:project_id>/delete", methods=["POST"])
@login_required
def delete_project_route(project_id):
    user_id = session["user_id"]
    delete_project(user_id, project_id)

    return redirect(url_for("profile"))


@app.route("/profile/achievement/<int:ach_id>/delete", methods=["POST"])
@login_required
def delete_achievement_route(ach_id):
    user_id = session["user_id"]
    delete_achievement(user_id, ach_id)

    return redirect(url_for("profile"))


@app.route("/profile/skill/<int:skill_id>/delete", methods=["POST"])
@login_required
def delete_skill_route(skill_id):
    user_id = session["user_id"]
    delete_user_skill(user_id, skill_id)

    return redirect(url_for("profile"))


@app.route("/profile/link/<int:link_id>/delete", methods=["POST"])
@login_required
def delete_link_route(link_id):
    user_id = session["user_id"]
    delete_link(user_id, link_id)
    return redirect(url_for("profile"))