from app import app
from flask import request, render_template, session, redirect, url_for
from repo.users import create_user, get_user_by_email, verify_password
from repo.profile import is_profile_complete


@app.route("/register", methods=['GET', 'POST'])
def register():
    if(request.method == 'GET'):
        return render_template("register.html")

    #POST, user submitted registration from
    name = request.form["name"]
    email = request.form["email"]
    password = request.form["password"]
    contact = request.form["contact"]

    user_id = create_user(name, email, password, contact)

    if user_id is None:
        return render_template("register.html", error="Email already registered.")

    session['user_id'] = user_id

    return redirect(url_for("profile"))


@app.route("/login", methods=['GET', 'POST'])
def login():
    if(request.method == 'GET'):
        return render_template("login.html")

    #POST, user entered login details
    email = request.form["email"]
    password = request.form["password"]

    user_info = get_user_by_email(email)

    if user_info is None or not verify_password(password, user_info["password_hash"]):
        return render_template("login.html", error="Invalid Email or Password.")
    
    session['user_id'] = user_info["user_id"]

    return redirect(url_for("profile"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('login'))
