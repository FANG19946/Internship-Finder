from app import app

from flask import session, request, render_template, redirect, url_for, flash
from routes.decorators import login_required
from repo.profile import is_profile_complete
from repo.users import get_user_skills
from scraper.main import run_all
from matching.match import score_skills


@app.route("/search", methods=["GET"])
@login_required
def search():
    user_id = session["user_id"]

    if not is_profile_complete(user_id):
        flash("Please complete your profile before searching.")
        return redirect(url_for("profile"))

    keyword = request.args.get("keyword")

    if not keyword:
        flash("Please enter a search keyword.")
        return redirect(url_for("search"))
    
    user_skills = get_user_skills(user_id)

    jobs = run_all(keyword)

    for job in jobs:
        score, matched = score_skills(user_skills, job["skills"])
        job["score"] = score
        job["matched"] = matched

    jobs.sort(key = lambda job: job["score"], reverse=True)

    return render_template("search.html", jobs=jobs, keyword=keyword)

    
        