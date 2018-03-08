from flask_restful import Resource
from flask import request
from dao.user import get_user_by_id
from dao.game_instance import get_game_instance, make_move
from bson import ObjectId
from dao.session import get_session
from utils import constants as gconst
from views.game_instance import single as single_game_instance

class Move(Resource):

    def get(self):
        params = request.args.to_dict()

        session = get_session(params['token'])
        user_id = session['user']

        if user_id:
            user = get_user_by_id(user_id)
            if not user:
                return {"response" : "User not found"}, 404

        gi = ObjectId(params["game_instance"])
        gi = get_game_instance(gi)
        
        letter = "X"
        if gi["user2"]==user["_id"]:
            letter = "O"

        _winner = None
        if gi["winner"] != None:
            _winner = get_user_by_id(gi["winner"])["alias"]

        return {"response" : {"cstate" : gi["cstate"] ,"letter":letter,"winner":_winner}}
        
    def post(self):
        params = request.args.to_dict()

        session = get_session(params['token'])
        user_id = session['user']

        if user_id:
            user = get_user_by_id(user_id)
            if not user:
                return {"response" : "User not found"}, 404

        payload = request.json
        print payload
        try:
            gi = ObjectId(payload["game_instance"])
            row = int(payload["row"])-1
            col = int(payload["column"])-1
        except:
            return {"response" : "Bad Reqeust"} ,400

        gi = get_game_instance(gi)
        if not gi:
            return {"response" : "Instance for a Game is not found"} ,404

        if gi["next_player"] != user["_id"]:
            return {"response" : "Not Valid Next User"} ,400

        if not set([row,col]).issubset(set(range(len(gi["cstate"])))):
            return {"response" : "Bad Reqeust"} ,400

        if gi["cstate"][row][col]:
            return {"response" : "Cell already occupied"} ,400

        symbol, next_player = "X", gi["user2"]
        if gi["user2"] == user["_id"]:
            symbol, next_player = "O" ,gi["user1"]

        cstate = gi["cstate"]
        cstate[row][col] = symbol

        cordinates = [(rowIndx,colIndx) for rowIndx,rowVal in enumerate(cstate) for colIndx,colVal in enumerate(rowVal) if colVal==symbol ]

        if cordinates in gconst.winning_state:
            gi = make_move(gi, cstate, next_player, gconst.final_status ,str(user["_id"]))
            return {"response" : single_game_instance(gi)}
        gi = make_move(gi, cstate, next_player, gconst.accepted_status)
        return {"response" : single_game_instance(gi)}
