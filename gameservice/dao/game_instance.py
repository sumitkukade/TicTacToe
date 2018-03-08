from pymongo import MongoClient
from bson import ObjectId
from utils import constants as gconst

client = MongoClient()
db = client.game_engine

ginstancecltn = db.game_instance

def create_game_instance(user1_obj_id, user2_obj_id):
    instance_object = {
        "user1" : user1_obj_id,
        "user2" : user2_obj_id,
        "cstate" : gconst.default_state,
        "status" : gconst.default_start_status,
        "next_player" : user1_obj_id,
        "winner" : None
    }
    gi = ginstancecltn.insert_one(instance_object)
    return gi.inserted_id

def get_completed_game_instances(user_id):
    return ginstancecltn.find({"$or": [{"status":"COMPLETED" ,"user1":ObjectId(user_id)} ,{"status":"COMPLETED" ,"user2":ObjectId(user_id)},]})
    
def get_game_invitations_to_user(user_id):
    return ginstancecltn.find({"status":"REQUESTED" ,"user2":ObjectId(user_id)})

def get_inactive_game_instances(user_id):
    return ginstancecltn.find({"$or": [{"status":"INACTION" ,"user1":ObjectId(user_id)} ,{"status":"INACTION" ,"user2":ObjectId(user_id)},]})

def get_game_instance(game_obj_id):
    return ginstancecltn.find_one({"_id" : game_obj_id})

def get_pending_request(user1 ,user2):
    return ginstancecltn.find_one({"status":"REQUESTED" ,"user1":user1 ,"user2":user2})

def accepted_game_instance(game_obj_id):
    ginstancecltn.update_one(
        {"_id" : game_obj_id},
        {"$set" : { "status" : gconst.accepted_status } })

def make_move(game_obj_id, new_state, next_player, new_status, winner = None):
    print new_state ,game_obj_id
    ginstancecltn.update_one(
        {"_id" : game_obj_id["_id"]},
        {"$set" :
            {  "cstate" : new_state,
               "status" : new_status,
               "next_player" : next_player,
               "winner" : winner
            }
        }
    )
    return get_game_instance(game_obj_id["_id"])
