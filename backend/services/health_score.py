def calculate_health_score(
    potholes,
    cracks,
    severe_damages=0
):
    score = 100

    score -= potholes * 5

    score -= cracks * 3

    score -= severe_damages * 10

    score = max(0, min(score, 100))

    if score >= 85:
        status = "Excellent"

    elif score >= 70:
        status = "Good"

    elif score >= 50:
        status = "Fair"

    elif score >= 30:
        status = "Poor"

    else:
        status = "Critical"

    return score, status