import sqlite3
from db import get_connection
from repo.users import get_user_skill_count

def add_education(user_id, institute, degree, grade_type, grade_value, start_date, end_date):
    con = get_connection()
    cursor  = con.cursor()

    cursor.execute(
        """
        INSERT INTO education (user_id, institute, degree, grade_type, grade_value, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (user_id, institute, degree, grade_type, grade_value, start_date, end_date)
    )

    con.commit()

    ed_id = cursor.lastrowid
    con.close()

    return ed_id

def get_education_by_userid(user_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT *
        FROM education
        WHERE user_id = ?
        ORDER BY start_date DESC
        """,
        (user_id,)
    )

    row = cursor.fetchall()
    con.close()

    return row

def add_experience(user_id, company, role, summary, start_date, end_date):
    con = get_connection()
    cursor  = con.cursor()

    cursor.execute(
        """
        INSERT INTO experience (user_id, company, role, summary, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (user_id, company, role, summary, start_date, end_date)
    )

    con.commit()

    exp_id = cursor.lastrowid
    con.close()

    return exp_id

def get_experience_by_userid(user_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT *
        FROM experience
        WHERE user_id = ?
        ORDER BY start_date DESC
        """,
        (user_id,)
    )

    row = cursor.fetchall()
    con.close()

    return row

def add_achievement(user_id, title):
    con = get_connection()
    cursor  = con.cursor()

    cursor.execute(
        """
        INSERT INTO achievement (user_id, title)
        VALUES (?, ?)
        """,
        (user_id, title)
    )

    con.commit()

    ach_id = cursor.lastrowid
    con.close()

    return ach_id

def get_achievements_by_userid(user_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT *
        FROM achievement
        WHERE user_id = ?
        """,
        (user_id,)
    )

    row = cursor.fetchall()
    con.close()

    return row


def add_project(user_id, title, summary, project_date, skills):
    con = get_connection()
    cursor = con.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO projects (user_id, title, summary, project_date)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, title, summary, project_date)
        )

        project_id = cursor.lastrowid

        for skill in skills:
            cursor.execute(
                """
                INSERT INTO project_skills (project_id, skill)
                VALUES(?, ?)
                """,
                (project_id, skill)
            )

        con.commit()
        con.close()

        return project_id

    except sqlite3.IntegrityError:
        con.rollback()
        con.close()

        return None


def get_projects_by_userid(user_id):
    con = get_connection()
    cursor = con.cursor()
    
    cursor.execute(
        """
        SELECT *
        FROM projects
        WHERE user_id = ?
        """,
        (user_id,)
    )

    projects = cursor.fetchall()

    result = []

    for project in projects:
        cursor.execute(
            """
            SELECT skill
            FROM project_skills
            WHERE project_id = ?
            """,
            (project['project_id'],)
        )

        skill_rows = cursor.fetchall()

        project_dict = dict(project)

        skills = []
        for row in skill_rows:
            skills.append(row["skill"])

        project_dict["skills"] = skills
        result.append(project_dict)

    con.close()

    return result



def get_full_profile(user_id):
    profile = {}
    profile["education"] = get_education_by_userid(user_id)
    profile["experience"] = get_experience_by_userid(user_id)
    profile["projects"] = get_projects_by_userid(user_id)
    profile["achievements"] = get_achievements_by_userid(user_id)

    return profile

def is_profile_complete(user_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM education
        WHERE user_id = ?
        """,
        (user_id,)
    )
    education_cnt = cursor.fetchone()[0]
    
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM projects
        WHERE user_id = ?
        """,
        (user_id,)
    )
    projects_cnt = cursor.fetchone()[0]

    user_skills_cnt = get_user_skill_count(user_id)

    con.close()
    
    return education_cnt > 0 and projects_cnt > 0 and user_skills_cnt > 0

