$( document ).ready(function() {
   
    				let current_sites =[];

				    chrome.storage.sync.get({sites: []}, function(items) {
                            if (!chrome.runtime.error) {
                                current_sites = items.sites;                
                          

				    


				    let table_start = '<div class="table-responsive"><table id="t1" class="table table-hover"><thead><tr><th>S.No. </th><th>Site Name</th><th>Total Time Spent (mS)</th></tr></thead><tbody>';
				    let table_body = '';
				    let table_end = "</tbody></table></div>";
				    

				    for (var site in current_sites)
				    {
				       	var name = current_sites[site].name;
				    	var time = current_sites[site].time;
				    	table_body +="<tr><td>"+(+(site)+1)+"</td><td><a>"+name+"</a></td><td>"+time+"</td></tr>"
					   
				    }
				      
				    $('.body').append(table_start+table_body+table_end);
				    }
                    }); 


});