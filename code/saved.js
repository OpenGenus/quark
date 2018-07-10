var db = openDatabase('OpenGenusSavedPages', '1.0', 'saved', 2 * 1024 * 1024); 

function addDb(filename, url, time){
    console.log(time)
    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (filename unique, url, time)'); 
        tx.executeSql('INSERT INTO LOGS (filename, url, time) VALUES ("' + filename  + '", "'  + url + '", "'  + time + '")'); 
    })
}

function getDb(){
    db.transaction(function (tx) { 
    tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
        let names = [];
        let links = [];
        let times = []
       var len = results.rows.length, i;
       for (i = 0; i < len; i++) { 
            names.push(results.rows.item(i).filename)
            links.push(results.rows.item(i).url)
            times.push(results.rows.item(i).time)
       } 

        // constructing table
        let table_start = '<div id="tbl"><div class="table-responsive"><table id="t2" class="table table-hover"><thead><tr><th id="open"> </th><th id="serial">No.</th><th id="time"> Time </th><th id="name">Page Name</th><th id="delete"> </th></tr></thead><tbody></div>';
        let table_body = '';
        let table_end = "</tbody></table></div>";
            for(let site in names)
            {	
                let name = names[site]
                let time = times[site]
                var id = "delete" + site.toString();
                table_body +="<tr><td><button id=" + site + " type='button' class='btn btn-outline-warning'>Open</button></td><td class='align-middle'>"+(+(site)+1)+"</td><td class='align-middle'>"+time+"</td><td class='align-middle'>"+name+"</td><td><button id=" + id + " type='button' class='btn btn-outline-danger'>Delete</button></td></tr>"
            }
        var element = document.getElementById("OpenGenus-table-saved.html")
        element.innerHTML = table_start+table_body+table_end;

        for(let site in names){
            var element = document.getElementById(site);
            element.addEventListener("click", function(){
                convertToBlob(links[site])
            });

            var id = "delete" + site.toString(); 
            var deleteBtn = document.getElementById(id);
            deleteBtn.addEventListener("click", function(){
                deleteDB(names[site], links[site])
            });
        }
        if (len == 0){
            emptyMess();
        }
        }); 

    }); 
}

function emptyMess(){
    var EmptyMessage = "<div id='tbl'> <center style='margin:20px;' ><div>Looks like You have no saved pages yet. You can save any page using OpenGenus extension to browse it offline later!</div></center></div>";
    var element = document.getElementById("OpenGenus-EmptyMessage-saved.html")
    element.innerHTML = EmptyMessage;
}

function deleteDB(filename, url){
    db.transaction(function(tx) {
        tx.executeSql('delete from LOGS where filename=? AND url=?', [filename, url], function(transaction, result) {
            console.log(result);
            console.info('Record Deleted Successfully!');
        }, function(transaction, error) {
            console.log(error);
        });
    });
    var tbl = document.getElementById("tbl");
    tbl.parentNode.removeChild(tbl);
    getDb();
}

function convertToBlob(url){
    fetch(url)
        .then(res => res.blob())
        .then(blob => openPage(blob))
}
function openPage(blob){
    objectURL = window.URL.createObjectURL(blob);
    link = document.createElement("a");
    link.target = "_blank";
    link.href = objectURL;
    document.body.appendChild(link);
    link.addEventListener("click",handleClick,true);
    link.click();  
    link.removeEventListener("click",handleClick,true);
    document.body.removeChild(link);
    window.setTimeout(
        function()
        {
            window.URL.revokeObjectURL(url);
            
            chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
        },100);
        
        function handleClick(event)
        {
            event.stopPropagation();
        }
}

function searchPages(){

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

chrome.runtime.onMessage.addListener(
    function(message,sender,sendResponse)
    {    
        switch (message.type)
        {
            case "addDb":
                filename = message.id;
                url =  message.url; 
                time = message.time;
                if( filename != undefined && url != undefined && time != undefined){
                    console.log("here")
                    addDb(filename, url, time)
                }           
                break;
        }
    });

$( document ).ready(function() {
    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (filename unique, url, time)'); 
    });
    getDb()
    $("#DomainSearch").keyup(function(){	
		searchPages();
	});
});
