var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$http,$interval) {
    // Calling this function after clicking on login button
    $scope.login = function() {

    	var email = $scope.email;
    	var password = $scope.password;

    	var data = {}
    	data["email"] = email;
    	data["password"] = password;
    	
      var url = 'http://127.0.0.1:5000/uservalidation',config='application/x-www-form-urlencoded';
    	$http.post(url, data, config).then(function (response) {
    	// This function handles success
    	window.location = "userValidation.html"
      setCookie("userEmail", email, 3)
      setCookie("token", response["data"]["response"]["token"], 3)

    	//console.log(response["data"]["response"]["token"]);
    }, function (response) {
   	// this function handles error
   	console.log("invalid username or password");
   });
   }
   $scope.goto_signup = function(){window.location = "signup.html"}
   $scope.test = function(){console.log();}
   // function to request another user
   $scope.request= function()
   {
      var email = $scope.email;
      var data = {}
      data["email"] = email;
      var token = getCookie("token")

      var url = 'http://127.0.0.1:5000/gameinstance?token='+ token ,config='application/x-www-form-urlencoded';
      $http.post(url, data, config).then(function (response) {
      // This function handles success
      console.log("Done");

      },function (response) {
    // this function handles error
    console.log("invalid");
   });

   }
   
   $scope.signup = function()
   {
   ///////////////// INCOMPLETE ///////////////
      var username = $scope.username;
      var password = $scope.password;
      var alias = $scope.alias;
      var email = $scope.email;

      var data = {}
      data["email"] = email;
      data["password"] = password;
      data["alias"] = alias;
      data["username"] = username;
      
      var url = 'http://127.0.0.1:5000/user',config='application/x-www-form-urlencoded';
      $http.post(url, data, config).then(function (response) {
      // This function handles success
      window.location = "index.html"
      //console.log(response);
    }, function (response) {
    // this function handles error
    console.log("invalid username or password");
   }); 
      //console.log(data);
   }



   try{/*switch_player();*/}catch(e){console.log("innerHtml Error ignored");}

   // function to load all pending instances
  
  var get_pending_requests = function()
  {
    $scope.curr_user = getCookie("userEmail")

    var data = {}
    var token = getCookie("token")

    var url = 'http://127.0.0.1:5000/gameinstance?token='+ token ,config='application/x-www-form-urlencoded';
    $http.get(url, data, config).then(function (response) {
      // This function handles success
      //console.log(response)
      
      $scope.requests = response["data"]["response"]["pending"];
      $scope.game_in_action = response["data"]["response"]["inaction"];
      $scope.completed_game = response["data"]["response"]["completed"];

      },function (response) {
    // this function handles error
      console.log(response)

    //console.log("invalid");
   });

  }

  $scope.get_pending_requests_interval = function(){
    $interval(get_pending_requests, 1000, 0);
  }

  // function to accept user pending request
  $scope.accept_user = function(user)
  {
    var data = {}
    console.log(user);
    data["userid"] = user;
    var token = getCookie("token")

    var url = 'http://127.0.0.1:5000/gameinstance?token='+ token ,config='application/x-www-form-urlencoded';
    $http.put(url, data, config).then(function (response) {
      // This function handles success
      //console.log(response["data"]["response"]["pending"]);
      var game_instance = response["data"]["response"]["GameInstanceId"]; 
      setCookie("gi",game_instance);
      $scope.play(game_instance);

      },function (response) {
      // this function handles error
      console.log(response)
      console.log(response["data"]);
    //console.log("invalid");
   });
  }

  $scope.start_ttt = function()
  {
      $scope.curr_user = getCookie("userEmail")
      var json = getCookie("box_values_to_start");
      json = JSON.parse(json);
      //console.log(json);
      if(json["1"]){document.getElementById('1').value = json["1"];}
      if(json["2"]){document.getElementById('2').value = json["2"];}
      if(json["3"]){document.getElementById('3').value = json["3"];}
      if(json["4"]){document.getElementById('4').value = json["4"];}
      if(json["5"]){document.getElementById('5').value = json["5"];}
      if(json["6"]){document.getElementById('6').value = json["6"];}
      if(json["7"]){document.getElementById('7').value = json["7"];}
      if(json["8"]){document.getElementById('8').value = json["8"];}
      if(json["9"]){document.getElementById('9').value = json["9"];}
      
      var gameInstanceId = getCookie("gi");
      var data = {}
      data["game_instance"] = gameInstanceId;
      //console.log(data["game_instance"]);
    
      var token = getCookie("token")
      var url = 'http://127.0.0.1:5000/move?token='+token + "&game_instance=" + gameInstanceId ,config='application/x-www-form-urlencoded';
      $http.get(url, data, config).then(function (response) {
      //console.log(response["data"]["response"])
      setCookie("gi", gameInstanceId, 3)
      setCookie("box_values_to_start", JSON.stringify(list_of_list_to_json(response["data"]["response"]["cstate"])), 3)

      var is_winner = response["data"]["response"]["winner"]; 
      if(is_winner!=null){$scope.winner_name = is_winner;}
      setCookie("letter", response["data"]["response"]["letter"] , 3)
      },function (response) {
      //console.log(response)
      console.log("Not Allowd");
   });

  }
  $scope.refresh_ttt = function()
  {
    $interval($scope.start_ttt, 1000, 0);
  }

  $scope.play = function(gameInstanceId)
  {
    var data = {}
    data["game_instance"] = gameInstanceId;
    
    //console.log(data["game_instance"]);
    
    var token = getCookie("token")
    var url = 'http://127.0.0.1:5000/move?token='+token + "&game_instance=" + gameInstanceId ,config='application/x-www-form-urlencoded';
    $http.get(url, data, config).then(function (response) {
      //console.log(response["data"]["response"])
      setCookie("gi", gameInstanceId, 3)
      setCookie("box_values_to_start", JSON.stringify(list_of_list_to_json(response["data"]["response"]["cstate"])), 3)
      setCookie("letter", response["data"]["response"]["letter"] , 3)
      window.location = "html/tictactoe.html"
      // This function handles success
      //console.log(response["data"]["response"]["pending"]);
      },function (response) {
      // this function handles error
      //console.log(response)
      console.log("Not Allowd");

    //console.log("invalid");
   });


  }


  $scope.reset = function(){reset_game();}

   $scope.box_1_clicked = function(){clicked_box("1",$http);}
   $scope.box_2_clicked = function(){clicked_box("2",$http);}
   $scope.box_3_clicked = function(){clicked_box("3",$http);}
   $scope.box_4_clicked = function(){clicked_box("4",$http);}
   $scope.box_5_clicked = function(){clicked_box("5",$http);}
   $scope.box_6_clicked = function(){clicked_box("6",$http);}
   $scope.box_7_clicked = function(){clicked_box("7",$http);}
   $scope.box_8_clicked = function(){clicked_box("8",$http);}
   $scope.box_9_clicked = function(){clicked_box("9",$http);}
});