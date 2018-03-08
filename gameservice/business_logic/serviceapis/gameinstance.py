from flask_restful import Resource
from bson import ObjectId
from flask import request
from dao.session import get_session
from dao.user import get_user_by_id, get_user_by_mail
from dao.game_instance import create_game_instance, get_pending_request, accepted_game_instance, get_game_invitations_to_user, get_inactive_game_instances,get_completed_game_instances
from views.game_instance import single as single_game_instance ,multiple as multiple_game_instance

def add_buttonValue_to_game_instance(gi,user):
    for obj in gi:
        opposition_user = obj["user1"]
        if ObjectId(obj["user2"]) != user["_id"]:
            opposition_user = obj["user2"]
        user_alias = get_user_by_id(opposition_user)
        obj["buttonValue"] = user_alias["alias"]
    return gi

class GameInstance(Resource):

    def get(self):
        params = request.args.to_dict()

        session = get_session(params['token'])
        user_id = session['user']

        if user_id:
            user = get_user_by_id(user_id)
            if not user:
                return {"response" : "User not found"}, 404

        gi_pending = get_game_invitations_to_user(user_id)
        gi_pending = multiple_game_instance(gi_pending)

        gi_inaction = get_inactive_game_instances(user_id)
        gi_inaction = multiple_game_instance(gi_inaction)

        gi_completed = get_completed_game_instances(user_id)
        gi_completed = multiple_game_instance(gi_completed)
        return {"response" : {"pending" : add_buttonValue_to_game_instance(gi_pending,user),
                             "inaction" : add_buttonValue_to_game_instance(gi_inaction,user),
                             "completed" : add_buttonValue_to_game_instance(gi_completed, user)}}

    def post(self):
        params = request.args.to_dict()

        session = get_session(params['token'])
        user_id = session['user']

        if user_id:
            requesting_user = get_user_by_id(user_id)
            if not requesting_user:
                return {"response" : "User not found"}, 404

        payload = request.json

        try:
            email = payload['email']
        except:
            return {"response" : "Bad request"} , 400

        requested_user = get_user_by_mail(email)
        if not requested_user:
            return {"response" : "Requested User not found"}, 404

        user1, user2 = requesting_user["_id"], requested_user["_id"]

        if get_pending_request(user1 ,user2):
            return {"response" : "Already requested for game instance"}

        gi = create_game_instance(user1, user2)
        return {"response" : str(gi)}

    def put(self):
        params = request.args.to_dict()

        session = get_session(params['token'])
        user_id = session['user']

        if user_id:
            requested_user = get_user_by_id(user_id)
            if not requested_user:
                return {"response" : "User not found"}, 404

        payload = request.json

        try:
            userid = payload["userid"]
        except:
            return {"response" : "Bad request"} , 400

        requesting_user = get_user_by_id(userid)
        if not requesting_user:
            return {"response" : "Requested User not found"}, 404

        user1, user2 = requesting_user["_id"], requested_user["_id"]
        gi = get_pending_request(user1, user2)

        accepted_game_instance(gi["_id"])

        return {"response" : single_game_instance(gi)}
