var db = openDatabase('mydb1', '1.0', 'Test DB', 2 * 1024 * 1024); 
var msg; 
db.transaction(function (tx) { 
    console.log("here")
    tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
    var len = results.rows.length, i; 
    console.log(len)

    for (i = 0; i < len; i++) { 
        console.log( results.rows.item(i).log)
    } 
}, null); 
}); 

function addDb(){
    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)'); 
        tx.executeSql('INSERT INTO LOGS (id, log) VALUES (3, "asdf")'); 
        tx.executeSql('INSERT INTO LOGS (id, log) VALUES (4, "sdf")'); 
    })
}
function getDb(){
    db.transaction(function (tx) { 
    tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
       var len = results.rows.length, i; 
       for (i = 0; i < len; i++) { 
          console.log(results.rows.item(i).log)
       } 
    }, null); 
 }); 
}

function addListeners(){      
    chrome.runtime.onMessage.addListener(
    function(message,sender,sendResponse)
    {
        var i,panel;
        
        switch (message.type)
        {            
            case "performAction":
                sendResponse({ });  

                action = message.action;
                console.log(action)
                if(action == "save"){
                    addDb();
                }
        }
    }
)
}

$( document ).ready(function() {
    getDb();
    addListeners();
});
