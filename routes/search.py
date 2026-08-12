from app import app

from flask import session, request, render_template, redirect, url_for, flash
from routes.decorators import login_required
from repo.profile import is_profile_complete, get_missing_profile_sections
from repo.users import get_user_skills
from scraper.main import run_all
from matching.match import score_skills


@app.route("/search", methods=["GET"])
@login_required
def search():
    user_id = session["user_id"]

    missing = get_missing_profile_sections(user_id)
    
    if missing:
        flash(f"Please add the following before searching: {', '.join(missing)}.")
        return redirect(url_for("profile"))
    
    keyword = request.args.get("keyword")

    if not keyword:
        flash("Please enter a search keyword.")
        return render_template("search.html")
    
    user_skills_rows = get_user_skills(user_id)

    user_skills = []
    
    for row in user_skills_rows:
        user_skills.append(row["skill"])

    jobs = run_all(keyword)

    for job in jobs:
        score, matched = score_skills(user_skills, job["skills"])
        job["score"] = score
        job["matched"] = matched

    jobs.sort(key = lambda job: job["score"], reverse=True)

    return render_template("search.html", jobs=jobs, keyword=keyword)