// Copyright (c) 2018 The OpenGenus Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//Tags for easy search  
var tags = ['sort','search','math','string','crypto','data structures','graph','greedy','operating systems','artificial intelligence'];
var favs = [];
var filenames = [];
var bricklayer ;

function AddNewTags (tagName)
{
	/*Function can be used and improved for adding new Tags in the tags array 
	to allow further development (such as suggestions)*/
	tags.push(tagName);
}

var zone_name1='';
var zone_name2='';

function updateFavs(x, filename) {
    x.classList.toggle("checked");	  
	if (chrome && chrome.storage) {
	    chrome.storage.sync.get({favs: []}, function(items) {
		    if (!chrome.runtime.error) {
		      	favs = items.favs;
		      	let found = false;
		      	let index = 0;
		      	for(let i in favs ) {
				    if (favs[i].filename == filename) {
				        found = true;
				        index = i;
				        break;
				    }
				}		
		      	if(found==false) {
		      	    let area = filename.substr(0, filename.indexOf('/')); 
		      	    area = area.replace(/[-\/\\^$*+?.()|[\]{}]/g,'');
					area = area.replace(/_/g, ' ');
					area = area.replace(/\w\S*/g, function(txt) {
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
		      		let lang = filename.split(".").pop();
		      		let f1 = new Object();
		      		f1.filename = filename;
		      		f1.date = moment().format('DD MMM YYYY | HH:mm:ss');
		      		f1.language = lang;
		      		f1.area = area;
			      	favs.push(f1);
			    } else {
			       	// var index = favs.indexOf(filename);
			       	if (index > -1) {
				   		favs.splice(index, 1);
					}	
			    }

			    chrome.storage.sync.set({ favs : favs }, function() {
				    if (chrome.runtime.error) {
				      	console.log("Runtime error.");
				    }
				});
		
		    }
	  	});
	}
}

$(function() {
  $('#search').change(function() {
     $('.bricklayer').empty();
     $('#error-message').empty();
     $('#no_of_results').empty(); 			
 	 dumpBookmarks($('#search').val());
  });
});

$(function() {
	$(document).on("click", ".button-pop", function(){
		$('#front').show();
		$('#no_of_results').show();
		$('.bricklayer').empty();
 		$('#error-message').empty();
 		$('#no_of_results').empty();
		dumpBookmarks($(this).val());
	});
});

var current_fname;
function dumpBookmarks(query) 
{
	var obj =  JSON.parse(localStorage["metadata"]);

	$('#search').val(query);
	$("#front").hide();
	$("#favorites").hide();
	$('.bricklayer').show();			
 	bricklayer = new Bricklayer(document.querySelector('.bricklayer'));


	var found = 0;
	var single_query = query.split(" ");
	var found_word = 0;
	var total=0;

	for(var pos in single_query)
	{
		current_query = single_query[pos];
		if(current_query != "")
		{
			found_word = 1;
			break;
		}
	}

	if(found_word == 1)

	for (var key in obj) 
	{
		var current_found = 0;
		for(var pos in single_query)
		{
			current_query = single_query[pos];
			if(current_query == "")
				continue;

		    if ( current_found == 0 && ((String(key).toLowerCase()).indexOf(current_query.toLowerCase()) != -1)) 
		    {
			    found = 1;
			    current_found = 1;

			    let temp = key;
			    let str = key;
			    let inside_text = '';
			    str = str.split("/").pop();
			    str = str.split('_').join(' ');
				str = str.replace(/\w\S*/g, function(txt) {
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
				temp = temp.replace(/[-\/\\^$*+?.()|[\]{}]/g,'');
				temp = temp.replace(/_/g, '');

			    if(obj[key].length ==1 && ((String(obj[key]).toLowerCase()).indexOf("README.md".toLowerCase()) != -1))
			    	continue;
			    else
			    {
			    	if(chrome && chrome.storage) {
					    chrome.storage.sync.get({favs: []}, function(items) {
						    if (!chrome.runtime.error) {
						      	favs = items.favs;			      
					    	}
				  		});
					}

				    let sub_result_number = 1;
				    total++;

				    for (var dd in obj[key])
				    {
					   	var fname= key+"/"+obj[key][dd];
					   	
					   	temp2 = fname;
					   	temp2 = temp2.replace(/[-\/\\^$*+?.()|[\]{}]/g,'');
					   	temp2 = temp2.replace(/_/g, '');

					   	if(((String(obj[key][dd]).toLowerCase()).indexOf("README.md".toLowerCase()) != -1)){}

					    else
					    {	  	
	
					    	let found_in_Favs = false;
					      	for(let i in favs ) {
							    if (favs[i].filename == fname) {
							        found_in_Favs = true;
							        break;
							    }
							}		

						   	if(found_in_Favs==false) {
						   		inside_text = inside_text + "<a  target='_blank' href='/code/"+key+"/"+obj[key][dd]+"'>"+sub_result_number+". "+obj[key][dd]+"</a>"+"&nbsp;&nbsp;<a style='color:inherit' href='/code/"+key+"/"+obj[key][dd]+"'download><i id='myDownload"+temp2+"\' style='float:right' class='fa fa-download'></i></a><i id='myStar"+temp2+"\' style='float:right;width:8%' class='fa fa-star'></i><br>";
						   	} else {
						   		inside_text = inside_text + "<a  target='_blank' href='/code/"+key+"/"+obj[key][dd]+"'>"+sub_result_number+". "+obj[key][dd]+"</a>"+"&nbsp;&nbsp;<a style='color:inherit' href='/code/"+key+"/"+obj[key][dd]+"'download><i id='myDownload"+temp2+"\' style='float:right' class='fa fa-download'></i></a><i id='myStar"+temp2+"\' style='float:right;width:8%' class='fa fa-star checked'></i><br>";
						   	}
						   	sub_result_number++;
						}
						var send = '#myStar'+temp2;
						$(document).on("click", send , function() {
					   	 	var filename_pos = '#myStar'+this.id.substr(6, this.id.length);
					   	  	updateFavs(this, filenames[filename_pos]);
					    });	
					   
					   
					}

					//Individual Cards

              	    var card = document.createElement('div');
				    card.setAttribute("class", "card");
				    card.setAttribute("style","margin-bottom: 8px");
				    
				    var card_title = document.createElement('div');
				    card_title.setAttribute("class","card-title");
				    card_title.setAttribute("target","_blank");
				    card_title.setAttribute("id","card_title_"+temp);
				    card_title.setAttribute("href","javascript:void(0)");
				    card_title.setAttribute("onmouseover","");
				    card_title.setAttribute("style","cursor: pointer;");
				    card_title.innerHTML = str;

				    var card_body = document.createElement('div');
				    card_body.setAttribute("class","card-body");
				    card_body.setAttribute("id","card_body_"+temp);
				    if (total == 1 || total == 2 || total ==3) {
				    	card_body.setAttribute("style","display: block;");
					} else {
						card_body.setAttribute("style","display: none;");
					}
				    card_body.innerHTML = inside_text;

				    card.appendChild(card_title);
				    card.appendChild(card_body);

				    //Adding Card to Brick Layer
				    bricklayer.append(card);

					document.getElementById("card_title_"+temp).addEventListener('click', function(event){
						if( document.getElementById("card_body_"+temp).style.display == "none" ) {
							document.getElementById("card_body_"+temp).style.display = "block";
						} else {
							document.getElementById("card_body_"+temp).style.display = "none";
						} 
					});				    

				}
			
			}
		}		
	}

	if(total>1)
		res="results";
	else
		res="result";
	if(total!=0)
		$('#no_of_results').append("<ul>"+"<h6>Showing <span style='color: #5D337F'> <b>"+total+" </b></span>"+res+" for   :    <span style='color: #5D337F'><b>'"+query +"'</b></span></h6>"+"</ul>");
		

	if (found == 0 && found_word!=0)
	{
		var happy = "<p style='text-align: center' class=' col-xs-12 col-sm-12 col-md-12 col-lg-12'>We could not find anything interesting for your query. Try something simple like \"sort\".<br>Help us by informing us about your query at <a target='_blank' title='Works offline if email app enabled' href='mailto:team@opengenus.org'>team@opengenus.org</a>. <br>We have something to make you smile:<br></p>";
		happy += '<img id="fact"  src="image/'+(Math.floor(Math.random() * 11) + 1)+'.jpg" alt="Enjoy our daily code fact" style="width:50vw; height:50vh; position: relative; left: 50%; transform: translate(-50%, 0%);"/>'
		 $('#error-message').append(happy);
	}
	else if (found_word == 0)
	{
		var happy = "<p style='text-align: center' class=' col-xs-12 col-sm-12 col-md-12 col-lg-12'>Try a simple search term like \"sort\" <br> We have something to make you smile:<br></p>";
		happy += '<img id="fact" src="image/'+(Math.floor(Math.random() * 11) + 1)+'.jpg" alt="Enjoy our daily code fact" style="width:50vw; height:50vh; position: relative; left: 50%; transform: translate(-50%, 0%);"/>'
		$('#error-message').append(happy);
	}

}

function addtags()
{
	var tags_display_number = 10 ;
	var display_ele = '';
	var style = 'margin: 2px;border-radius: 5px;';
	for (var i =0 ;i<tags_display_number;i++)
	{
		display_ele += '<input type="button" style ="'+style+'"class="btn-xs button-pop btn-warning" value="'+tags[i]+'"/>'
	}

	$('#pop-tags').append(display_ele);
}

//Function To Display Help
function help_show() {
	document.getElementById('search').style.display = "none";
	document.getElementById('help_popup').style.display = "block";
}
//Function to Hide Help
function help_hide() {
	document.getElementById('search').style.display = "block";
	document.getElementById('help_popup').style.display = "none";
}
//Sort Favourites according to key
function sortFav(val)
{
	favs = favs.sort(function (a, b) {
    return a[val].localeCompare( b[val] );
	});
}

function refreshFav()
{
	chrome.storage.sync.set({ favs : favs }, function() {
				    if (chrome.runtime.error) {
				      	console.log("Runtime error.");
				    }
				});
	addFavorites();	
}


//Search using search box
function searchfav(){

		    input = document.getElementById("favSearchInputBox");
		    filter = input.value.toUpperCase();
		    div = document.getElementById("t1");
		    a = div.getElementsByTagName("tr");
		    for (i = 1; i < a.length; i++) {
		        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
		            a[i].style.display = "";
		        } else {
		            a[i].style.display = "none";
		        }
		    }
}

//Add header sorts
$(function() {
	$(document).on("click", ".sortbythis", function(){
		var temp = $(this)[0].attributes.sortby.value;
		sortFav(temp);
		refreshFav();
	});
});




//Add Favorites
function addFavorites()
{
	$('#favorites').empty();
	if (chrome && chrome.storage) {
	    chrome.storage.sync.get({favs: []}, function(items) {
		    if (!chrome.runtime.error) {
		      	favs = items.favs;

				if(favs.length==0) {
					$('#favorites').append("<h1 style='text-align: center;'>Favorites</h1><hr>");
					$('#favorites').append("<p style='text-align: center;'>No favorites yet!</p><p style='text-align: center;'>Click on the star icon beside your favorite codes to access them easily.</p><br><br><br><br><br><br><br><br>");
		
		
				} else {


					$('#favorites').append("<h1 style='text-align: center;'>Favorites</h1><hr><ul class='favList'>");
					$('#favorites').append("<marquee behavior='alternate'>Sort Favourites either by clicking on the column header or Search them by Name/Language/Date/Area using this Search box!</marquee><br><center><input type='text' placeholder='Search Favorites..'' id='favSearchInputBox' ></center><br>");				
						$(function(){
							$("#favSearchInputBox").keyup(function(){				 		
							 		searchfav();
								});
							});
					let table_start = '<table id="t1" class="table table-hover"><thead><tr><th style="text-align: center;" scope="col">Code File</th><th style="text-align: center;" scope="col" class="sortbythis" sortby="language">Language </th><th style="text-align: center;" scope="col" class="sortbythis" sortby="date">Date/Time</th><th style="text-align: center;" scope="col" class="sortbythis" sortby="area">Area</th></tr></thead><tbody>';
				    let table_body = '';
				    let table_end = "</tbody></table></ul><br><br><br><br><br>";
				    for (var fname in favs)
				    {
				    	temp = favs[fname].filename;
					   	temp = temp.replace(/[-\/\\^$*+?.()|[\]{}]/g,'');
					   	temp = temp.replace(/_/g, '');					   
						var str = '#myStar'+temp;
						var filename = favs[fname].filename.replace(/^.*[\\\/]/, '');
						table_body += "<tr><td><ul ><i id='myStar"+temp+"\' class='fa fa-star checked' style='margin-right:20px;'></i><a class='favListItem' target='_blank' href='/code/"+favs[fname].filename+"'>"+((+fname)+(+1))+". "+filename+"&nbsp;&nbsp;</a><br></ul></td>";
						table_body += '<td class="favListItem ">'+favs[fname].language+'</td>';
						table_body += '<td class="favListItem " >'+favs[fname].date+'</td>';
						table_body += '<td class="favListItem " >'+favs[fname].area+'</td></tr>';


				    	$('#myStar'+temp).on("click",function () {						   	
					   	 	var filename_pos = '#myStar'+this.id.substr(6, this.id.length);
					   	  	updateFavs(this, filenames[filename_pos]);
					   	  	

				    	});	

				    }

				    $('#favorites').append(table_start+table_body+table_end);
				}
	    	}
	 	});
	}
}

function initialize() 
{
	for (var key in obj) 
	{
	    for (var dd in obj[key])
		{
		   	var fname= key+"/"+obj[key][dd];
		   	temp = fname;
		   	temp = temp.replace(/[-\/\\^$*+?.()|[\]{}]/g,'');
		   	temp = temp.replace(/_/g, '');
		
			var str = '#myStar'+temp;
		   	filenames[str]=fname;
		}
	}	
}




document.addEventListener('DOMContentLoaded', function () 
{
	document.getElementById('help').addEventListener('click', function(event){
	  help_show();
	});


	document.getElementById('close').addEventListener('click', function(event){
	  help_hide();
	});


	document.getElementById('favButton').addEventListener('click', function(event){
	  	$('#favorites').show();
		$('#front').hide();
		$('#no_of_results').hide();
	  	$('.bricklayer').hide();
 		addFavorites();
	});


	var a = document.getElementById('fact'); 
    a.src = "image/"+(Math.floor(Math.random() * 10) + 1)+".jpg";
    initialize();
    addtags();
});




