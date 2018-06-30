var db = openDatabase('savedPages', '1.0', 'savedPages', 2 * 1024 * 1024); 

function addDb(filename, url){
    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (filename unique, url)'); 
        tx.executeSql('INSERT INTO LOGS (filename, url) VALUES ("' + filename  + '", "'  + url + '")'); 
    })
}
function getDb(){
    db.transaction(function (tx) { 
    tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
       var len = results.rows.length, i; 
       for (i = 0; i < len; i++) { 
        console.log(results.rows.item(i).filename)
          console.log(results.rows.item(i).url)
       } 
    }, null); 
 }); 
}

function addListeners(){      
    chrome.runtime.onMessage.addListener(
        function(message,sender,sendResponse)
        {     
            switch (message.type)
            {
                case "addDb":
                    addDb(message.id, message.url)
                    break;
            }
        });
}

$( document ).ready(function() {
    getDb();
    addListeners();
});
