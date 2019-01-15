
//Search 
function searchSites(){

	input = document.getElementById("DomainSearch");
	filter = input.value.toUpperCase();
	div = document.getElementById("t2");
	a = div.getElementsByTagName("tr");
	for (i = 1; i < a.length; i++) {
		if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
			a[i].style.display = "";
		} 
		else {
				a[i].style.display = "none";
		}
	}
}

//Does the actual sorting of table rows based on a specific column
function sortTable(flag,n){
	let rows = $('#t2 tbody  tr').get();

	rows.sort(function(a, b) {

		let A = getValue(a);
		let B = getValue(b);

		if(A < B) {
			return -1*flag;
		}
		if(A > B) {
			return 1*flag;
		}
		return 0;
	});

	function getValue(elm){
		let td_val = $(elm).children('td').eq(n).text().toUpperCase();
		//For values of Percentage column
		if (td_val.includes('%')){
			td_val = td_val.replace('%','');
			//donot check if float because it might have integers; so directly parse to float
			td_val = parseFloat(td_val);	
		}
		//For values of S.No. column
		else if(Number(td_val) == td_val && td_val%1 == 0){
			td_val = parseInt(td_val);
		}
		//For values of Date column
		else if(new Date(td_val) != 'Invalid Date'){
			td_val = new Date(td_val);
		}
		return td_val;
	}

	$.each(rows, function(index, row) {
	  $('#t2').children('tbody').append(row);
	});
}

//To clear existing arrows next to Table header names
function clearArrows(){
	$("#t2 thead tr th").each(function() {
		if ($(this)[0].id != ''){
			let header_txt =  $(this).text().toString();
			header_txt = header_txt.split('\t')[0];
			$(this)[0].innerHTML = header_txt;
		}
			
	});
}

//Function of delete button..removes the site from list and adds it to the "deleted_sites" local Storage
//localStorage.removeItem("deleted_sites");
function delete_site(id)
{
    var dels=[];
    if (localStorage.getItem("deleted_sites") !== null)
    {
    	dels=JSON.parse(localStorage.getItem("deleted_sites"));
    }
    var found=false;
    for(var del_site in dels)
    {
    	if(dels[del_site]==id)
    	{
    		found=true;
    		break;
    	}
    }
    if(found==false)
    {dels.push(id);}
    localStorage.setItem("deleted_sites", JSON.stringify(dels));
    location.reload();
}
//function to remove website from deleted_sites
function restore_site(id){
	var obj=JSON.parse(localStorage.getItem("deleted_sites"));
	obj.pop(id);
	localStorage.setItem("deleted_sites", JSON.stringify(obj));
	location.reload();
}

//To add up/down arrow next to Table header names
function addArrows(id, flag){
	clearArrows();
	if(flag == 1){	
		$("#"+id)[0].innerHTML += '\t&#9652;';
	}
	else if(flag == -1){
		$("#"+id)[0].innerHTML += '\t&#9662;';
	}
}


$( document ).ready(function() {
	$("#DomainSearch").keyup(function(){	
		searchSites();
	});
	//To sort "S.No.", "Site Name", "Percentage of Time" and "Last Visited On" columns of Activity table
	let serial_flag = 1;
	let name_flag = 1;
	let percent_flag = 1;
	let date_flag = 1;

	//Click events designated for 4 table headers of Activity table
	$(document).on('click','#serial',function(){
		serial_flag *= -1;
		addArrows("serial", serial_flag);
	    let n = $(this).prevAll().length;
	    sortTable(serial_flag,n);
	});


	$(document).on('click','#name',function(){
		name_flag *= -1;
		addArrows("name", name_flag);
	    let n = $(this).prevAll().length;
	    sortTable(name_flag,n);
	});

	$(document).on('click','#percent',function(){
		percent_flag *= -1;
		addArrows("percent", percent_flag);
	    let n = $(this).prevAll().length;
	    sortTable(percent_flag,n);
	});
	
	$(document).on('click','#date',function(){
		date_flag *= -1;
		addArrows("date", date_flag);
	    let n = $(this).prevAll().length;
	    sortTable(date_flag,n);
	});
	// send id to delete_site function
	$(document).on('click','.delete_button',function(){
		delete_site(this.id);
	});

	//send id to restore_site function
	$(document).on('click','.restore_sites',function(){
		restore_site(this.id);
	});

	//utility to show deleted sites and to restore them
	let end_restore="<div class=\"restore_class\">";
	var clicked_flag_show_restore=false;
	$(document).on('click','#statement_restore',function(){
		var obj=JSON.parse(localStorage.getItem("deleted_sites"));
		if(clicked_flag_show_restore==false)
		{
			if(obj==null||obj.length==0)
			{
				end_restore="<p id=\"no_sites_deleted\">No deleted sites found!</p></div>"
			}
			else
			{
				end_restore+="<ul>";
				for(var x in obj)
				{
					end_restore+="<li class=\"restore_sites\" id=\""+obj[x]+"\">"+"<a href=\"\">"+obj[x]+" (Click to restore)</a></li>";
				}
				end_restore+="</ul></div>";
			}
			$('.body').append(end_restore);
			clicked_flag_show_restore=true;
  			$("html, body").animate({ scrollTop: $(document).height() }, 1000);
				
		}
	});
	
	let current_sites =[];
	chrome.storage.sync.get({sites: []}, function(items) {
		if (!chrome.runtime.error) {
			current_sites = items.sites;                
			if(current_sites.length>0)
			{	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				//$(".form-inline").show();
				let percentage_spent_on_web = '';
				let table_start = '<div class="table-responsive"><table id="t2" class="table table-hover"><thead><tr><th id="serial">S.No.</th><th id="name">Site Name</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th><th id="percent">Percentage of Time</th><th id="date">Last Visited On</th><th id="delete">Delete Site</th></tr></thead><tbody>';
				let table_body = '';
				let table_end = "</tbody></table></div>";
				//combined time taken for all sites
				let overall_time = 0;
				var old_date = new Date(2999, 11, 11)
				for (let site in current_sites)
				{
					//calculating time in seconds
					let site_time_secs = (current_sites[site].days*24*60*60) + (current_sites[site].hrs*60*60) + (current_sites[site].mins*60) + current_sites[site].secs;
					overall_time += site_time_secs;
					var parts = current_sites[site].lastV.split('/');
					var site_date = new Date(parts[2], parts[1], parts[0]); 
					if (site_date < old_date){
						old_date = site_date;
					}
				}
				let obj=JSON.parse(localStorage.getItem('deleted_sites'));
				let ser_num=0;
				for(let site in current_sites)
				{	
					let name = current_sites[site].name;
					let isDeleted=false;
					for(let del in obj)
					{
						if(name==obj[del])
						{
							isDeleted=true;
							break;
						}
					}
					if(isDeleted==false){
						ser_num+=1;
					var parts = current_sites[site].lastV.split('/');
					var site_date = new Date(parts[2], parts[1], parts[0]);
					correct_date = site_date.getDate()+" "+monthNames[parseInt(parts[1])]+" "+site_date.getFullYear();
					let lastV = correct_date;
					let days = current_sites[site].days;
					let hrs = current_sites[site].hrs ;
					let mins = current_sites[site].mins;
					let secs = current_sites[site].secs;
					let site_time_secs = (days*24*60*60) + (hrs*60*60) + (mins*60) + secs;
					//calculating percentage of time spent in each site
					let percent_time = ((site_time_secs/overall_time)*100).toFixed(2).toString()+'%';
					table_body +="<tr><td>"+ser_num+"</td><td>"+name+"</td><td>"+days+"</td><td>"+hrs+"</td><td>"+mins+"</td><td>"+secs+"</td><td>"+percent_time+"</td><td>"+lastV+"</td><td><button class=\"delete_button\" id=\""+name+"\">Delete</button></td></tr>";
					}
				}
				
				//calculating time spent on the web
				time_spent = overall_time
				days = Math.floor(time_spent / 86400);
				time_spent %= 86400;
				hours = Math.floor(time_spent / 3600);
				time_spent %= 3600;
				minutes = Math.floor(time_spent / 60);
				seconds = time_spent % 60;
				total_time = '[' + days +' days ' + hours + ' hours ' + minutes + ' min ' + seconds + ' sec]' 
				//calculate days between first visited site and today
				var today = new Date();
				var today_day = today.getDate();
				today.setDate(today_day+1)
				today.setHours(0, 0, 0, 0)
				var difference = (today-old_date)/1000
				var percentage_spent = Math.round((overall_time/difference)*100)
				var spent_days = Math.round(difference/60/60/24)
				percentage_spent_on_web = '<div align="center" class="percentage_spent"> You spent <font color="#ffc107"><strong>' + percentage_spent + '% </strong></font> <strong><font color="#ffc107" size=2>' + total_time + '</font></strong> of your time on the web in the last <font color="#ffc107"><strong>' + spent_days + '</strong></font> days</div><p> </p>';
				let retrieve_sites="<button id=\"statement_restore\">Click to view/restore deleted sites</button>";
				$('.body').append(percentage_spent_on_web+table_start+table_body+table_end+retrieve_sites);
			}
			else
			{
				var EmptyMessage = "<center style='margin:20px;' ><div>No records yet. Go browse the wonderful internet!</div></center>";
				$('.body').append(EmptyMessage);
				// $(".form-inline").hide();
			}
		}
	});

	 
});
