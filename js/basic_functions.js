/* this function changing values of boxes
 send json of notations like 
{
	1:"X",
	2:"0",
	5:"X"
}
*/
function change_values(json)
{
	if(json["1"]){document.getElementById('1').value = json["1"];}
	if(json["2"]){document.getElementById('2').value = json["2"];}
	if(json["3"]){document.getElementById('3').value = json["3"];}
	if(json["4"]){document.getElementById('4').value = json["4"];}
	if(json["5"]){document.getElementById('5').value = json["5"];}
	if(json["6"]){document.getElementById('6').value = json["6"];}
	if(json["7"]){document.getElementById('7').value = json["7"];}
	if(json["8"]){document.getElementById('8').value = json["8"];}
	if(json["9"]){document.getElementById('9').value = json["9"];}
}


function start_ttt()
{
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
}



/* function will return json of current values of all boxes */
function get_current_values()
{
	json = {}
	var _1 = document.getElementById('1').value;
	var _2 = document.getElementById('2').value;
	var _3 = document.getElementById('3').value;
	var _4 = document.getElementById('4').value;
	var _5 = document.getElementById('5').value;
	var _6 = document.getElementById('6').value;
	var _7 = document.getElementById('7').value;
	var _8 = document.getElementById('8').value;
	var _9 = document.getElementById('9').value;
	
	if(_1 != " "){json["1"] = _1;}
	if(_2 != " "){json["2"] = _2;}
	if(_3 != " "){json["3"] = _3;}
	if(_4 != " "){json["4"] = _4;}
	if(_5 != " "){json["5"] = _5;}
	if(_6 != " "){json["6"] = _6;}
	if(_7 != " "){json["7"] = _7;}
	if(_8 != " "){json["8"] = _8;}
	if(_9 != " "){json["9"] = _9;}

	return json;
}

/*
function switch_player()
{
	return;
	//console.log(player);
	if(player == "X")
		{
			player = "O";
			document.getElementById('current_player').innerHTML = player;
		}
	else
		{	
			player = "X";
			document.getElementById('current_player').innerHTML = player;
		}
}
*/

function clicked_box(box_number,x)
{

	var row_column = get_row_column(box_number);

	var data = {}
	data["row"] = row_column[0];
	data["column"] = row_column[1];
	data["game_instance"] = getCookie("gi")
    
    var token = getCookie("token")

    //console.log(data);
    var url = 'http://127.0.0.1:5000/move?token='+ token ,config='application/x-www-form-urlencoded';
    x.post(url, data, config).then(function (response) {
      // This function handles success
      document.getElementById(box_number).value = getCookie("letter");
      var is_winner =response["data"]["response"]["winner"]; 
      if(is_winner!=null){$scope.winner_name = is_winner}
      console.log(response["data"]["response"]);
      //document.getElementById(box_number).style.pointerEvents = "none";
      //console.log(response);

  },function (response) {
    // this function handles error
      //console.log(response);

    //console.log(response);
    alert(response["data"]["response"]);
   });
}

function reset_game() {
	document.getElementById('1').value = " ";document.getElementById("1").style.pointerEvents = "";
	document.getElementById('2').value = " ";document.getElementById("2").style.pointerEvents = "";
	document.getElementById('3').value = " ";document.getElementById("3").style.pointerEvents = "";
	document.getElementById('4').value = " ";document.getElementById("4").style.pointerEvents = "";
	document.getElementById('5').value = " ";document.getElementById("5").style.pointerEvents = "";
	document.getElementById('6').value = " ";document.getElementById("6").style.pointerEvents = "";
	document.getElementById('7').value = " ";document.getElementById("7").style.pointerEvents = "";
	document.getElementById('8').value = " ";document.getElementById("8").style.pointerEvents = "";
	document.getElementById('9').value = " ";document.getElementById("9").style.pointerEvents = "";
}

function winner(winner_name)
{
	//switch_player();

	alert(winner_name + " won");
	disable_matrix()
	//reset_game();
}




function deleteAllCookies() {
		var cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
}





function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
						c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
						return c.substring(name.length, c.length);
				}
		}
		return "";
}


function disable_matrix()
{
	document.getElementById("1").style.pointerEvents = "none";
	document.getElementById("2").style.pointerEvents = "none";
	document.getElementById("3").style.pointerEvents = "none";
	document.getElementById("4").style.pointerEvents = "none";
	document.getElementById("5").style.pointerEvents = "none";
	document.getElementById("6").style.pointerEvents = "none";
	document.getElementById("7").style.pointerEvents = "none";
	document.getElementById("8").style.pointerEvents = "none";
	document.getElementById("9").style.pointerEvents = "none";
}




function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function get_row_column(digit)
{
	if(parseInt(digit) < 4){return [1,parseInt(digit)]}
	if(parseInt(digit) < 7){return [2,parseInt(digit)-3]}
	if(parseInt(digit) < 10){return [3,parseInt(digit)-6]}
}



function list_of_list_to_json(list)
{
	//console.log(list);
	var json = {}
	var plain_list = list[0].concat(list[1] ,list[2]);
	
	//for (var i = 0; i < list.length ; i++) {
		//plain_list.concat(list[i]);
	//	plain_list+=list[i];
	//	console.log(list[i]);
	//}
	//console.log("plain",plain_list);
	for (var i = 0; i <= plain_list.length; i++)
	{
		if(plain_list[i]!=null)
		{
			json[(i+1)+""] = plain_list[i]
		}
	}

	//console.log("list_of_list_to_json",json);
	//console.log(json);
	return json;
}