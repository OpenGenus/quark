chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
        'url': chrome.extension.getURL('popup.html')
    }, function(tab) {
        localStorage.setItem("openThroughWeb", "no");
    });
});
//it listens to messages sent by content scripts

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.clicked == "true")
    {
    	chrome.tabs.create({'url': chrome.extension.getURL('popup.html')},function(tab) {});

        localStorage.setItem("value", request.value);//saves the query that user has selected
        localStorage.setItem("openThroughWeb", "yes");
    	sendResponse({mesg: "response received"});
    } 
    if(request.URL_found=="true")
    {
        
        let current_sites =[];
        let url = new Object();
        url.name = request.URL;
        url.time = request.time;

        chrome.storage.sync.get({sites: []}, function(items) {
                            if (!chrome.runtime.error) {
                                current_sites = items.sites; 
                                 

                                let found = false;
                                let index = 0;
                                for(let i in current_sites ) {
                                    if (current_sites[i].name == url.name) {
                                        found = true;
                                        index = i;
                                        break;
                                    }
                                }   
                                if(found==false)
                                {    
                                    current_sites.push(url); 
                                }
                                else
                                {
                                    current_sites[index].time = current_sites[index].time + url.time;
                                }

                                chrome.storage.sync.set({ sites : current_sites }, function() {
                                            if (chrome.runtime.error) {
                                                console.log("Runtime error.");
                                            }
                                        });
                                             
                            }
       }); 
        
        sendResponse({mesg:"ok"})


    }

  });