"use strict";

var showSubmenu;
var maxResourceTime;

var badgeTabId;

initialize();

function initialize()
{
    chrome.storage.local.get(null,
    function(object)
    {
        var context;
                                
        object["options-showsubmenu"] = true;  
        
        object["options-showwarning"] = true;
        
        object["options-showurllist"] = false;
        
        object["options-promptcomments"] = false;
        
        object["options-usepageloader"] = true;
        
        object["options-retaincrossframes"] = true;
        
        object["options-removeunsavedurls"] = true;
        
        object["options-includeinfobar"] = false;  
        
        object["options-includesummary"] = false;
        
        object["options-prefixfilename"] = false;
        
        object["options-prefixtext"] = "{%DOMAIN%}";
        
        object["options-suffixfilename"] = false;
        
        object["options-suffixtext"] = "{%DATE% %TIME%}";
                
        object["options-savehtmlimagesall"] = false;  
        
        object["options-savehtmlaudiovideo"] = false;
        
        object["options-savehtmlobjectembed"] = false;
        
        object["options-savecssimagesall"] = false;  
        
        object["options-savecssfontswoff"] = false;  
        
        object["options-savescripts"] = false;  
        
        object["options-maxframedepth"] = 5;  
        
        object["options-maxresourcesize"] = 50;
        
        object["options-maxresourcetime"] = 10;  
        
        object["options-maxframedepth"] = 5;
        object["options-maxframedepth-9.0"] = true;
        
                
        chrome.storage.local.set(object);
                        
        showSubmenu = object["options-showsubmenu"];
        
        maxResourceTime = object["options-maxresourcetime"];
                
        context = showSubmenu ? "all" : "browser_action";
        
        chrome.contextMenus.create({ id: "basicitems", title: "OpenGenus Quark: Download page", contexts: [ context ], enabled: true });
        chrome.contextMenus.create({ id: "saveitems", title: "OpenGenus Quark: Save page in-browser", contexts: [ context ], enabled: true });
                
        chrome.tabs.query({ lastFocusedWindow: true, active: true },
        function(tabs)
        {
            setButtonAndMenuStates(tabs[0].id,tabs[0].url);
        });
                
        addListeners();
    });
}

function addListeners()
{    
    chrome.contextMenus.onClicked.addListener(
    function(info,tab)
    {

        if (info.menuItemId == "basicitems"){ 
            initiateAction(tab,0,null, "load");
        }
        if (info.menuItemId == "saveitems"){ 
          initiateAction(tab,0,null, "save");
        }
        
    });
        
    chrome.tabs.onActivated.addListener(  
    function(activeInfo)
    {
        chrome.tabs.get(activeInfo.tabId,
        function(tab)
        {
            if (chrome.runtime.lastError == null) 
            {
                setButtonAndMenuStates(activeInfo.tabId,tab.url);
            }
        });
    });
    
    chrome.tabs.onUpdated.addListener(  
    function(tabId,changeInfo,tab)
    {
        setButtonAndMenuStates(tabId,tab.url);
    });
        
    chrome.webNavigation.onCompleted.addListener(  
    function(details)
    {
        if (details.frameId == 0)
        {            
            chrome.tabs.get(details.tabId,
            function(tab)
            {
                setButtonAndMenuStates(details.tabId,tab.url);
                
                setSaveBadge("","#000000");
            });
        }
    });
        
    chrome.runtime.onMessage.addListener(
    function(message,sender,sendResponse)
    {
        var xhr = new Object();
                
        switch (message.type)
        {
            case "requestCrossFrames":
                
                chrome.tabs.sendMessage(sender.tab.id,{ type: "requestCrossFrames" },checkError);
                
                break;
                
            case "replyCrossFrame":
                
                chrome.tabs.sendMessage(sender.tab.id,{ type: "replyCrossFrame", name: message.name, url: message.url, html: message.html },checkError);
                
                break;
            case "addDb":
                //let link = 'saved.html?filename=' +  message.id + '&url=' +  message.url;
                //chrome.tabs.create({ 'url': chrome.extension.getURL(link)})
                chrome.runtime.sendMessage({ type: "addDb", id:  message.id, url: message.url})
                break;
                
            case "loadResource":
                
                if (message.location.substr(0,6) == "https:" ||
                    (message.location.substr(0,5) == "http:" && message.pagescheme == "http:"))  
                { 
                    try
                    {
                        xhr = new XMLHttpRequest();
                        
                        xhr.open("GET",message.location,true);
                        xhr.setRequestHeader("Cache-Control","no-store");
                        xhr.responseType = "arraybuffer";
                        xhr.timeout = maxResourceTime*1000;
                        xhr._tabId = sender.tab.id;
                        xhr._resourceIndex = message.index;
                        xhr.onload = onloadResource;
                        xhr.onerror = onerrorResource;
                        xhr.ontimeout = ontimeoutResource;
                        
                        xhr.send(); 
                    }
                    catch(e)
                    {
                        chrome.tabs.sendMessage(sender.tab.id,{ type: "loadFailure", index: message.index },checkError);
                    }
                }
                else chrome.tabs.sendMessage(sender.tab.id,{ type: "loadFailure", index: message.index },checkError);
                
                function onloadResource()
                {
                    var i,binaryString,contentType,allowOrigin;
                    var byteArray = new Uint8Array(this.response);
                    
                    if (this.status == 200)
                    {
                        binaryString = "";
                        for (i = 0; i < byteArray.byteLength; i++) binaryString += String.fromCharCode(byteArray[i]);
                        
                        contentType = this.getResponseHeader("Content-Type");
                        if (contentType == null) contentType = "";
                        
                        allowOrigin = this.getResponseHeader("Access-Control-Allow-Origin");
                        if (allowOrigin == null) allowOrigin = "";
                        
                        chrome.tabs.sendMessage(this._tabId,{ type: "loadSuccess", index: this._resourceIndex, 
                                                              content: binaryString, contenttype: contentType, alloworigin: allowOrigin },checkError);
                    }
                    else chrome.tabs.sendMessage(this._tabId,{ type: "loadFailure", index: this._resourceIndex },checkError);
                }
                
                function onerrorResource()
                {
                    chrome.tabs.sendMessage(this._tabId,{ type: "loadFailure", index: this._resourceIndex },checkError);
                }
                
                function ontimeoutResource()
                {
                    chrome.tabs.sendMessage(this._tabId,{ type: "loadFailure", index: this._resourceIndex },checkError);
                }
                
                break;
                
            case "setSaveBadge":
                
                setSaveBadge(message.text,message.color);
                
                break;
        }
    });
}

function initiateAction(tab,menuaction,srcurl,action)
{   
    if (specialPage(tab.url))  
    {
        alertNotify("Cannot be used with these special pages:\n" +
                    "about:, moz-extension:,\n" +
                    "https://addons.mozilla.org,\n" +
                    "chrome:, chrome-extension:,\n" +
                    "https://chrome.google.com/webstore.");
    }
    else if (tab.url.substr(0,5) != "file:" && menuaction >= 3)  
    {
        alertNotify("Cannot view saved page information or extract media files for unsaved pages.");
    }
    else  
    {
        badgeTabId = tab.id;
        chrome.tabs.sendMessage(tab.id,{ type: "performAction", action: action, menuaction: menuaction, srcurl: srcurl },
        function(response)
        {
            if (chrome.runtime.lastError != null || typeof response == "undefined")  
            {
                chrome.tabs.executeScript(tab.id,{ file: "content.js" },
                function()
                {
                    chrome.tabs.sendMessage(tab.id,{ type: "performAction", action: action, menuaction: menuaction, srcurl: srcurl },
                    function(response)
                    {
                        if (chrome.runtime.lastError != null || typeof response == "undefined")  
                        {
                            alertNotify("Cannot be used with this page.");
                        }
                        else
                        {
                            chrome.tabs.executeScript(tab.id,{ file: "content-frame.js", allFrames: true });
                        }
                    });
                });
            }
        });

    }
}

function specialPage(url)
{
    return (url.substr(0,6) == "about:" || url.substr(0,14) == "moz-extension:" || url.substr(0,26) == "https://addons.mozilla.org" ||
            url.substr(0,7) == "chrome:" || url.substr(0,17) == "chrome-extension:" || url.substr(0,34) == "https://chrome.google.com/webstore");
}

function setButtonAndMenuStates(tabId,url)
{
    if (specialPage(url))  
    {
                        
        chrome.contextMenus.update("basicitems",{ enabled: false });
        chrome.contextMenus.update("saveitems",{ enabled: false });
        
    }
    else if (url.substr(0,5) == "file:")  
    {                        
        chrome.contextMenus.update("basicitems",{ enabled: true });
        chrome.contextMenus.update("saveitems",{ enabled: true });
    }
    else  
    {
        chrome.contextMenus.update("basicitems",{ enabled: true });
        chrome.contextMenus.update("saveitems",{ enabled: true });
    }

    
}

function setSaveBadge(text,color)
{
    chrome.browserAction.setBadgeText({ tabId: badgeTabId, text: text });
    chrome.browserAction.setBadgeBackgroundColor({ tabId: badgeTabId, color: color });
}

function checkError()
{
    if (chrome.runtime.lastError == null) ;
    else if (chrome.runtime.lastError.message == "Could not establish connection. Receiving end does not exist.") ;  
    else if (chrome.runtime.lastError.message == "The message port closed before a response was received.") ;  
    else if (chrome.runtime.lastError.message == "Message manager disconnected") ;  
    else console.log("OpenGenus Offline: " + chrome.runtime.lastError.message);
}

function alertNotify(message)
{
    chrome.notifications.create("alert",{ type: "basic", iconUrl: "icon/icon.png", title: "OpenGenus Offline", message: "" + message });
}

function debugNotify(message)
{
    chrome.notifications.create("debug",{ type: "basic", iconUrl: "icon/icon.png", title: "OpenGenus Offline", message: "" + message });
}
