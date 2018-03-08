
default_state = [[None,None,None],[None,None,None],[None,None,None]]
default_start_status = "REQUESTED"
accepted_status = "INACTION"
final_status = "COMPLETED"

winning_state = [[(0,0), (0,1) ,(0,2)],
                 [(0,0) ,(1,0) ,(2,0)],
                 [(0,2) ,(1,2) ,(2,2)],
                 [(2,0) ,(2,1) ,(2,2)],
                 [(0,0) ,(1,1) ,(2,2)],
                 [(0,2) ,(1,1) ,(2,0)]
        ]
