"use strict";

frameScript();

function frameScript()
{

if (document.readyState != "loading") onLoadPage();
else
{
    window.addEventListener("load",
    function(event)
    {
        if (document.readyState != "loading") onLoadPage();
    },false);
}

function onLoadPage()
{  
    addListeners();
}

function addListeners()
{    
    chrome.runtime.onMessage.addListener(
    function(message,sender,sendResponse)
    {
        var doctype,htmltext;
        
        switch (message.type)
        {                
            case "requestCrossFrames":
                
                if (document.defaultView.frameElement == null)  
                {
                    nameCrossFrames(0,window,document.documentElement);
                    
                    if (window.name != "")
                    {
                        doctype = document.doctype;
                        
                        if (doctype != null)
                        {
                            htmltext = '<!DOCTYPE ' + doctype.name + (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"' : '') +
                                       ((doctype.systemId && !doctype.publicId) ? ' SYSTEM' : '') + (doctype.systemId ? ' "' + doctype.systemId + '"' : '') + '>';
                        }
                        else htmltext = "";
                        
                        htmltext += document.documentElement.outerHTML;
                        
                        htmltext = htmltext.replace(/<head([^>]*)>/,"<head$1><base href=\"" + document.baseURI + "\">");
                        
                        chrome.runtime.sendMessage({ type: "replyCrossFrame", name: window.name, url: document.baseURI, html: htmltext });
                    }
                }
                
                break;
        }
    });
}

function nameCrossFrames(depth,frame,element)
{
    var i;
        
    if (element.localName == "iframe" || element.localName == "frame")  
    {
        try
        {
            if (element.contentDocument.documentElement != null)  
            {
                nameCrossFrames(depth+1,element.contentWindow,element.contentDocument.documentElement);
            }
        }
        catch (e)  
        {
            if (!element.name) element.setAttribute("name","savepage-frame-" + Math.trunc(Math.random()*100000000));
        }
    }
    else
    {
        for (i = 0; i < element.children.length; i++)
            if (element.children[i] != null)  
                nameCrossFrames(depth,frame,element.children[i]);
    }
}

}