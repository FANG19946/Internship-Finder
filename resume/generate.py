from datetime import datetime
from repo.profile import get_achievements_by_userid, get_education_by_userid,get_links_by_userid
from matching.match import select_resume_items
from repo.users import get_user_skills, get_user_by_id

LATEX_SAFE = {
        "\\" : r"\textbackslash{}",
        "&" : r"\&",
        "%" : r"\%",
        "$" : r"\$",
        "#" : r"\#",
        "_" : r"\_",
        "{" : r"\{",
        "}" : r"\}",
        "~" : r"\textasciitilde{}",
        "^" : r"\textasciicircum{}"
    }

#--------HELPER FUNCTIONS FOR FORMATTING--------
def escape_latex(text):
    if text is None:
        return ""
    
    result = ""

    for char in text:
        result += LATEX_SAFE.get(char, char)

    return result

def format_date(date_string):
    if not date_string:
        return "Current"
    
    date = datetime.strptime(date_string, "%Y-%m-%d")
    return date.strftime("%b %Y")

def summary_to_bullets(summary):
    if not summary:
        return ""

    lines = summary.split("\n")

    bullets = ""
    for line in lines:
        line = line.strip()

        if line:
            bullets += f"\\item {escape_latex(line)}\n"

    return f"\\begin{{itemize}}[leftmargin=*, itemsep=1pt, topsep=0pt, parsep=0pt]\n{bullets}\\end{{itemize}}"



#--------SECTION TEXT GENERATER FUNCTIONS--------
def generate_experience_block(experience):
    if not experience:
        return ""

    company = escape_latex(experience["company"])
    role = escape_latex(experience["role"])
    dates = f"{format_date(experience['start_date'])} - {format_date(experience['end_date'])}"
    bullets = summary_to_bullets(experience["summary"])

    return (
        f"\\textbf{{{role}}}, {company} \\hfill {dates}\\\\\n"
        f"{bullets}\n"
    )

def generate_project_block(projects):
    block = ""
    for project in projects:
        title = escape_latex(project["title"])
        date = format_date(project["project_date"])
        skills = escape_latex(", ".join(project["skills"]))
        bullets = summary_to_bullets(project["summary"])

        block += (
            f"\\textbf{{{title}}} \\hfill {date}\\\\\n"
            f"\\textit{{{skills}}}\n"
            f"{bullets}\n\n"
            f"\\vspace{{6pt}}\n"
        )

    return block

def generate_education_block(user_id):
    education = get_education_by_userid(user_id)
    block = ""

    for edu in education:
        institute = escape_latex(edu["institute"])
        degree = escape_latex(edu["degree"])
        dates = f"{format_date(edu['start_date'])} - {format_date(edu['end_date'])}"

        grade = ""

        if edu["grade_value"]:
            grade = f" | {escape_latex(edu['grade_type'])}: {escape_latex(edu['grade_value'])}"

        block += (
            f"\\textbf{{{institute}}} \\hfill {dates}\\\\\n"
            f"\\textit{{{degree}{grade}}}\\\\\n\n"
        )

    return block

def generate_achievements_block(user_id):
    achievements = get_achievements_by_userid(user_id)
    bullets = ""

    for achievement in achievements:
        bullets += f"\\item {escape_latex(achievement['title'])}\n"

    if not bullets:
        return ""

    return f"\\begin{{itemize}}[leftmargin=*, itemsep=2pt, parsep=0pt, topsep=0pt]\n{bullets}\\end{{itemize}}"

def build_contact_line(user_id):
    user = get_user_by_id(user_id)
    links = get_links_by_userid(user_id)

    parts = []

    email = user["email"]
    parts.append(f"\\href{{mailto:{email}}}{{{escape_latex(email)}}}")

    for link in links:
        label = escape_latex(link["label"])
        url = link["url"]

        parts.append(f"\\href{{{url}}}{{{label}}}")

    return " | ".join(parts)



#--------RESUME BUILDER FUNCTIONS--------
def make_section(section, content):
    if not content or not content.strip():
        return ""

    return f"\\section*{{{section}}}\n{content}\n"

def generate_resume_text(user_id, job_skills, name):
    with open("resume/template.tex") as f:
        template = f.read()

    selection = select_resume_items(user_id, job_skills)

    experience_block = generate_experience_block(selection["experience"])
    projects_block = generate_project_block(selection["projects"])
    education_block = generate_education_block(user_id)
    achievements_block = generate_achievements_block(user_id)

    user_skills_rows = get_user_skills(user_id)
    user_skills = []
        
    for row in user_skills_rows:
        user_skills.append(row["skill"])

    skills_line = escape_latex(", ".join(user_skills))

    contact_line = build_contact_line(user_id)

    sections = ""
    sections += make_section("EXPERIENCE", experience_block)
    sections += make_section("PROJECTS", projects_block)
    sections += make_section("EDUCATION", education_block)
    sections += make_section("SKILLS", skills_line)
    sections += make_section("ACHIEVEMENTS", achievements_block)

    tex_content = template.format(
        name = escape_latex(name),
        contact_line = contact_line,
        sections = sections
    )

    return tex_content



