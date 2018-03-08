def single(gi):
    return {
        "GameInstanceId" : str(gi["_id"]),
        "user1" : str(gi["user1"]),
        "user2" : str(gi["user2"]),
        "cstate" : gi["cstate"],
        "status" : gi["status"],
        "next_player" : str(gi["next_player"]),
        "winner" : gi["winner"]
    }


def multiple(gi_objects):
    return [single(gi) for gi in gi_objects]
