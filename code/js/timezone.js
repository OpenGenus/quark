
		


$(document).ready(function() {



		/*TimeZone converter Logic*/


		function myFunction() {
		    document.getElementById("myDropdown").classList.toggle("show");
		}

		function filterFunction() {
		    var input, filter, ul, li, a, i;
		    input = document.getElementById("myInput");
		    filter = input.value.toUpperCase();
		    div = document.getElementById("myDropdown");
		    a = div.getElementsByTagName("li");
		    for (i = 0; i < a.length; i++) {
		        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
		            a[i].style.display = "";
		        } else {
		            a[i].style.display = "none";
		        }
		    }
		}



		function myFunction2() {
		    document.getElementById("myDropdown2").classList.toggle("show");
		}

		function filterFunction2() {
		    var input, filter, ul, li, a, i;
		    input = document.getElementById("myInput2");
		    filter = input.value.toUpperCase();
		    div = document.getElementById("myDropdown2");
		    a = div.getElementsByTagName("li");
		    for (i = 0; i < a.length; i++) {
		        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
		            a[i].style.display = "";
		        } else {
		            a[i].style.display = "none";
		        }
		    }
		}


		$(function(){
			$(document).on("click", "#myDropdown", function(){
		 		
		 		filterFunction();
			});
			
		});


		$(function(){
			$(document).on("click", "#myDropdown2", function(){
		 		
		 		filterFunction2();
			});
			
		});

		$(function(){
		$("#myInput").keyup(function(){
		 		
		 		filterFunction();

			});
		});

		$(function(){
		$("#myInput2").keyup(function(){
		 		
		 		filterFunction2();

			});
		});



		$(function() {
		var TimeZoneName = moment.tz.names();
			for (i of TimeZoneName)
			{
					$('.TimeZoneNames').append("<li class='tz_name'>"+i+"<li/>");
					$('.TimeZoneNames2').append("<li class='tz_name2'>"+i+"<li/>");
					
			}
		});




		$(function() {
				$(".tz_name").click(function(){
					zone_name1 = this.innerHTML;
					$('#drop_button').text(this.innerHTML.substring(this.innerHTML.lastIndexOf('/') + 1));
					
				});    
			});


		$(function() {
				$(".tz_name2").click(function(){
					zone_name2 = this.innerHTML;
					$('#drop_button2').text(this.innerHTML.substring(this.innerHTML.lastIndexOf('/') + 1));
					
				});    
			});



		$(function() {
				$(".tzconvert").click(function(){

					var zone1 = zone_name1;
					var zone2 = zone_name2;
					var hour1 = $('#h1');
					var min1 = $('#m1');
					
					var h1 =hour1.val();
					var m1 = min1.val();
					
					if(hour1.val()[0]!=0&&hour1.val()<10)
					{
						h1="0"+h1;
					}
					else if(hour1.val()=='0')
					{
						h1="0"+h1;
					}
					if(min1.val()[0]!=0&&min1.val()<10)
					{

						m1="0"+m1;
					}
					else if(min1.val()=='0')
					{
						m1="0"+m1;
					}
					var time = h1+":"+m1;
					var a = moment.tz("2013-11-18 "+time, zone1);
					var b = a.clone().tz(zone2).format();
					var str = b;
					str = str.substring(str.indexOf("T") + 1);
					
					var h2 = str[0]+str[1];
					var m2 = str[3]+str[4];
					$('#h2').text(h2);
					$('#m2').text(m2);


				});    
		});


});