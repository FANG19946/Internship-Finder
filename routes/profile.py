from flask import session, render_template, request, redirect, url_for

from app import app
from routes.decorators import login_required

from repo.profile import (
    get_full_profile,
    add_achievement,
    add_education,
    add_experience,
    add_project
)

from repo.users import add_user_skill

@app.route("/profile")
@login_required
def profile():
    user_id = session["user_id"]

    profile = get_full_profile(user_id)

    return render_template("profile.html", profile = profile)


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

    skill = request.form["skill"]

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
