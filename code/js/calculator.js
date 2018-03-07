/*Calculator Logic*/
	

$(document).ready(function() {


function parseCalculationString(s) {
	    // --- Parse a calculation string into an array of numbers and operators
	   
	    var calculation = [],
	        current = '';
	    for (var i = 0, ch; ch = s.charAt(i); i++) {
	        if ('^*/+-'.indexOf(ch) > -1) {
	            if (current == '' && ch == '-') {
	                current = '-';
	            } else {
	                calculation.push(parseFloat(current), ch);
	                current = '';
	            }
	        } else {
	            current += s.charAt(i);
	        }
	    }
	    if (current != '') {
	        calculation.push(parseFloat(current));
	    }
	    return calculation;
	}

	function calculate(calc) {
	    // --- Perform a calculation expressed as an array of operators and numbers
	    var ops = [{'^': (a, b) => Math.pow(a, b)},
	               {'*': (a, b) => a * b, '/': (a, b) => a / b},
	               {'+': (a, b) => a + b, '-': (a, b) => a - b}],
	        newCalc = [],
	        currentOp;
	    for (var i = 0; i < ops.length; i++) {
	        for (var j = 0; j < calc.length; j++) {
	            if (ops[i][calc[j]]) {
	                currentOp = ops[i][calc[j]];
	            } else if (currentOp) {
	                newCalc[newCalc.length - 1] = 
	                    currentOp(newCalc[newCalc.length - 1], calc[j]);
	                currentOp = null;
	            } else {
	                newCalc.push(calc[j]);
	            }
	        }
	        calc = newCalc;
	        newCalc = [];
	    }
	    if (calc.length > 1) {
	        console.log('Error: unable to resolve calculation');
	        return calc;
	    } else {
	        return calc[0];
	    }
	}


	var calculateButton = document.getElementById('calculate');
	var userInput = "";
    var result = document.getElementById('result');

	$(function() {
		$(".press_btn").click(function(){
			userInput+= this.innerHTML;
			result.innerHTML =userInput;
		});    
	});


	$(function() {
		$(".clear").click(function(){
			userInput= "";
			result.innerHTML =userInput;
		});
	}); 

	calculateButton.addEventListener('click', function() {	
		userInput = calculate(parseCalculationString(userInput));
	    result.innerHTML = userInput;
	});

});
