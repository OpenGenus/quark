var db = openDatabase('PagesSaved', '1.0', 'saved', 2 * 1024 * 1024); 

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
       var len = results.rows.length, i; 
       for (i = 0; i < len; i++) { 
            names.push(results.rows.item(i).filename)
            links.push(results.rows.item(i).url)
       } 

        // constructing table
        let percentage_spent_on_web = '';
        let table_start = '<div class="table-responsive"><table id="t2" class="table table-hover"><thead><tr><th id="serial">No.</th><th id="name">Page Name</th></tr></thead><tbody>';
        let table_body = '';
        let table_end = "</tbody></table></div>";
            for(let site in names)
            {	
                let name = names[site]
                table_body +="<tr id="+site +"><td>"+(+(site)+1)+"</td><td>"+name+"</td></tr>"
            }
        $('.body').append(table_start+table_body+table_end);

        for(let site in names){
            var element = document.getElementById(site);
            element.addEventListener("click", function(){
                convertToBlob(links[site])
            });
        }

        }, emptyMess); 

    }); 
}
function emptyMess(){
    var EmptyMessage = "<center style='margin:20px;' ><div>No saved pages yet. You can save any page using OpenGenus extension to browse it offline later!</div></center>";
    $('.body').append(EmptyMessage);
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

chrome.runtime.onMessage.addListener(
    function(message,sender,sendResponse)
    {    
        switch (message.type)
        {
            case "addDb":
                filename = message.id;
                url =  message.url; 
                addDb(filename, url)           
                break;
        }
    });

$( document ).ready(function() {
    getDb()
});
