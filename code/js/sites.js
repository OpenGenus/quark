
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
				{
					//$(".form-inline").show();
					let table_start = '<div class="table-responsive"><table id="t2" class="table table-hover"><thead><tr><th>S.No. </th><th>Site Name</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th><th>Percentage of Time</th><th>Last Visited On</th></tr></thead><tbody>';
					let table_body = '';
					let table_end = "</tbody></table></div>";
					//combined time taken for all sites
					let overall_time = 0;
					for (let site in current_sites)
					{
						//calculating time in seconds
						let site_time_secs = (current_sites[site].days*24*60*60) + (current_sites[site].hrs*60*60) + (current_sites[site].mins*60) + current_sites[site].secs;
						overall_time += site_time_secs;
					}

					for(let site in current_sites)
					{
						let name = current_sites[site].name;
						let lastV = current_sites[site].lastV;
						let days = current_sites[site].days;
						let hrs = current_sites[site].hrs ;
						let mins = current_sites[site].mins;
						let secs = current_sites[site].secs;
						let site_time_secs = (days*24*60*60) + (hrs*60*60) + (mins*60) + secs;
						//calculating percentage of time spent in each site
						let percent_time = ((site_time_secs/overall_time)*100).toFixed(2).toString()+'%';
						table_body +="<tr><td>"+(+(site)+1)+"</td><td>"+name+"</td><td>"+days+"</td><td>"+hrs+"</td><td>"+mins+"</td><td>"+secs+"</td><td>"+percent_time+"</td><td>"+lastV+"</td></tr>"
					}

					$('.body').append(table_start+table_body+table_end);
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