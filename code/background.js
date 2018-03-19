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
    	chrome.tabs.create({     
        'url': chrome.extension.getURL('popup.html')
    }, function(tab) {

    });
        localStorage.setItem("value", request.value);//saves the query that user has selected
        localStorage.setItem("openThroughWeb", "yes");
    	sendResponse({mesg: "response received"});
    } 
  });