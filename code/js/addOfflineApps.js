
$(document).ready(function() {


/*Calculator Modal Add*/

	var modal = '<div class="modal fade" id="myModal" role="dialog" style="left: 17%;"><div class="modal-dialog ">';
	var modal_content= '<div class="modal-content" style="display: block;"><div class="modal-header"><h4 class="modal-title">Calculator</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div>';
	var modal_body = ' <div class="modal-body" id="calculator"><div class="top"><span class="clear">C</span><div class="screen" id="result"></div></div>';
	var keys  = '<div class="keys"><span class="press_btn">7</span><span class="press_btn">8</span><span class="press_btn press_btn">9</span><span class="operator press_btn">+</span><span class="press_btn">4</span><span class="press_btn">5</span><span class="press_btn">6</span><span class="operator press_btn">-</span><span class="press_btn">1</span><span class="press_btn">2</span><span class="press_btn">3</span><span class="operator press_btn">/</span><span class="press_btn">0</span><span class="press_btn">.</span><span class="operator press_btn">*</span><span class="operator press_btn">^</span><span class="eval" id="calculate" >=</span></div>';
	var end_divs = '</div></div></div></div>';

	$('#calculator_modal').append(modal+modal_content+modal_body+keys+end_divs);

/* StopWatch Modal Add */

	var modal2 ='<div class="modal fade" id="myModal2" role="dialog" style="left: 17%;"><div class="modal-dialog ">';
	var modal_content2 = ' <div class="modal-content"><div class="modal-header"><h4 class="modal-title">Stopwatch</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div><div class="modal-body" id="stopwatch"><div style="text-align: center;"><p><span id="seconds">00</span><span style="font-size: 2em;"> : </span> <span id="tens">00</span></p><button id="button-start" class="stopW_btn">Start</button><button id="button-stop" class="stopW_btn">Stop</button><button id="button-reset" class="stopW_btn">Reset</button></div></div></div></div></div>';
    
    $('#stopwatch_modal').append(modal2 + modal_content2); 



/* Time Zone Converter Modal Add */


	var modal3 = '<div class="modal fade" id="myModal3" role="dialog" style="left: 17%;"><div class="modal-dialog ">';
	var modal_content3 = '<div class="modal-content">';
	var modal_header3 = '<div class="modal-header"><h4 class="modal-title">Time Zone Converter</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div>';
	var modal_body3 = '<div class="modal-body row" id="timeZone_converter">';
	var row_start = '<div class="row" style="margin: 5px;">';
	var modal_class1 = '<div class="col-sm-6" style="text-align: center;"><input id="h1" type="number" name="hour1" min="0" max="23" value="00"></input><span>:</span><input id="m1" type="number" name="min1" min="0" max="59" value="00"><br><br><div class="dropdown"  id="myDropdown"><button class="btn dropdown-toggle " type="button" data-toggle="dropdown" id="drop_button">Time Zone 1<span class="caret"></span></button><ul class="dropdown-menu TimeZoneNames pre-scrollable"><input type="text" placeholder="Search.." id="myInput" ></ul></div></div>';
	var modal_class2 = '<div class="col-sm-6" style="text-align: center;"><label id="h2">00</label><span>:</span><label id="m2">00</label><br><br>';
	var row_stop ='</div>'
	var modal_class3 = '<div class="dropdown" id="myDropdown2"><button class="btn dropdown-toggle " type="button" data-toggle="dropdown" id="drop_button2">Time Zone 2<span class="caret"></span></button><ul class="dropdown-menu TimeZoneNames2 pre-scrollable"><input type="text" placeholder="Search.." id="myInput2" ></ul></div></div><br><br><br></div><button class="btn tzconvert">Convert</button></div></div></div>';

	$('#timeZone_converter_modal').append(modal3 + modal_content3 + modal_header3 +row_start+ modal_class1 +modal_class2 +modal_class3+row_stop);



});