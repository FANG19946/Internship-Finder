import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection

def create_user(name, email, password, contact):
    con = get_connection()
    cursor  = con.cursor()

    #hash password
    password_hash = generate_password_hash(password)

    try:
        cursor.execute(
            """
            INSERT INTO users (name, email, password_hash, contact)
            VALUES (?, ?, ?, ?)
            """,
            (name, email, password_hash, contact)
        )

        con.commit()

        user_id = cursor.lastrowid
        con.close()

        return user_id

    except sqlite3.IntegrityError:
        #email already exists
        con.close()
        return None

def verify_password(plain_password, password_hash):
    return check_password_hash(password_hash, plain_password)


#--------------GET FUNCTIONS--------------

def get_user_by_email(email):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = ?""",
        (email,)
    )

    row = cursor.fetchone()
    con.close()

    return row

def get_user_by_id(user_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE user_id = ?""",
        (user_id,)
    )

    row = cursor.fetchone()
    con.close()

    return row

def get_user_skill_count(user_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM user_skills
        WHERE user_id = ?
        """,
        (user_id, )
    )

    user_skill_cnt = cursor.fetchone()[0]
    con.close()

    return user_skill_cnt

def get_user_skills(user_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT skill_id, skill
        FROM user_skills
        WHERE user_id = ?
        """,
        (user_id,)
    )

    rows = cursor.fetchall()
    con.close()

    return rows


#--------------ADD FUNCTIONS--------------

def add_user_skill(user_id, skill):
    con = get_connection()
    cursor = con.cursor()

    #normalize
    skill = skill.strip().lower()

    try:
        cursor.execute(
            """
            INSERT INTO user_skills(user_id, skill)
            VALUES(?, ?)
            """,
            (user_id, skill)
        )

        con.commit()
        con.close()

        return True

    except sqlite3.IntegrityError:
        con.close()
        return None


#--------------DELETE FUNCTIONS--------------

def delete_user_skill(user_id, skill_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        DELETE FROM user_skills
        WHERE skill_id = ? AND user_id = ?
        """,
        (skill_id, user_id)
    )

    con.commit()
    con.close()