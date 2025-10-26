from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit

# ---------- Helper for Wrapped Text ---------- #
def draw_wrapped_text(c, text, x, y, font_name, font_size, max_width, line_height=15):
    """
    Draw text wrapped within max_width.
    Returns new y position after drawing.
    """
    lines = simpleSplit(text, font_name, font_size, max_width)
    for line in lines:
        c.drawString(x, y, line)
        y -= line_height
    return y


# ---------- Section Generators ---------- #

def ExperienceCanvasGenerator(c, y, experiences, width):
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Work Experience")
    y -= 20
    c.setFont("Helvetica", 12)
    max_width = width - 100  # Leave margin on right

    for exp in experiences:
        role = exp.get("role", "")
        company = exp.get("company", "")
        duration = exp.get("duration", "")
        desc_list = exp.get("description", [])

        header_text = f"{role} | {company} | {duration}".strip(" |")
        y = draw_wrapped_text(c, header_text, 70, y, "Helvetica-Bold", 12, max_width)
        y -= 5

        if isinstance(desc_list, list):
            for line in desc_list:
                y = draw_wrapped_text(c, f"● {line}", 90, y, "Helvetica", 12, max_width)
                y -= 5
        elif isinstance(desc_list, str):
            y = draw_wrapped_text(c, desc_list, 90, y, "Helvetica", 12, max_width)
            y -= 5

        y -= 5
    return y - 10


def ProjectCanvasGenerator(c, y, projects, width):
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Projects")
    y -= 20
    c.setFont("Helvetica", 12)
    max_width = width - 100

    for proj in projects:
        title = proj.get("title", "")
        company = proj.get("company", "")
        duration = proj.get("duration", "")
        desc_list = proj.get("description", [])

        header_text = f"{title} | {company} | {duration}".strip(" |")
        y = draw_wrapped_text(c, f"- {header_text}", 70, y, "Helvetica-Bold", 12, max_width)
        y -= 5

        if isinstance(desc_list, list):
            for line in desc_list:
                y = draw_wrapped_text(c, f"● {line}", 90, y, "Helvetica", 12, max_width)
                y -= 5
        elif isinstance(desc_list, str):
            y = draw_wrapped_text(c, desc_list, 90, y, "Helvetica", 12, max_width)
            y -= 5

        y -= 5
    return y - 10


def EducationCanvasGenerator(c, y, education, width):
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Education")
    y -= 25
    c.setFont("Helvetica", 12)

    for edu in education:
        line = (
            f"{edu.get('degree', '')} | {edu.get('institution', '')} | "
            f"{edu.get('graduation', '')} | CGPA: {edu.get('cgpa', '')}"
        )
        text_width = c.stringWidth(line, "Helvetica", 12)
        c.drawString((width - text_width) / 2, y, line)
        y -= 20
    return y - 10


# ---------- Helper for Centered Text ---------- #
def draw_centered_text(c, text, y, font, size, width):
    c.setFont(font, size)
    text_width = c.stringWidth(text, font, size)
    c.drawString((width - text_width) / 2, y, text)


# ---------- Main Resume Generator ---------- #

def generate_resume(data, filename="resume.pdf"):
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4

    # --- Centered Header ---
    draw_centered_text(c, data["name"], height - 50, "Helvetica-Bold", 20, width)
    draw_centered_text(
        c,
        f"{data['title']} | {data['phone']} | {data['email']}",
        height - 70,
        "Helvetica",
        12,
        width,
    )
    draw_centered_text(
        c,
        f"Address: {data['address']}",
        height - 90,
        "Helvetica",
        12,
        width,
    )
    draw_centered_text(
        c,
        " | ".join(data.get("links", [])),
        height - 110,
        "Helvetica",
        12,
        width,
    )

    y = height - 150

    # --- Work Experience ---
    y = ExperienceCanvasGenerator(c, y, data.get("experiences", []), width)

    # --- Projects ---
    y = ProjectCanvasGenerator(c, y, data.get("projects", []), width)

    # --- Education ---
    y = EducationCanvasGenerator(c, y, data.get("education", []), width)

    # --- Skills ---
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Skills")
    y -= 20
    c.setFont("Helvetica", 12)
    max_width = width - 100
    for skill in data.get("skills", []):
        y = draw_wrapped_text(c, f"- {skill}", 70, y, "Helvetica", 12, max_width)
    y -= 10

    # --- Achievements ---
    achievements = data.get("achievements", [])
    if achievements:
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, "Achievements")
        y -= 20
        c.setFont("Helvetica", 12)
        for ach in achievements:
            y = draw_wrapped_text(c, f"- {ach}", 70, y, "Helvetica", 12, max_width)

    c.save()
    print(f"✅ Resume generated successfully: {filename}")


# ---------- Example JSON Input ---------- #
resume_data = {
    "name": "Harshit Singh Bhomawat",
    "title": "Software Engineer",
    "email": "harshitbhomawat@gmail.com",
    "phone": "6264038742",
    "address": "D-230, Deendayal Nagar, Ratlam, (M.P.)",
    "links": ["LinkedIn", "Github", "CodeChef", "LeetCode"],
    "skills": [
        "C++", "Python", "Linux", "Socket Programming", "Multithreading",
        "ZeroMQ", "Django"
    ],
    "education": [
        {
            "degree": "Bachelor of Technology in Computer Science and Engineering",
            "institution": "Acropolis Institute of Technology and Research, Indore, M.P.",
            "graduation": "Graduation: June 2022",
            "cgpa": "8.13"
        }
    ],
    "experiences": [
        {
            "role": "Programmer Analyst",
            "company": "Algowire Trading Technologies Pvt. Ltd",
            "duration": "Oct 2022 – Present",
            "description": [
                "Developed a C++ application on Linux using socket programming, multithreading, ZeroMQ (zmq), system calls, and shared memory for inter-process communication.",
                "Hands-on experience with C# (.NET) in developing Windows desktop applications.",
                "Enhanced performance through efficient multithreading and reduced latency with optimised communication techniques.",
                "Enhanced the architecture by consolidating the main project and modularizing strategy logic into DLLs.",
                "Improved scalability and data sharing using ZeroMQ and shared memory.",
                "Utilised GDB and Git for efficient debugging and code management."
            ]
        }
    ],
    "projects": [
        {
            "title": "Flashcard Generator App",
            "company": "Personal Project",
            "duration": "2023",
            "description": [
                "Built an NLP-powered flashcard generation system using Streamlit and Spacy.",
                "Implemented quiz mode and multiple-choice question functionality."
            ]
        }
    ],
    "achievements": ["GATE CS Rank 200", "Dean's List 2023"]
}

generate_resume(resume_data)


# from reportlab.lib.pagesizes import A4
# from reportlab.pdfgen import canvas

# # ---------- Section Generators ---------- #

# def ExperienceCanvasGenerator(c, y, experiences, width):
#     c.setFont("Helvetica-Bold", 14)
#     c.drawString(50, y, "Work Experience")
#     y -= 20
#     c.setFont("Helvetica", 12)

#     for exp in experiences:
#         role = exp.get("role", "")
#         company = exp.get("company", "")
#         duration = exp.get("duration", "")
#         desc_list = exp.get("description", [])

#         header_parts = [role]
#         if company:
#             header_parts.append(f"| {company}")
#         if duration:
#             header_parts.append(f"| {duration}")
#         header_text = " ".join(header_parts)

#         c.drawString(70, y, header_text)
#         y -= 15

#         if isinstance(desc_list, list):
#             for line in desc_list:
#                 c.drawString(90, y, f"● {line}")
#                 y -= 15
#         elif isinstance(desc_list, str):
#             c.drawString(90, y, desc_list)
#             y -= 15

#         y -= 10
#     return y - 10


# def ProjectCanvasGenerator(c, y, projects):
#     c.setFont("Helvetica-Bold", 14)
#     c.drawString(50, y, "Projects")
#     y -= 20
#     c.setFont("Helvetica", 12)

#     for proj in projects:
#         title = proj.get("title", "Untitled Project")
#         company = proj.get("company", "")
#         duration = proj.get("duration", "")
#         desc_list = proj.get("description", [])

#         header_parts = [title]
#         if company:
#             header_parts.append(f"| {company}")
#         if duration:
#             header_parts.append(f"| {duration}")
#         header_text = " ".join(header_parts)

#         c.drawString(70, y, f"- {header_text}")
#         y -= 15

#         if isinstance(desc_list, list):
#             for line in desc_list:
#                 c.drawString(90, y, f"● {line}")
#                 y -= 15
#         elif isinstance(desc_list, str):
#             c.drawString(90, y, desc_list)
#             y -= 15

#         y -= 10
#     return y - 10


# def EducationCanvasGenerator(c, y, education):
#     c.setFont("Helvetica-Bold", 14)
#     c.drawString(50, y, "Education")
#     y -= 20
#     c.setFont("Helvetica", 12)
#     for edu in education:
#         degree = edu.get("degree", "")
#         inst = edu.get("institution", "")
#         graduation = edu.get("graduation", "")
#         cgpa = edu.get("cgpa", "")
#         c.drawString(70, y, f"{degree}|{inst}|Graduation: {graduation}|CGPA: {cgpa}")
#         y -= 15
#         # if details:
#         #     c.drawString(90, y, details)
#         #     y -= 20
#     return y - 10


# # ---------- Helper for Centered Text ---------- #
# def draw_centered_text(c, text, y, font, size, width):
#     c.setFont(font, size)
#     text_width = c.stringWidth(text, font, size)
#     c.drawString((width - text_width) / 2, y, text)


# # ---------- Main Resume Generator ---------- #

# def generate_resume(data, filename="resume.pdf"):
#     c = canvas.Canvas(filename, pagesize=A4)
#     width, height = A4

#     # --- Centered Header ---
#     draw_centered_text(c, data["name"], height - 50, "Helvetica-Bold", 20, width)
#     draw_centered_text(
#         c,
#         f"{data['title']} | {data['phone']} | {data['email']}",
#         height - 70,
#         "Helvetica",
#         12,
#         width,
#     )
#     draw_centered_text(
#         c,
#         f"Address: {data['address']}",
#         height - 90,
#         "Helvetica",
#         12,
#         width,
#     )
#     draw_centered_text(
#         c,
#         " | ".join(data.get("links", [])),
#         height - 110,
#         "Helvetica",
#         12,
#         width,
#     )

#     y = height - 150

#     # --- Work Experience ---
#     y = ExperienceCanvasGenerator(c, y, data.get("experiences", []), width)

#     # --- Projects ---
#     y = ProjectCanvasGenerator(c, y, data.get("projects", []))

#     # --- Education ---
#     y = EducationCanvasGenerator(c, y, data.get("education", []))

#     # --- Skills ---
#     c.setFont("Helvetica-Bold", 14)
#     c.drawString(50, y, "Skills")
#     y -= 20
#     c.setFont("Helvetica", 12)
#     for skill in data.get("skills", []):
#         c.drawString(70, y, f"- {skill}")
#         y -= 15
#     y -= 10

#     # --- Achievements ---
#     achievements = data.get("achievements", [])
#     if achievements:
#         c.setFont("Helvetica-Bold", 14)
#         c.drawString(50, y, "Achievements")
#         y -= 20
#         c.setFont("Helvetica", 12)
#         for ach in achievements:
#             c.drawString(70, y, f"- {ach}")
#             y -= 15

#     c.save()
#     print(f"✅ Resume generated: {filename}")


# # ---------- Example JSON Input ---------- #
# resume_data = {
#     "name": "Harshit Singh Bhomawat",
#     "title": "Software Engineer",
#     "email": "harshitbhomawat@gmail.com",
#     "phone": "6264038742",
#     "address": "D-230, Deendayal Nagar, Ratlam, (M.P.)",
#     "links": ["LinkedIn", "Github", "CodeChef", "LeetCode"],
#     "skills": [
#         "C++", "Python", "Linux", "Socket Programming", "Multithreading",
#         "ZeroMQ", "Django"
#     ],
#     "education": [
#         {"degree": "B.Tech CSE", "institution": "IIT Bombay", "graduation": "2020-2024", "cgpa": "9.13" }
#     ],
#     "experiences": [
#         {
#             "role": "Programmer Analyst",
#             "company": "Algowire Trading Technologies Pvt. Ltd",
#             "duration": "Oct 2022 – Present",
#             "description": [
#                 "Developed a C++ application on Linux using socket programming, multithreading, ZeroMQ (zmq), system calls, and shared memory for inter-process communication.",
#                 "Hands-on experience with C#(.NET) in developing Windows desktop applications.",
#                 "Enhanced performance through efficient multithreading and reduced latency with optimised communication techniques.",
#                 "Enhanced the architecture by consolidating the main project and modularizing strategy logic into DLLs.",
#                 "Improved scalability and data sharing using ZeroMQ and shared memory.",
#                 "Utilised GDB and Git for efficient debugging and code management."
#             ]
#         }
#     ],
#     "projects": [
#         {
#             "title": "Flashcard Generator App",
#             "company": "Personal Project",
#             "duration": "2023",
#             "description": [
#                 "Built an NLP-powered flashcard generation system using Streamlit and Spacy.",
#                 "Implemented quiz mode and multiple-choice question functionality."
#             ]
#         }
#     ],
#     "achievements": ["GATE CS Rank 200", "Dean's List 2023"]
# }

# generate_resume(resume_data)