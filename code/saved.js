var db = openDatabase('saved', '1.0', 'saved', 2 * 1024 * 1024); 

function addDb(filename, url){
    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (filename unique, url)'); 
        tx.executeSql('INSERT INTO LOGS (filename, url) VALUES ("' + filename  + '", "'  + url + '")'); 
    })
}

function getDb(){
    db.transaction(function (tx) { 
    tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
        let names = [];
        let links = [];
        let websites = []
       var len = results.rows.length, i; 
       for (i = 0; i < len; i++) { 
            names.push(results.rows.item(i).filename)
            links.push(results.rows.item(i).url)
            var url_name = new URL(results.rows.item(i).url.substring(5));
            websites.push(url_name.hostname)
       } 

        // constructing table
        let percentage_spent_on_web = '';
        let table_start = '<div class="table-responsive"><table id="t2" class="table table-hover"><thead><tr><th id="serial">No.</th><th id="name">Saved Page</th><th>Site Name</th></tr></thead><tbody>';
        let table_body = '';
        let table_end = "</tbody></table></div>";
            for(let site in names)
            {	
                let name = names[site]
                let url = websites[site]
                table_body +="<tr id="+site +"><td>"+(+(site)+1)+"</td><td>"+name+"</td><td>"+url+"</td></tr>"
            }
        $('.body').append(table_start+table_body+table_end);

        for(let site in names){
            var element = document.getElementById(site);
            element.addEventListener("click", function(){
                openPage(links[site])
            });
        }

        }, emptyMess); 

    }); 
}
function emptyMess(){
    var EmptyMessage = "<center style='margin:20px;' ><div>No saved pages yet. You can save any page using OpenGenus extension to browse it offline later!</div></center>";
    $('.body').append(EmptyMessage);
}

function openPage(url){
    console.log(url)
    link = document.createElement("a");
    link.target = "_blank";
    link.href = url;
    document.body.appendChild(link);
    link.addEventListener("click",handleClick,true);
    link.click();  
    link.removeEventListener("click",handleClick,true);
    document.body.removeChild(link);
    function handleClick(event)
    {
        event.stopPropagation();
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

$( document ).ready(function() {
    let filename = getQueryVariable('filename');
    let url = getQueryVariable('url');
    if (filename != false && filename!= undefined && filename != "") {
        if (url != false && url != undefined && url != "") {
            chrome.runtime.onMessage.addListener(
                function(message,sender,sendResponse)
                {     
                    switch (message.type)
                    {
                        case "addDb":
                            filename = message.id;
                            url =  message.url;
                            break;
                    }
                });
            filename = decodeURIComponent(filename)
            addDb(filename, url)
            window.close();
        }
    }
    getDb()
});
