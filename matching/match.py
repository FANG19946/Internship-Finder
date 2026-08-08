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