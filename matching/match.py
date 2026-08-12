from repo.profile import get_experience_by_userid, get_projects_by_userid

def score_skills(possessed, required):
    #normalize
    possessed_norm = []
    for skill in possessed:
        possessed_norm.append(skill.strip().lower())

    required_norm = []
    for skill in required:
        required_norm.append(skill.strip().lower())
    
    if len(required_norm) == 0:
        return (0.0, [])

    matched = set(possessed_norm).intersection(set(required_norm))

    score = len(matched)/len(required_norm)

    return ( score, list(matched) )


def select_resume_items(user_id, job_skills):
    experience = get_experience_by_userid(user_id)

    projects = get_projects_by_userid(user_id)

    #selecting most recent experience
    if experience:
        experience = experience[0]


    #score every project
    for project in projects:
        score, matched_skills = score_skills(project["skills"], job_skills)

        project["score"] = score
        project["matched_skills"] = matched_skills

    #sort based on highest score
    projects.sort(key = lambda project : project["score"], reverse=True)


    #Selecttion (3 Projects or 2 projects + 1 experience)
    if experience:
        proj_cnt = 2
    else:
        proj_cnt = 3

    selected_projects = projects[:proj_cnt]

    selected_projects.sort(key=lambda project: project["project_date"], reverse=True)

    return{
        "experience": experience,
        "projects": selected_projects
    }
