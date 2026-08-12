import sqlite3
from db import get_connection
from repo.users import get_user_skill_count

#--------------GET FUNCTIONS--------------

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

def get_links_by_userid(user_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        SELECT *
        FROM links
        WHERE user_id = ?
        """,
        (user_id,)
    )

    row = cursor.fetchall()
    con.close()

    return row

def get_full_profile(user_id):
    profile = {}
    profile["education"] = get_education_by_userid(user_id)
    profile["experience"] = get_experience_by_userid(user_id)
    profile["projects"] = get_projects_by_userid(user_id)
    profile["achievements"] = get_achievements_by_userid(user_id)
    profile["links"] = get_links_by_userid(user_id)

    return profile

#--------------ADD FUNCTIONS--------------

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
        return project_id

    except sqlite3.IntegrityError:
        con.rollback()
        return None
    
    finally:
        con.close()

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

def add_link(user_id, label, url):
    con = get_connection()
    cursor = con.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO links (user_id, label, url)
            VALUES (?, ?, ?)
            """,
            (user_id, label, url)
        )

        con.commit()

        link_id = cursor.lastrowid
        return link_id

    except sqlite3.IntegrityError:
        con.rollback()
        return None

    finally:
        con.close()


#--------------DELETE FUNCTIONS--------------

def delete_education(user_id, edu_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        DELETE FROM education
        WHERE edu_id = ? AND user_id = ?
        """,
        (edu_id, user_id)
    )

    con.commit()
    con.close()

def delete_experience(user_id, exp_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        DELETE FROM experience
        WHERE exp_id = ? AND user_id = ?
        """,
        (exp_id, user_id)
    )

    con.commit()
    con.close()

def delete_project(user_id, project_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        DELETE FROM projects
        WHERE project_id = ? AND user_id = ?
        """,
        (project_id, user_id)
    )

    con.commit()
    con.close()

def delete_achievement(user_id, ach_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        DELETE FROM achievement
        WHERE ach_id = ? AND user_id = ?
        """,
        (ach_id, user_id)
    )

    con.commit()
    con.close()

def delete_link(user_id, link_id):
    con = get_connection()
    cursor = con.cursor()

    cursor.execute(
        """
        DELETE FROM links
        WHERE link_id = ? AND user_id = ?
        """,
        (link_id, user_id)
    )

    con.commit()
    con.close()


#--------------CHECK FUNCTIONS--------------


def get_missing_profile_sections(user_id):
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

    missing = []

    if education_cnt == 0:
        missing.append("education")

    if projects_cnt == 0:
        missing.append("a project")

    if user_skills_cnt == 0:
        missing.append("skills")

    return missing


def is_profile_complete(user_id):
    return len(get_missing_profile_sections(user_id)) == 0
