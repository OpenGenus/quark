
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
					let table_start = '<div class="table-responsive"><table id="t2" class="table table-hover"><thead><tr><th>S.No. </th><th>Site Name</th><th>Days</th><th>Hours</th><th>Minutes</th><th>Seconds</th><th>Last Visited On</th></tr></thead><tbody>';
					let table_body = '';
					let table_end = "</tbody></table></div>";


					for (var site in current_sites)
					{
						var name = current_sites[site].name;
						var lastV = current_sites[site].lastV;
						var hrs = current_sites[site].hrs ;
						var days = current_sites[site].days;
						var mins = current_sites[site].mins;
						var secs = current_sites[site].secs;
						table_body +="<tr><td>"+(+(site)+1)+"</td><td>"+name+"</td><td>"+days+"</td><td>"+hrs+"</td><td>"+mins+"</td><td>"+secs+"</td><td>"+lastV+"</td></tr>"

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