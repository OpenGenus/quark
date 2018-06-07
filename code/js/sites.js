
//Search 
function searchSites(){

	input = document.getElementById("DomainSearch");
	filter = input.value.toUpperCase();
	div = document.getElementById("t2");
	a = div.getElementsByTagName("tr");
	for (i = 1; i < a.length; i++) {
		if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
			a[i].style.display = "";
			} else {
				a[i].style.display = "none";
			}
		}
	}




	$( document ).ready(function() {

		$("#DomainSearch").keyup(function(){	
			searchSites();
			});
		

		let current_sites =[];

		chrome.storage.sync.get({sites: []}, function(items) {
			if (!chrome.runtime.error) {
				current_sites = items.sites;                
				if(current_sites.length>0)
				{	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					//$(".form-inline").show();
					let percentage_spent_on_web = '';
					let table_start = '<div class="table-responsive"><table id="t2" class="table table-hover"><thead><tr><th>S.No. </th><th>Site Name</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th><th>Percentage of Time</th><th>Last Visited On</th></tr></thead><tbody>';
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
					
					for(let site in current_sites)
					{	
						var parts = current_sites[site].lastV.split('/');
						var site_date = new Date(parts[2], parts[1], parts[0]);
						correct_date = site_date.getDate()+" "+monthNames[parseInt(parts[1])]+" "+site_date.getFullYear();
						let name = current_sites[site].name;
						let lastV = correct_date;
						let days = current_sites[site].days;
						let hrs = current_sites[site].hrs ;
						let mins = current_sites[site].mins;
						let secs = current_sites[site].secs;
						let site_time_secs = (days*24*60*60) + (hrs*60*60) + (mins*60) + secs;
						//calculating percentage of time spent in each site
						let percent_time = ((site_time_secs/overall_time)*100).toFixed(2).toString()+'%';
						table_body +="<tr><td>"+(+(site)+1)+"</td><td>"+name+"</td><td>"+days+"</td><td>"+hrs+"</td><td>"+mins+"</td><td>"+secs+"</td><td>"+percent_time+"</td><td>"+lastV+"</td></tr>"
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

					$('.body').append(percentage_spent_on_web+table_start+table_body+table_end);
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