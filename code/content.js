"use strict";

var isFirefox;
var ffVersion;

var showWarning,showURLList,promptComments;
var usePageLoader,retainCrossFrames,removeUnsavedURLs,includeInfoBar,includeSummary;
var prefixFileName,prefixText,suffixFileName,suffixText;
var saveHTMLAudioVideo,saveHTMLObjectEmbed,saveHTMLImagesAll;
var saveCSSImagesAll,saveCSSFontsWoff,saveScripts;
var maxFrameDepth;
var maxResourceSize;
var maxResourceTime;

var savedPage;  
var savedPageLoader;  

var menuAction;
var action;
var passNumber;
var iconFound;

var crossFrameName = new Array();
var crossFrameURL = new Array();
var crossFrameHTML = new Array();

var resourceCount;

var resourceLocation = new Array();
var resourceMimeType = new Array();
var resourceCharSet = new Array();
var resourceContent = new Array();
var resourceAllowOrigin = new Array();
var resourceStatus = new Array();
var resourceRemembered = new Array();
var resourceReplaced = new Array();

var htmlStrings = new Array();

var timeStart = new Array();
var timeFinish = new Array();

var pageInfoBar,pageLoader,enteredComments;

chrome.storage.local.get(null,
function(object)
{    
    isFirefox = object["environment-isfirefox"];
    
    if (isFirefox) ffVersion = object["environment-ffversion"];
        
    showWarning = object["options-showwarning"];
    showURLList = object["options-showurllist"];
    promptComments = object["options-promptcomments"];
    
    usePageLoader = object["options-usepageloader"];
    retainCrossFrames = object["options-retaincrossframes"];
    removeUnsavedURLs = object["options-removeunsavedurls"];
    includeInfoBar = object["options-includeinfobar"];
    includeSummary = object["options-includesummary"];
    
    prefixFileName = object["options-prefixfilename"];
    prefixText = object["options-prefixtext"];
    suffixFileName = object["options-suffixfilename"];
    suffixText = object["options-suffixtext"];
    
    saveHTMLImagesAll = object["options-savehtmlimagesall"];
    saveHTMLAudioVideo = object["options-savehtmlaudiovideo"];
    saveHTMLObjectEmbed = object["options-savehtmlobjectembed"];
    saveCSSImagesAll = object["options-savecssimagesall"];
    saveCSSFontsWoff = object["options-savecssfontswoff"];
    saveScripts = object["options-savescripts"];
    
    maxFrameDepth = object["options-maxframedepth"];
    
    maxResourceSize = object["options-maxresourcesize"];
    
    maxResourceTime = object["options-maxresourcetime"];
        
    savedPage = (document.querySelector("meta[name='savepage-url']") != null);
    
    savedPageLoader = (document.querySelector("script[id='savepage-pageloader']") != null);
        
    addListeners();
});

function addListeners()
{    
    chrome.storage.onChanged.addListener(
    function(changes,areaName)
    {
        chrome.storage.local.get(null,
        function(object)
        {
            showWarning = object["options-showwarning"];
            showURLList = object["options-showurllist"];
            promptComments = object["options-promptcomments"];
            
            usePageLoader = object["options-usepageloader"];
            retainCrossFrames = object["options-retaincrossframes"];
            removeUnsavedURLs = object["options-removeunsavedurls"];
            includeInfoBar = object["options-includeinfobar"];
            includeSummary = object["options-includesummary"];
            
            prefixFileName = object["options-prefixfilename"];
            prefixText = object["options-prefixtext"];
            suffixFileName = object["options-suffixfilename"];
            suffixText = object["options-suffixtext"];
            
            saveHTMLImagesAll = object["options-savehtmlimagesall"];
            saveHTMLAudioVideo = object["options-savehtmlaudiovideo"];
            saveHTMLObjectEmbed = object["options-savehtmlobjectembed"];
            saveCSSImagesAll = object["options-savecssimagesall"];
            saveCSSFontsWoff = object["options-savecssfontswoff"];
            saveScripts = object["options-savescripts"];
            
            maxFrameDepth = object["options-maxframedepth"];
            
            maxResourceSize = object["options-maxresourcesize"];
            
            maxResourceTime = object["options-maxresourcetime"];
        });
    });
        
    chrome.runtime.onMessage.addListener(
    function(message,sender,sendResponse)
    {
        var i,panel;
        
        switch (message.type)
        {            
            case "performAction":
                sendResponse({ });  
                
                menuAction = message.menuaction;

                action = message.action;
                                
                panel = document.getElementById("savepage-unsaved-panel-container");
                
                if (panel != null) document.documentElement.removeChild(panel);
                                
                panel = document.getElementById("savepage-comments-panel-container");
                
                if (panel != null) document.documentElement.removeChild(panel);
                                
                panel = document.getElementById("savepage-pageinfo-panel-container");
                
                if (panel != null) document.documentElement.removeChild(panel);
                                
                if (document.readyState == "complete")
                {
                    window.setTimeout(
                    function()
                    {
                        performAction(message.srcurl);
                    },50);
                }
                else
                {
                    window.addEventListener("load",
                    function(event)
                    {
                        if (document.readyState == "complete") performAction(message.srcurl);
                    },false);
                }
                
                break;
                
            case "loadSuccess":
                
                loadSuccess(message.index,message.content,message.contenttype,message.alloworigin);
                
                break;
                
            case "loadFailure":
                
                loadFailure(message.index);
                
                break;
                
            case "replyCrossFrame":
                
                if (message.url != document.URL)  
                {
                    i = crossFrameName.length;
                    
                    crossFrameName[i] = message.name;
                    crossFrameURL[i] = message.url;
                    crossFrameHTML[i] = message.html;
                }
                
                break;
        }
    });
}

function performAction(srcurl)
{
    var script;
    if (menuAction <= 2)  
    {
        if (!savedPageLoader)
        {            
            crossFrameName.length = 0;
            crossFrameURL.length = 0;
            crossFrameHTML.length = 0;
            
            resourceLocation.length = 0;
            resourceMimeType.length = 0;
            resourceCharSet.length = 0;
            resourceContent.length = 0;
            resourceAllowOrigin.length = 0;
            resourceStatus.length = 0;
            resourceRemembered.length = 0;
            resourceReplaced.length = 0;
            
            pageInfoBar = "";
            pageLoader = "";
            enteredComments = "";
            
            htmlStrings.length = 0;
            
            htmlStrings[0] = "﻿";  
            
            if (retainCrossFrames) identifyCrossFrames();
            else gatherStyleSheets();
        }
        else alert("This page was loaded using page loader.\n\nCannot perform operation.");
    }
    else if (menuAction == 3)  
    {
        if (savedPage) viewSavedPageInfo();
        else alert("This page was not saved.\n\nCannot perform operation.");
    }
    else if (menuAction == 4)  
    {
        if (savedPage)
        {
            if (savedPageLoader) removePageLoader();
            else alert("This page was not loaded using page loader.\n\nCannot perform operation.");
        }
        else alert("This page was not saved.\n\nCannot perform operation.");
    }
    else if (menuAction == 5)  
    {
        if (savedPage) extractSavedPageMedia(srcurl);
        else alert("This page was not saved.\n\nCannot perform operation.");
    }
}

function identifyCrossFrames()
{
    passNumber = 0;
    
    timeStart[0] = performance.now();
    
    nameCrossFrames(0,window,document.documentElement);
    
    timeFinish[0] = performance.now();
    
    chrome.runtime.sendMessage({ type: "requestCrossFrames" });
    
    window.setTimeout(function() { gatherStyleSheets(); },50);  
}

function nameCrossFrames(depth,frame,element)
{
    var i;
        
    if (element.localName == "iframe" || element.localName == "frame")  
    {
        if (depth < maxFrameDepth)
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
                if (retainCrossFrames)
                {
                    if (!element.name) element.setAttribute("name","savepage-frame-" + Math.trunc(Math.random()*100000000));
                }
            }
        }
    }
    else
    {
        for (i = 0; i < element.children.length; i++)
            if (element.children[i] != null) 
                nameCrossFrames(depth,frame,element.children[i]);
    }
}

function gatherStyleSheets()
{
    passNumber = 1;
    
    chrome.runtime.sendMessage({ type: "setSaveBadge", text: "SAVE", color: "#E00000" });
    
    timeStart[1] = performance.now();
    
    findStyleSheets(0,window,document.documentElement,false);
    
    timeFinish[1] = performance.now();
    
    loadResources();
}

function findStyleSheets(depth,frame,element,crossorigin)
{
    var i,baseuri,charset,csstext,regex,parser,framedoc;
    var matches = new Array();
        
    if (element.localName == "style")
    {
        csstext = element.textContent;
        
        baseuri = element.ownerDocument.baseURI;
        
        charset = element.ownerDocument.characterSet;
        
        regex = /@import\s*(?:url\(\s*)?(?:'|")?(?!data:)([^\s'";)]+)(?:'|")?(?:\s*\))?\s*;/gi;  
        
        while ((matches = regex.exec(csstext)) != null)
        {
            rememberURL(matches[1],baseuri,"text/css",charset);
        }
    }
        
    else if (element.localName == "link")
    {
        if (element.rel.toLowerCase() == "stylesheet" && element.getAttribute("href") != "" && element.href != "")    
        {
            if (element.href.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                if (element.charset != "") charset = element.charset;
                else charset = element.ownerDocument.characterSet;
                
                rememberURL(element.href,baseuri,"text/css",charset);
            }
        }
    }
        
    if (element.localName == "iframe" || element.localName == "frame")  
    {
        if (depth < maxFrameDepth)
        {
            try
            {
                if (element.contentDocument.documentElement != null)  
                {
                    findStyleSheets(depth+1,element.contentWindow,element.contentDocument.documentElement,crossorigin);
                }
            }
            catch (e) 
            {
                if (retainCrossFrames)
                {
                    for (i = 0; i < crossFrameName.length; i++)
                    {
                        if (crossFrameName[i] == element.name) break;
                    }
                    
                    if (i != crossFrameName.length)
                    {
                        parser = new DOMParser();
                        framedoc = parser.parseFromString(crossFrameHTML[i],"text/html");
                        
                        findStyleSheets(depth+1,window,framedoc.documentElement,true);
                    }
                }
            }
        }
    }
    else
    {
        for (i = 0; i < element.children.length; i++)
            if (element.children[i] != null)  
                findStyleSheets(depth,frame,element.children[i],crossorigin);
    }
}

function gatherOtherResources()
{
    passNumber = 2;
    
    iconFound = false;
    
    chrome.runtime.sendMessage({ type: "setSaveBadge", text: "SAVE", color: "#A000D0" });
    
    timeStart[2] = performance.now();
    
    findOtherResources(0,window,document.documentElement,false,false);
    
    timeFinish[2] = performance.now();
    
    loadResources();
}

function findOtherResources(depth,frame,element,crossorigin,nosource)
{
    var i,j,style,displayed,baseuri,charset,csstext,regex,location,parser,framedoc;
    var matches = new Array();
    
    if (isFirefox && ffVersion <= 54 && crossorigin)
    {
        displayed = true;
    }
    else
    {
        style = frame.getComputedStyle(element);
        
        displayed = (style != null && style.getPropertyValue("display") != "none");
            
        if ((menuAction == 2 || (menuAction == 1 && !saveCSSImagesAll) || menuAction == 0) && displayed)
        {
            csstext = "";
            
            csstext += style.getPropertyValue("background-image") + " ";
            csstext += style.getPropertyValue("border-image-source") + " ";
            csstext += style.getPropertyValue("list-style-image") + " ";
            csstext += style.getPropertyValue("cursor") + " ";
            csstext += style.getPropertyValue("filter") + " ";
            csstext += style.getPropertyValue("clip-path") + " ";
            csstext += style.getPropertyValue("mask") + " ";
            
            style = frame.getComputedStyle(element,"before");
            csstext += style.getPropertyValue("background-image") + " ";
            csstext += style.getPropertyValue("border-image-source") + " ";
            csstext += style.getPropertyValue("list-style-image") + " ";
            csstext += style.getPropertyValue("cursor") + " ";
            csstext += style.getPropertyValue("content") + " ";
            csstext += style.getPropertyValue("filter") + " ";
            csstext += style.getPropertyValue("clip-path") + " ";
            csstext += style.getPropertyValue("mask") + " ";
            
            style = frame.getComputedStyle(element,"after");
            csstext += style.getPropertyValue("background-image") + " ";
            csstext += style.getPropertyValue("border-image-source") + " ";
            csstext += style.getPropertyValue("list-style-image") + " ";
            csstext += style.getPropertyValue("cursor") + " ";
            csstext += style.getPropertyValue("content") + " ";
            csstext += style.getPropertyValue("filter") + " ";
            csstext += style.getPropertyValue("clip-path") + " ";
            csstext += style.getPropertyValue("mask") + " ";
            
            style = frame.getComputedStyle(element,"first-letter");
            csstext += style.getPropertyValue("background-image") + " ";
            csstext += style.getPropertyValue("border-image-source") + " ";
            
            style = frame.getComputedStyle(element,"first-line");
            csstext += style.getPropertyValue("background-image") + " ";
            
            baseuri = element.ownerDocument.baseURI;
            
            regex = /url\(\s*(?:'|")?(?!data:)([^\s'")]+)(?:'|")?\s*\)/gi;  
            
            while ((matches = regex.exec(csstext)) != null)
            {
                rememberURL(matches[1],baseuri,"image/png","");
            }
        }
    }
        
    if (element.hasAttribute("style"))
    {
        if ((menuAction == 1 && saveCSSImagesAll) || (isFirefox && ffVersion <= 54 && crossorigin))
        {
            csstext = element.getAttribute("style");
            
            baseuri = element.ownerDocument.baseURI;
            
            regex = /url\(\s*(?:'|")?(?!data:)([^\s'")]+)(?:'|")?\s*\)/gi;  
            
            while ((matches = regex.exec(csstext)) != null)
            {
                rememberURL(matches[1],baseuri,"image/png","");
            }
        }
    }
    
    if (element.localName == "script")
    {
        if (element.src != "")
        {
            if ((menuAction == 1 && saveScripts) && !crossorigin && !nosource)
            {
                if (element.src.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    if (element.charset != "") charset = element.charset;
                    else charset = element.ownerDocument.characterSet;
                    
                    rememberURL(element.src,baseuri,"application/javascript",charset);
                }
            }
        }
    }
        
    else if (element.localName == "style")
    {
        csstext = element.textContent;
        
        baseuri = element.ownerDocument.baseURI;
        
        findCSSURLsInStyleSheet(csstext,baseuri,crossorigin);
    }
    
    
    else if (element.localName == "link")
    {
        if (element.rel.toLowerCase() == "stylesheet" && element.getAttribute("href") != "" && element.href != "")    
        {
            if (element.href.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                if (baseuri != null)
                {
                    location = resolveURL(element.href,baseuri);
                    
                    if (location != null)
                    {
                        for (i = 0; i < resourceLocation.length; i++)
                            if (resourceLocation[i] == location && resourceStatus[i] == "success") break;
                        
                        if (i < resourceLocation.length)  
                        {
                            csstext = resourceContent[i];
                            
                            baseuri = element.href;
                            
                            findCSSURLsInStyleSheet(csstext,baseuri,crossorigin);
                        }
                    }
                }
            }
        }
        else if ((element.rel.toLowerCase() == "icon" || element.rel.toLowerCase() == "shortcut icon") && element.href != "")
        {
            iconFound = true;
            
            baseuri = element.ownerDocument.baseURI;
            
            rememberURL(element.href,baseuri,"image/vnd.microsoft.icon","");
        }
    }
    
    
    else if (element.localName == "body")
    {
        if (element.background != "")
        {
            if (menuAction == 2 || (menuAction == 1 && saveHTMLImagesAll) ||
                ((menuAction == 1 && !saveHTMLImagesAll) || menuAction == 0) && displayed)
            {
                if (element.background.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    rememberURL(element.background,baseuri,"image/png","");
                }
            }
        }
    }
    
    
    else if (element.localName == "img")
    {
        if (element.src != "")
        {
            if (menuAction == 2 || (menuAction == 1 && saveHTMLImagesAll) ||
                ((menuAction == 1 && !saveHTMLImagesAll) || menuAction == 0) && displayed)
            {
                if (element.src.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    rememberURL(element.src,baseuri,"image/png","");
                }
            }
        }
    }
    
    
    else if (element.localName == "input")
    {
        if (element.type.toLowerCase() == "image" && element.src != "")
        {
            if (menuAction == 2 || (menuAction == 1 && saveHTMLImagesAll) ||
                ((menuAction == 1 && !saveHTMLImagesAll) || menuAction == 0) && displayed)
            {
                if (element.src.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    rememberURL(element.src,baseuri,"image/png","");
                }
            }
        }
    }
    
    
    else if (element.localName == "audio")
    {
        if (element.src != "")
        {
            if (element.src == element.currentSrc)
            {
                if (menuAction == 2 || (menuAction == 1 && saveHTMLAudioVideo))
                {
                    if (element.src.substr(0,5).toLowerCase() != "data:")  
                    {
                        baseuri = element.ownerDocument.baseURI;
                        
                        rememberURL(element.src,baseuri,"audio/mpeg","");
                    }
                }
            }
        }
    }
    
    
    else if (element.localName == "video")
    {
        if (element.src != "")
        {
            if (element.src == element.currentSrc)
            {
                if (menuAction == 2 || (menuAction == 1 && saveHTMLAudioVideo))
                {
                    if (element.src.substr(0,5).toLowerCase() != "data:")  
                    {
                        baseuri = element.ownerDocument.baseURI;
                        
                        rememberURL(element.src,baseuri,"video/mp4","");
                    }
                }
            }
        }
        
        if (element.poster != "")
        {
            if (menuAction == 2 || (menuAction == 1 && saveHTMLAudioVideo))
            {
                if (menuAction == 2 || (menuAction == 1 && saveHTMLImagesAll) ||
                    ((menuAction == 1 && !saveHTMLImagesAll) || menuAction == 0) && displayed)
                {
                    if (element.poster.substr(0,5).toLowerCase() != "data:")  
                    {
                        baseuri = element.ownerDocument.baseURI;
                        
                        rememberURL(element.poster,baseuri,"image/png","");
                    }
                }
            }
        }
    }
    
    
    else if (element.localName == "source")
    {
        if (element.parentElement.localName == "audio" || element.parentElement.localName == "video")
        {
            if (element.src != "")
            {
                if (element.src == element.parentElement.currentSrc)
                {
                    if (menuAction == 2 || (menuAction == 1 && saveHTMLAudioVideo))
                    {
                        if (element.src.substr(0,5).toLowerCase() != "data:")  
                        {
                            baseuri = element.ownerDocument.baseURI;
                            
                            if (element.parentElement.localName == "audio") rememberURL(element.src,baseuri,"audio/mpeg","");
                            else if (element.parentElement.localName == "video") rememberURL(element.src,baseuri,"video/mp4","");
                        }
                    }
                }
            }
        }
    }
    
    
    else if (element.localName == "track")
    {
        if (element.src != "")
        {
            if (menuAction == 2 || (menuAction == 1 && saveHTMLAudioVideo))
            {
                if (element.src.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    charset = element.ownerDocument.characterSet;
                    
                    rememberURL(element.src,baseuri,"text/vtt",charset);
                }
            }
        }
    }
    
    
    else if (element.localName == "object")
    {
        if (element.data != "")
        {
            if (menuAction == 2 || (menuAction == 1 && saveHTMLObjectEmbed))
            {
                if (element.data.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    rememberURL(element.data,baseuri,"application/octet-stream","");
                }
            }
        }
    }
    
    
    else if (element.localName == "embed")
    {
        if (element.src != "")
        {
            if (menuAction == 2 || (menuAction == 1 && saveHTMLObjectEmbed))
            {
                if (element.src.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    rememberURL(element.src,baseuri,"application/octet-stream","");
                }
            }
        }
    }
    
    
    if (element.localName == "iframe" || element.localName == "frame")  
    {
        if (depth < maxFrameDepth)
        {
            nosource = nosource || (element.src == "" && element.srcdoc == "");
            
            try
            {
                if (element.contentDocument.documentElement != null)  
                {
                    findOtherResources(depth+1,element.contentWindow,element.contentDocument.documentElement,crossorigin,nosource);
                }
            }
            catch (e)  
            {
                if (retainCrossFrames)
                {
                    for (i = 0; i < crossFrameName.length; i++)
                    {
                        if (crossFrameName[i] == element.name) break;
                    }
                    
                    if (i != crossFrameName.length)
                    {
                        parser = new DOMParser();
                        framedoc = parser.parseFromString(crossFrameHTML[i],"text/html");
                        
                        findOtherResources(depth+1,window,framedoc.documentElement,true,nosource);
                    }
                }
            }
        }
    }
    else
    {
        for (i = 0; i < element.children.length; i++)
            if (element.children[i] != null)  
                findOtherResources(depth,frame,element.children[i],crossorigin,nosource);
                
        if (element.localName == "head" && depth == 0)
        {
            if (!iconFound)
            {
                baseuri = element.ownerDocument.baseURI;
                
                rememberURL("/favicon.ico",baseuri,"image/vnd.microsoft.icon","");
            }
        }
    }
}

function findCSSURLsInStyleSheet(csstext,baseuri,crossorigin)
{
    var i,regex,location,fontfamily,fontweight,fontstyle,fontstretch;
    var fontmatches,includewoff,usedfilefound,wofffilefound,srcregex,urlregex,fontfiletype;
    var matches = new Array();
    var propmatches = new Array();
    var srcmatches = new Array();
    var urlmatches = new Array();
    
    
    
    regex = new RegExp(/(?:@import\s*(?:url\(\s*)?(?:'|")?(?!data:)([^\s'";)]+)(?:'|")?(?:\s*\))?\s*;)|/.source +  
                       /(?:@font-face\s*({[^}]*}))|/.source +  
                       /(?:url\(\s*(?:'|")?(?!data:)([^\s'")]+)(?:'|")?\s*\))|/.source +  
                       /(?:"(?:\\"|[^"])*")|/.source +
                       /(?:'(?:\\'|[^'])*')|/.source +
                       /(?:\/\*(?:\*[^\\]|[^\*])*?\*\/)/.source,
                       "gi");
                       
    while ((matches = regex.exec(csstext)) != null)  
    {
        if (matches[0] && matches[0].substr(0,7).toLowerCase() == "@import")  
        {
            if (baseuri != null)
            {
                location = resolveURL(matches[1],baseuri);
                
                if (location != null)
                {
                    for (i = 0; i < resourceLocation.length; i++)
                        if (resourceLocation[i] == location && resourceStatus[i] == "success") break;
                    
                    if (i < resourceLocation.length)  
                    {
                        findCSSURLsInStyleSheet(resourceContent[i],resourceLocation[i],crossorigin);
                    }
                }
            }
        }
        else if (matches[0] && matches[0].substr(0,10).toLowerCase() == "@font-face")  
        {
            includewoff = (menuAction == 2 || (menuAction == 1 && saveCSSFontsWoff));
            
            propmatches = matches[2].match(/font-family\s*:\s*(?:'|")?([^'";}]*)(?:'|")?/i);
            if (propmatches == null) fontfamily = ""; else fontfamily = "\"" + propmatches[1] + "\"";
            
            propmatches = matches[2].match(/font-weight\s*:\s*([^\s;}]*)/i);
            if (propmatches == null) fontweight = "normal"; else fontweight = propmatches[1];
            
            propmatches = matches[2].match(/font-style\s*:\s*([^\s;}]*)/i);
            if (propmatches == null) fontstyle = "normal"; else fontstyle = propmatches[1];
            
            propmatches = matches[2].match(/font-stretch\s*:\s*([^\s;}]*)/i);
            if (propmatches == null) fontstretch = "normal"; else fontstretch = propmatches[1];
            
            fontmatches = false;
            
            document.fonts.forEach(  
            function(font)
            {
                if (font.status == "loaded")  
                {
                    if (font.family == fontfamily && font.weight == fontweight &&
                        font.style == fontstyle && font.stretch == fontstretch) fontmatches = true;  
                }
            });
            
            if (fontmatches)
            {
                usedfilefound = false;
                wofffilefound = false;
                
                srcregex = /src:([^;}]*)[;}]/gi;  
                
                while ((srcmatches = srcregex.exec(matches[2])) != null)  
                {
                    urlregex = /url\(\s*(?:'|")?(?!data:)([^\s'")]+)(?:'|")?\s*\)/gi;  
                    
                    while ((urlmatches = urlregex.exec(srcmatches[1])) != null)  
                    {
                        if (urlmatches[1].indexOf(".woff2") >= 0) fontfiletype = "woff2";  
                        else if (urlmatches[1].indexOf(".woff") >= 0 && urlmatches[1].indexOf(".woff2") < 0) fontfiletype = "woff";  
                        else if (urlmatches[1].indexOf(".ttf") >= 0) fontfiletype = "ttf";  
                        else if (urlmatches[1].indexOf(".otf") >= 0) fontfiletype = "otf";  
                        else if (urlmatches[1].indexOf(".svg") >= 0 && !isFirefox) fontfiletype = "svg";  
                        else fontfiletype = "";
                        
                        if (fontfiletype != "")
                        {
                            if (!usedfilefound)
                            {
                                usedfilefound = true;  
                                
                                if (fontfiletype == "woff") wofffilefound = true;
                                
                                rememberURL(urlmatches[1],baseuri,"application/font-woff","");
                            }
                            else if (includewoff && fontfiletype == "woff")
                            {
                                wofffilefound = true;  
                                
                                rememberURL(urlmatches[1],baseuri,"application/font-woff","");
                            }
                        }
                        
                        if (wofffilefound || (!includewoff && usedfilefound)) break;
                    }
                    
                    if (wofffilefound || (!includewoff && usedfilefound)) break;
                }
            }
        }
        else  if (matches[0].substr(0,4).toLowerCase() == "url(")  
        {
            if ((menuAction == 1 && saveCSSImagesAll) || (isFirefox && ffVersion <= 54 && crossorigin))
            {
                rememberURL(matches[3],baseuri,"image/png","");
            }
        }
        else if (matches[0].substr(0,1) == "\"") ;  
        else if (matches[0].substr(0,1) == "'") ;  
        else if (matches[0].substr(0,2) == "/*") ;  
    }
}

function rememberURL(url,baseuri,mimetype,charset)
{
    var i,location;
    
    if (savedPage) return -1;  
    
    if (baseuri != null)
    {
        location = resolveURL(url,baseuri);
        
        if (location != null)
        {
            for (i = 0; i < resourceLocation.length; i++)
                if (resourceLocation[i] == location) break;
            
            if (i == resourceLocation.length)  
            {
                resourceLocation[i] = location;
                resourceMimeType[i] = mimetype;  
                resourceCharSet[i] = charset;  
                resourceContent[i] = "";  
                resourceAllowOrigin[i] = "";  
                resourceStatus[i] = "pending";
                resourceRemembered[i] = 1;
                resourceReplaced[i] = 0;
                
                return i;
            }
            else resourceRemembered[i]++;  
        }
    }
    
    return -1;
}



function loadResources()
{
    var i,documentURL;
    
    timeStart[passNumber+3] = performance.now();
    
    resourceCount = 0;
    
    for (i = 0; i < resourceLocation.length; i++)
    {
        if (resourceStatus[i] == "pending") 
        {
            resourceCount++;
            
            documentURL = new URL(document.baseURI,"about:blank");
            
            chrome.runtime.sendMessage({ type: "loadResource", index: i, location: resourceLocation[i], pagescheme: documentURL.protocol });
        }
    }
    
    if (resourceCount <= 0)
    {
        timeFinish[passNumber+3] = performance.now();
    
        if (passNumber == 1) gatherOtherResources();
        else if (passNumber == 2) loadInfoBar();
    }
}

function loadSuccess(index,content,contenttype,alloworigin)
{
    var i,mimetype,charset,csstext,baseuri,regex,documentURL;
    var matches = new Array();
    
    resourceAllowOrigin[index] = "*";  
    
    
    matches = contenttype.match(/([^;]+)/i);
    if (matches != null) mimetype = matches[1].toLowerCase();
    else mimetype = "";
    
    matches = contenttype.match(/;charset=([^;]+)/i);
    if (matches != null) charset = matches[1].toLowerCase();
    else charset = "";
    
    
    switch (resourceMimeType[index].toLowerCase())  
    {
        case "application/font-woff":  
            
            resourceAllowOrigin[index] = alloworigin;  
            
        case "image/png":  
        case "image/vnd.microsoft.icon":  
        case "audio/mpeg":  
        case "video/mp4":  
        case "application/octet-stream":  
            
            if (mimetype != "") resourceMimeType[index] = mimetype;
            
            resourceContent[index] = content;
            
            break;
            
        case "application/javascript":  
            
            if (mimetype != "application/javascript" && mimetype != "application/x-javascript" && mimetype != "application/ecmascript" &&
                mimetype != "application/json" && mimetype != "text/javascript" && mimetype != "text/x-javascript" && mimetype != "text/json")
            {
                loadFailure(index);
                return;
            }
            
        case "text/vtt":  
            
            if (mimetype != "") resourceMimeType[index] = mimetype;
            if (charset != "") resourceCharSet[index] = charset;
            
            if (content.charCodeAt(0) == 0xEF && content.charCodeAt(1) == 0xBB && content.charCodeAt(2) == 0xBF)  
            {
                resourceCharSet[index] = "utf-8";
                content = content.substr(3);
            }
            
            if (resourceCharSet[index].toLowerCase() == "utf-8")
            {
                try
                {
                    resourceContent[index] = convertUTF8ToUTF16(content);  
                }
                catch (e)
                {
                    resourceCharSet[index] = "iso-8859-1";  
                    resourceContent[index] = content;
                }
            }
            else resourceContent[index] = content;  
            
            break;
            
        case "text/css":  
            
            if (mimetype != "text/css")  
            {
                loadFailure(index);
                return;
            }
            
            matches = content.match(/^@charset "([^"]+)";/i);
            if (matches != null) resourceCharSet[index] = matches[1];
            
            if (charset != "") resourceCharSet[index] = charset;
            
            if (content.charCodeAt(0) == 0xEF && content.charCodeAt(1) == 0xBB && content.charCodeAt(2) == 0xBF)  
            {
                resourceCharSet[index] = "utf-8";
                content = content.substr(3);
            }
            
            if (resourceCharSet[index].toLowerCase() == "utf-8")
            {
                try
                {
                    resourceContent[index] = convertUTF8ToUTF16(content);  
                }
                catch (e)
                {
                    resourceCharSet[index] = "iso-8859-1";  
                    resourceContent[index] = content;
                }
            }
            else resourceContent[index] = content;  
            
            
            csstext = resourceContent[index];
            
            baseuri = resourceLocation[index];
            
            regex = /@import\s*(?:url\(\s*)?(?:'|")?(?!data:)([^\s'";)]+)(?:'|")?(?:\s*\))?\s*;/gi;  
            
            while ((matches = regex.exec(csstext)) != null)  
            {
                i = rememberURL(matches[1],baseuri,"text/css",resourceCharSet[index]);
                
                if (i >= 0)
                {
                    resourceCount++;
                    
                    documentURL = new URL(document.baseURI,"about:blank");
                    
                    chrome.runtime.sendMessage({ type: "loadResource", index: i, location: resourceLocation[i], pagescheme: documentURL.protocol });
                }
            }
            
            break;
    }
    
    resourceStatus[index] = "success";
    
    if (--resourceCount <= 0)
    {
        timeFinish[passNumber+3] = performance.now();
        
        if (passNumber == 1) gatherOtherResources();
        else if (passNumber == 2) loadInfoBar(); 
    }
}

function loadFailure(index)
{
    resourceStatus[index] = "failure";
    
    if (--resourceCount <= 0)
    {
        timeFinish[passNumber+3] = performance.now();
        
        if (passNumber == 1) gatherOtherResources();
        else if (passNumber == 2) loadInfoBar();
    }
}



function loadInfoBar()
{
    loadPageLoader();
}

function loadPageLoader()
{
    var xhr;
    
    if (usePageLoader && !savedPage)
    {
        xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/javascript");
        xhr.open("GET",chrome.runtime.getURL("pageloader.js"),true);
        xhr.onload = complete;
        xhr.send();
    }
    else checkResources();
    
    function complete()
    {
        if (xhr.status == 200)
        {
            pageLoader = xhr.responseText.substr(xhr.responseText.indexOf('"use strict";'));  
            
            checkResources();
        }
    }
}



function checkResources()
{
    var i,dataurisize,skipcount,failcount,count;
    var skipurllist = new Array();
    var failurllist = new Array();
    
    
    if (!savedPage)
    {
        dataurisize = 0;
        skipcount = 0;
        failcount = 0;
        
        for (i = 0; i < resourceLocation.length; i++)
        {
            if (resourceCharSet[i] == "")  
            {
                count = usePageLoader ? 1 : resourceRemembered[i];
                
                if (resourceContent[i].length*count*(4/3) > maxResourceSize*1024*1024)  /* skip large and/or repeated resource */  
                {
                  skipcount++;
                  try { skipurllist.push(decodeURIComponent(resourceLocation[i])); }
                  catch (e) { skipurllist.push(resourceLocation[i]); }
                }
                else dataurisize += resourceContent[i].length*count*(4/3);  /* base64 expands by 4/3 */
            }
            
            if (resourceStatus[i] == "failure")
            {
                failcount++;
                try { failurllist.push(decodeURIComponent(resourceLocation[i])); }
                catch (e) { failurllist.push(resourceLocation[i]); }
            }
        }
        
        if (dataurisize > 200*1024*1024)  
        {
            alert("Cannot save page because the total size of resources exceeds 200MB.\n\n");
                  
            chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
            
            return;
        }
        
        if (skipcount > 0 && showWarning)
        {
            if (!confirm(skipcount + " of " + resourceLocation.length + " resources exceed maximum size and will not be saved.\n\n" ))
            {
                chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
                
                return;
            }
        }
        
        if (failcount > 0 && showWarning)
        {
            if (!confirm(failcount + " of " + resourceLocation.length + " resources could not be loaded and will not be saved.\n\n"))
            {
                chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
                
                return;
            }
        }
        
        if ((skipcount > 0 || failcount > 0) && showURLList)
        {
            showUnsavedResources(skipurllist,failurllist);
        }
        else enterComments();
    }
    else enterComments();
}

function showUnsavedResources(skipurllist,failurllist)
{
    var i,parser,unsaveddoc,container,div;
    
    function complete()
    {
        if (xhr.status == 200)
        {
            
            parser = new DOMParser();
            unsaveddoc = parser.parseFromString(xhr.responseText,"text/html");
            
            
            container = document.createElement("div");
            container.setAttribute("id","savepage-unsaved-panel-container");
            document.documentElement.appendChild(container);
            
            
            container.appendChild(unsaveddoc.getElementById("savepage-unsaved-panel-style"));
            container.appendChild(unsaveddoc.getElementById("savepage-unsaved-panel-overlay"));
            
            
            document.getElementById("savepage-unsaved-panel-okay").addEventListener("click",clickOkay,false);
            document.getElementById("savepage-unsaved-panel-cancel").addEventListener("click",clickCancel,false);
            
            
            if (skipurllist.length > 0)
            {
                document.getElementById("savepage-unsaved-panel-header").textContent = "Resources that exceed maximum size and will not be saved";
                
                for (i = 0; i < skipurllist.length; i++)
                {
                    div = document.createElement("div");
                    div.textContent = (i+1);
                    document.getElementById("savepage-unsaved-panel-nums").appendChild(div);
                    
                    div = document.createElement("div");
                    div.textContent = skipurllist[i];
                    document.getElementById("savepage-unsaved-panel-urls").appendChild(div);
                }
            }
            else clickOkay();
        }
    }
    
    function clickOkay()
    {
        var i,div;
        
        
        if (skipurllist.length > 0)
        {
            for (i = 0; i < skipurllist.length; i++)
            {
                document.getElementById("savepage-unsaved-panel-nums").removeChild(document.getElementById("savepage-unsaved-panel-nums").children[0]);
                document.getElementById("savepage-unsaved-panel-urls").removeChild(document.getElementById("savepage-unsaved-panel-urls").children[0]);
            }
            
            skipurllist.length = 0;
        }
        
        
        if (failurllist.length > 0)
        {
            document.getElementById("savepage-unsaved-panel-header").textContent = "Resources that could not be loaded and will not be saved";
            
            for (i = 0; i < failurllist.length; i++)
            {
                div = document.createElement("div");
                div.textContent = (i+1);
                document.getElementById("savepage-unsaved-panel-nums").appendChild(div);
                
                div = document.createElement("div");
                div.textContent = failurllist[i];
                document.getElementById("savepage-unsaved-panel-urls").appendChild(div);
            }
            
            failurllist.length = 0;
        }
        else
        {
            document.documentElement.removeChild(document.getElementById("savepage-unsaved-panel-container"));
            
            enterComments();
        }
    }
    
    function clickCancel()
    {
        document.documentElement.removeChild(document.getElementById("savepage-unsaved-panel-container"));
        
        chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
    }
}



function enterComments()
{
    var i,xhr,parser,commentsdoc,container,metanotes;
    
    generateHTML();
    
    function complete()
    {
    }
    
    function clickOkay()
    {
        enteredComments = document.getElementById("savepage-comments-panel-textarea").value;
        
        document.documentElement.removeChild(document.getElementById("savepage-comments-panel-container"));
        
        generateHTML();
    }
    
    function clickCancel()
    {
        document.documentElement.removeChild(document.getElementById("savepage-comments-panel-container"));
        
        chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
    }
}



function generateHTML()
{
    var i,j,totalscans,totalloads,maxstrsize,totalstrsize,mimetype,charset,htmlBlob,objectURL,documentURL,filename,datestr,text,link;
    var pathsegments = new Array();
    var date = new Date();
    
    for (i = 0; i < crossFrameName.length; i++)
    {
    }
    
    passNumber = 3;
    
    chrome.runtime.sendMessage({ type: "setSaveBadge", text: "SAVE", color: "#0000E0" });
    
    
    timeStart[3] = performance.now();
    
    extractHTML(0,window,document.documentElement,false,false);
    
    timeFinish[3] = performance.now();
    
    
    if (includeSummary)
    {
        totalscans = retainCrossFrames ? timeFinish[0]-timeStart[0] : 0;
        totalscans += timeFinish[1]-timeStart[1]+timeFinish[2]-timeStart[2]+timeFinish[3]-timeStart[3];
        totalloads = timeFinish[4]-timeStart[4]+timeFinish[5]-timeStart[5];
        
        htmlStrings[htmlStrings.length] = "\n\n<!--\n\n";
        
        if (retainCrossFrames) htmlStrings[htmlStrings.length] = "Pass 0 scan:  " + ("     " + Math.round(timeFinish[0]-timeStart[0])).substr(-6) + " ms\n";
        htmlStrings[htmlStrings.length] = "Pass 1 scan:  " + ("     " + Math.round(timeFinish[1]-timeStart[1])).substr(-6) + " ms\n";
        htmlStrings[htmlStrings.length] = "Pass 2 scan:  " + ("     " + Math.round(timeFinish[2]-timeStart[2])).substr(-6) + " ms\n";
        htmlStrings[htmlStrings.length] = "Pass 3 scan:  " + ("     " + Math.round(timeFinish[3]-timeStart[3])).substr(-6) + " ms\n";
        htmlStrings[htmlStrings.length] = "Total scans:  " + ("     " + Math.round(totalscans)).substr(-6) + " ms\n\n";
        
        htmlStrings[htmlStrings.length] = "Pass 1 loads: " + ("     " + Math.round(timeFinish[4]-timeStart[4])).substr(-6) + " ms\n";
        htmlStrings[htmlStrings.length] = "Pass 2 loads: " + ("     " + Math.round(timeFinish[5]-timeStart[5])).substr(-6) + " ms\n";
        htmlStrings[htmlStrings.length] = "Total loads:  " + ("     " + Math.round(totalloads)).substr(-6) + " ms\n\n";
        
        htmlStrings[htmlStrings.length] = "String count:     "  + ("    " + htmlStrings.length).substr(-5) + "\n";
        
        maxstrsize = totalstrsize = 0;
        
        for (i = 0; i < htmlStrings.length; i++)
        {
            totalstrsize += htmlStrings[i].length;
            
            if (htmlStrings[i].length > maxstrsize) maxstrsize = htmlStrings[i].length;
        }
        
        htmlStrings[htmlStrings.length] = "Max size:      "  + ("       " + maxstrsize).substr(-8) + "\n";
        htmlStrings[htmlStrings.length] = "Total size:   "  + ("        " + totalstrsize).substr(-9) + "\n\n";
        
        htmlStrings[htmlStrings.length] = "Resource count:    "  + ("   " + resourceLocation.length).substr(-4) + "\n\n";
        
        htmlStrings[htmlStrings.length] = "Refs  Reps  Status   MimeType    CharSet   ByteSize    URL\n\n";
        
        for (i = 0; i < resourceLocation.length; i++)
        {
            j = resourceMimeType[i].indexOf("/");
            
            mimetype = resourceMimeType[i].substr(0,j).substr(0,5);
            mimetype += "/";
            mimetype += resourceMimeType[i].substr(j+1,4);
            
            charset = (resourceCharSet[i] == "") ? "binary" : resourceCharSet[i];
            
            htmlStrings[htmlStrings.length] = ("    " + resourceRemembered[i]).substr(-4) + "  " +
                                              ("    " + resourceReplaced[i]).substr(-4) + "  " +
                                              resourceStatus[i] + "  " +
                                              (mimetype + "          ").substr(0,10) + "  " +
                                              (charset + "        ").substr(0,8) + "  " +
                                              ("        " + resourceContent[i].length).substr(-8) + "    " +
                                              resourceLocation[i] + "\n";
        }
        
        htmlStrings[htmlStrings.length] = "\n-->\n";
    }
    
    
    crossFrameName.length = 0;
    crossFrameURL.length = 0;
    crossFrameHTML.length = 0;
    
    resourceLocation.length = 0;
    resourceMimeType.length = 0;
    resourceCharSet.length = 0;
    resourceContent.length = 0;
    resourceAllowOrigin.length = 0;
    resourceStatus.length = 0;
    resourceRemembered.length = 0;
    resourceReplaced.length = 0;
    
    pageInfoBar = "";
    pageLoader = "";
    enteredComments = "";
    
    htmlBlob = new Blob( htmlStrings, { type: "text/html" });
    objectURL = window.URL.createObjectURL(htmlBlob);
    
    htmlStrings.length = 0;
    
    documentURL = new URL(document.baseURI,"about:blank");
    
    if (document.title == "")
    {
        pathsegments = documentURL.pathname.split("/");
        filename = pathsegments.pop();
        if (filename == "") filename = pathsegments.pop();
        
        filename = decodeURIComponent(filename);
        
        i = filename.lastIndexOf(".");
        if (i < 0) filename = filename + ".html";
        else filename = filename.substring(0,i) + ".html";
    }
    else filename = document.title + ".html";
    
    datestr = new Date(date.getTime()-(date.getTimezoneOffset()*60000)).toISOString();
    
    if (prefixFileName)
    {
        text = prefixText;
        
        text = text.replace(/%DOMAIN%/,documentURL.hostname);
        text = text.replace(/%DATE%/,datestr.substr(0,10));
        text = text.replace(/%TIME%/,datestr.substr(11,8).replace(/:/g,"-"));
        
        filename = text + filename;
    }
    
    if (suffixFileName)
    {
        text = suffixText;
        
        text = text.replace(/%DOMAIN%/,documentURL.hostname);
        text = text.replace(/%DATE%/,datestr.substr(0,10));
        text = text.replace(/%TIME%/,datestr.substr(11,8).replace(/:/g,"-"));
        
        i = filename.lastIndexOf(".");
        if (i < 0) filename = filename + text;
        else filename = filename.substring(0,i) + text + filename.substring(i);
    }
     
    if (action == "load"){
        link = document.createElement("a");
        link.download = filename;
        link.href = objectURL;
        document.body.appendChild(link);

        link.addEventListener("click",handleClick,true);
        
        link.click();  
        
        link.removeEventListener("click",handleClick,true);
        
        document.body.removeChild(link);
        
        window.setTimeout(
        function()
        {
            window.URL.revokeObjectURL(objectURL);
            
            chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
        },100);
        
        function handleClick(event)
        {
            event.stopPropagation();
        }
    }

    if (action == "save"){
        var reader = new FileReader();
                reader.readAsDataURL(htmlBlob); 
                reader.onloadend = function() {
                    let base64data = reader.result;    
                    chrome.runtime.sendMessage({ type: "addDb", id: filename, url: base64data})           
                }
    }
}

function extractHTML(depth,frame,element,crossorigin,nosource)
{
    var i,j,doctype,startTag,endTag,textContent,baseuri,location,csstext,origurl,datauri,origstr,htmltext,startindex,endindex,origdoc,parser,framedoc,target,text,date,state;
    var voidElements = new Array("area","base","br","col","command","embed","frame","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr");
    var htmlFrameStrings = new Array();
    var matches = new Array();
    
    
    startTag = "<" + element.localName;
    for (i = 0; i < element.attributes.length; i++)
    {
        if (element.attributes[i].name != "zoompage-fontsize")
        {
            startTag += " " + element.attributes[i].name;
            startTag += "=\"";
            startTag += element.attributes[i].value.replace(/"/g,"&quot;");
            startTag += "\"";
        }
    }
    startTag += ">";
    
    textContent = "";
    
    if (voidElements.indexOf(element.localName) >= 0) endTag = "";
    else endTag = "</" + element.localName + ">";
    
    
    if (element.hasAttribute("style"))
    {
        csstext = element.getAttribute("style");
        
        baseuri = element.ownerDocument.baseURI;
        
        csstext = replaceCSSURLs(csstext,baseuri,crossorigin);
        
        startTag = startTag.split("style=\"" + element.getAttribute("style").replace(/"/g,"&quot;") + "\"").join("style=\"" + csstext.replace(/"/g,"&quot;") + "\"");
    }
    
    
    if (element.localName == "script")
    {
        if (element.src == "")  
        {
            if ((menuAction == 1 && saveScripts) && !crossorigin && !nosource) textContent = element.textContent;
        }
        else   
        {
            if ((menuAction == 1 && saveScripts) && !crossorigin && !nosource)
            {
                if (element.src.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    origurl = element.getAttribute("src");
                    
                    datauri = replaceURL(origurl,baseuri,crossorigin);
                    
                    origstr = (datauri == origurl) ? "" : " data-savepage-src=\"" + origurl + "\"";
                    
                    startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
                }
            }
            else
            {
                origurl = element.getAttribute("src");
                
                origstr = " data-savepage-src=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"\"");
            }
        }
    }
    
    
    else if (element.localName == "style")
    {
        if (element.id == "zoompage-pageload-style" || element.id == "zoompage-zoomlevel-style" || element.id == "zoompage-fontsize-style")
        {
            startTag = "";
            endTag = "";
            textContent = "";
        }
        else
        {
            csstext = element.textContent;
            
            baseuri = element.ownerDocument.baseURI;
            
            textContent = replaceCSSURLsInStyleSheet(csstext,baseuri,crossorigin);
        }
    }
    
    
    else if (element.localName == "link")
    {
        if (element.rel.toLowerCase() == "stylesheet" && element.getAttribute("href") != "" && element.href != "")    
        {
            if (element.href.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                if (baseuri != null)
                {
                    location = resolveURL(element.href,baseuri);
                    
                    if (location != null)
                    {
                        for (i = 0; i < resourceLocation.length; i++)
                            if (resourceLocation[i] == location && resourceStatus[i] == "success") break;
                        
                        if (i < resourceLocation.length)  
                        {
                            
                            csstext = resourceContent[i];
                            
                            baseuri = element.href;
                            
                            csstext = replaceCSSURLsInStyleSheet(csstext,baseuri,crossorigin);
                            
                            startTag = "<style data-savepage-href=\"" + element.getAttribute("href") + "\"";
                            if (element.type != "") startTag += " type=\"" + element.type + "\"";
                            if (element.media != "") startTag += " media=\"" + element.media + "\"";
                            startTag += ">" + csstext + "</style>";
                            endTag = "";
                            
                            resourceReplaced[i]++;
                        }
                    }
                }
            }
        }
        else if ((element.rel.toLowerCase() == "icon" || element.rel.toLowerCase() == "shortcut icon") && element.href != "")
        {
            if (element.href.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                origurl = element.getAttribute("href");
                
                datauri = replaceURL(origurl,baseuri,crossorigin);
                
                origstr = (datauri == origurl) ? "" : " data-savepage-href=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ href="[^"]*"/,origstr + " href=\"" + datauri + "\"");
            }
        }
    }
    
    
    else if (element.localName == "base")
    {
        startTag = "";
        endTag = "";
    }
    
    
    else if (element.localName == "meta")
    {
        if (element.name.substr(0,8) == "savepage")
        {
            startTag = "";
            endTag = "";
        }
    }
    
    
    else if (element.localName == "div")
    {
        if (element.id == "savepage-pageinfo-bar-container")
        {
            startTag = "";
            endTag = "";
        }
    }
    
    
    else if (element.localName == "body")
    {
        if (element.background != "")
        {
            if (element.background.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                origurl = element.getAttribute("background");
                
                datauri = replaceURL(origurl,baseuri,crossorigin);
                
                origstr = (datauri == origurl) ? "" : " data-savepage-background=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ background="[^"]*"/,origstr + " background=\"" + datauri + "\"");
            }
        }
    }
    
    
    else if (element.localName == "img")
    {
        if (element.src != "")
        {
            if (element.src.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                origurl = element.getAttribute("src");
                
                datauri = replaceURL(origurl,baseuri,crossorigin);
                
                origstr = (datauri == origurl) ? "" : " data-savepage-src=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
            }
        }
        
        if (element.srcset != "")
        {
            origurl = element.getAttribute("srcset");
            
            origstr = " data-savepage-srcset=\"" + origurl + "\"";
            
            startTag = startTag.replace(/ srcset="[^"]*"/,origstr + " srcset=\"\"");
        }
    }
    
    
    else if (element.localName == "input")
    {
        if (element.type.toLowerCase() == "image" && element.src != "")
        {
            if (element.src.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                origurl = element.getAttribute("src");
                
                datauri = replaceURL(origurl,baseuri,crossorigin);
                
                origstr = (datauri == origurl) ? "" : " data-savepage-src=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
            }
        }
        
        if (element.type.toLowerCase() == "file" || element.type.toLowerCase() == "password")
        {
        }
        else if (element.type.toLowerCase() == "checkbox" || element.type.toLowerCase() == "radio")
        {
            if (element.checked) startTag = startTag.replace(/ checked="[^"]*"/," checked=\"\"");
            else startTag = startTag.replace(/ checked="[^"]*"/,"");
        }
        else
        {
            startTag = startTag.replace(/ value="[^"]*"/," value=\"" + element.value + "\"");
        }
    }
    
    
    else if (element.localName == "textarea")
    {
        textContent = element.value;
    }
    
    
    else if (element.localName == "option")
    {
        if (element.selected) startTag = startTag.replace(/ selected="[^"]*"/," selected=\"\"");
        else startTag = startTag.replace(/ selected="[^"]*"/,"");
    }
    
    
    else if (element.localName == "audio")
    {
        if (element.src != "")
        {
            if (element.src == element.currentSrc)
            {
                if (element.src.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    origurl = element.getAttribute("src");
                    
                    datauri = replaceURL(origurl,baseuri,crossorigin);
                    
                    origstr = (datauri == origurl) ? "" : " data-savepage-src=\"" + origurl + "\"";
                    
                    startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
                }
            }
            else if (removeUnsavedURLs)
            {
                origurl = element.getAttribute("src");
                
                origstr = " data-savepage-src=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"\"");
            }
        }
    }
    
    
    else if (element.localName == "video")
    {
        if (element.src != "")
        {
            if (element.src == element.currentSrc)
            {
                if (element.src.substr(0,5).toLowerCase() != "data:")  
                {
                    baseuri = element.ownerDocument.baseURI;
                    
                    origurl = element.getAttribute("src");
                    
                    datauri = replaceURL(origurl,baseuri,crossorigin);
                    
                    origstr = (datauri == origurl) ? "" : " data-savepage-src=\"" + origurl + "\"";
                    
                    startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
                }
            }
            else if (removeUnsavedURLs)
            {
                origurl = element.getAttribute("src");
                
                origstr = " data-savepage-src=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"\"");
            }
        }
        
        if (element.poster != "")
        {
            if (element.poster.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                origurl = element.getAttribute("poster");
                
                datauri = replaceURL(origurl,baseuri,crossorigin);
                
                origstr = (datauri == origurl) ? "" : " data-savepage-poster=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ poster="[^"]*"/,origstr + " poster=\"" + datauri + "\"");
            }
        }
    }
    
    
    else if (element.localName == "source")
    {
        if (element.parentElement.localName == "audio" || element.parentElement.localName == "video")
        {
            if (element.src != "")
            {
                if (element.src == element.parentElement.currentSrc)
                {
                    if (element.src.substr(0,5).toLowerCase() != "data:")  
                    {
                        baseuri = element.ownerDocument.baseURI;
                        
                        origurl = element.getAttribute("src");
                        
                        datauri = replaceURL(origurl,baseuri,crossorigin);
                        
                        origstr = (datauri == origurl) ? "" : " data-savepage-src=\"" + origurl + "\"";
                        
                        startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
                    }
                }
                else if (removeUnsavedURLs)
                {
                    origurl = element.getAttribute("src");
                    
                    origstr = " data-savepage-src=\"" + origurl + "\"";
                    
                    startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"\"");
                }
            }
        }
        else if (element.parentElement.localName == "picture")
        {
            if (element.srcset != "")
            {
                if (removeUnsavedURLs)
                {
                    origurl = element.getAttribute("srcset");
                    
                    origstr = " data-savepage-srcset=\"" + origurl + "\"";
                    
                    startTag = startTag.replace(/ srcset="[^"]*"/,origstr + " srcset=\"\"");
                }
            }
        }
    }
    
    
    else if (element.localName == "track")
    {
        if (element.src != "")
        {
            if (element.src.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                origurl = element.getAttribute("src");
                
                datauri = replaceURL(origurl,baseuri,crossorigin);
                
                origstr = (datauri == origurl) ? "" : " data-savepage-src=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
            }
        }
    }
    
    
    else if (element.localName == "object")
    {
        if (element.data != "")
        {
            if (element.data.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                origurl = element.getAttribute("data");
                
                datauri = replaceURL(origurl,baseuri,crossorigin);
                
                origstr = (datauri == origurl) ? "" : " data-savepage-data=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ data="[^"]*"/,origstr + " data=\"" + datauri + "\"");
            }
        }
    }
    
    
    else if (element.localName == "embed")
    {
        if (element.src != "")
        {
            if (element.src.substr(0,5).toLowerCase() != "data:")  
            {
                baseuri = element.ownerDocument.baseURI;
                
                origurl = element.getAttribute("src");
                
                datauri = replaceURL(origurl,baseuri,crossorigin);
                
                origstr = (datauri == origurl) ? "" : " data-savepage-src=\"" + origurl + "\"";
                
                startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
            }
        }
    }
    
    
    if (element.localName == "iframe" || element.localName == "frame")  
    {
        datauri = null;
        
        if (depth < maxFrameDepth)
        {
            nosource = nosource || (element.src == "" && element.srcdoc == "");
            
            try
            {
                if (element.contentDocument.documentElement != null)  
                {
                    startindex = htmlStrings.length;
                    
                    extractHTML(depth+1,element.contentWindow,element.contentDocument.documentElement,crossorigin,nosource);
                    
                    endindex = htmlStrings.length;
                    
                    htmlFrameStrings = htmlStrings.splice(startindex,endindex-startindex);
                    
                    htmltext = htmlFrameStrings.join("");
                    
                    datauri = "data:text/html;charset=utf-8," + encodeURIComponent(htmltext);
                    
                    startTag = startTag.replace(/(<iframe|<frame)/,"$1 data-savepage-sameorigin=\"\"");
                    
                    if (element.src != "")
                    {
                        origurl = element.getAttribute("src");
                        
                        origstr = " data-savepage-src=\"" + origurl + "\"";
                        
                        startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
                    }
                    else startTag = startTag.replace(/(<iframe|<frame)/,"$1 src=\"" + datauri + "\"");
                    
                    if (element.hasAttribute("srcdoc"))
                    {
                        origdoc = element.getAttribute("srcdoc");
                        
                        origstr = " data-savepage-srcdoc=\"" + origdoc + "\"";
                        
                        startTag = startTag.replace(/ srcdoc="[^"]*"/,origstr);
                    }
                }
            }
            catch (e)  
            {
                if (retainCrossFrames)
                {
                    for (i = 0; i < crossFrameName.length; i++)
                    {
                        if (crossFrameName[i] == element.name) break;
                    }
                    
                    if (i != crossFrameName.length)
                    {
                        parser = new DOMParser();
                        framedoc = parser.parseFromString(crossFrameHTML[i],"text/html");
                        
                        startindex = htmlStrings.length;
                        
                        extractHTML(depth+1,window,framedoc.documentElement,true,nosource);
                        
                        endindex = htmlStrings.length;
                        
                        htmlFrameStrings = htmlStrings.splice(startindex,endindex-startindex);
                        
                        htmltext = htmlFrameStrings.join("");
                        
                        datauri = "data:text/html;charset=utf-8," + encodeURIComponent(htmltext);
                        
                        startTag = startTag.replace(/(<iframe|<frame)/,"$1 data-savepage-crossorigin=\"\"");
                        
                        if (element.src != "")
                        {
                            origurl = element.getAttribute("src");
                            
                            origstr = " data-savepage-src=\"" + origurl + "\"";
                            
                            startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"" + datauri + "\"");
                        }
                        else startTag = startTag.replace(/(<iframe|<frame)/,"$1 src=\"" + datauri + "\"");
                        
                        if (element.hasAttribute("srcdoc"))
                        {
                            origdoc = element.getAttribute("srcdoc");
                            
                            origstr = " data-savepage-srcdoc=\"" + origdoc + "\"";
                            
                            startTag = startTag.replace(/ srcdoc="[^"]*"/,origstr);
                        }
                    }
                }
            }
        }
        
        if (element.src != "")
        {
            if (datauri == null)
            {
                if (removeUnsavedURLs)
                {
                    origurl = element.getAttribute("src");
                    
                    origstr = " data-savepage-src=\"" + origurl + "\"";
                    
                    startTag = startTag.replace(/ src="[^"]*"/,origstr + " src=\"\"");
                }
            }
        }
        
        if (element.localName == "iframe") htmlStrings[htmlStrings.length] = startTag + endTag;
        else htmlStrings[htmlStrings.length] = startTag;
    }
    else
    {
        if (element.localName == "html")
        {
            
            doctype = element.ownerDocument.doctype;
            
            if (doctype != null)
            {
                htmltext = '<!DOCTYPE ' + doctype.name + (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"' : '') +
                           ((doctype.systemId && !doctype.publicId) ? ' SYSTEM' : '') + (doctype.systemId ? ' "' + doctype.systemId + '"' : '') + '>';
                
                htmlStrings[htmlStrings.length] = htmltext;
            }
        }
        
        htmlStrings[htmlStrings.length] = startTag;
        
        if (element.localName == "head")
        {
            
            if (element.ownerDocument.head.querySelector("base") != null) target = element.ownerDocument.head.querySelector("base").target;
            else target = "";
            
            htmltext = "\n";
            htmltext += "<base href=\"" + element.ownerDocument.baseURI + "\"";
            if (target != "") htmltext += " target=\"" + target + "\"";
            htmltext += ">\n";
            
            htmlStrings[htmlStrings.length] = htmltext;
        }
        
        if (voidElements.indexOf(element.localName) >= 0) ;  
        else if (element.localName == "style" || (element.localName == "script" && element.src == ""))  
        {
            htmlStrings[htmlStrings.length] = textContent;
        }
        else if (element.localName == "textarea")  
        {
            textContent = textContent.replace(/&/g,"&amp;");
            textContent = textContent.replace(/</g,"&lt;");
            textContent = textContent.replace(/>/g,"&gt;");
            
            htmlStrings[htmlStrings.length] = textContent;
        }
        else
        {
            for (i = 0; i < element.childNodes.length; i++)
            {
                if (element.childNodes[i] != null)  
                {
                    if (element.childNodes[i].nodeType == 1)  
                    {
                        extractHTML(depth,frame,element.childNodes[i],crossorigin,nosource);
                    }
                    else if (element.childNodes[i].nodeType == 3)  
                    {
                        text = element.childNodes[i].textContent;
                        
                        text = text.replace(/&/g,"&amp;");
                        text = text.replace(/</g,"&lt;");
                        text = text.replace(/>/g,"&gt;");
                        
                        htmlStrings[htmlStrings.length] = text;
                    }
                    else if (element.childNodes[i].nodeType == 8)  
                    {
                        htmlStrings[htmlStrings.length] = "<!--" + element.childNodes[i].textContent + "-->";
                    }
                }
            }
        }
        
        if (element.localName == "head" && depth == 0)
        {
            
            if (!iconFound)
            {
                baseuri = element.ownerDocument.baseURI;
                
                datauri = replaceURL("/favicon.ico",baseuri,crossorigin);
                
                htmltext = "\n";
                htmltext += "<link rel=\"icon\" href=\"" + datauri + "\">\n";
                
                htmlStrings[htmlStrings.length] = htmltext;
            }
            
            
            if (usePageLoader && !savedPage)
            {
                htmlStrings[htmlStrings.length] = "\n<script id=\"savepage-pageloader\" type=\"application/javascript\">\n";
                htmlStrings[htmlStrings.length] = "savepage_PageLoader(" + maxFrameDepth + ");\n";
                htmlStrings[htmlStrings.length] = pageLoader.substr(0,pageLoader.length-1);  
                htmlStrings[htmlStrings.length] = "\n";
                for (i = 0; i < resourceLocation.length; i++) 
                {
                    if (resourceStatus[i] == "success" && resourceCharSet[i] == "")  
                    {
                        htmlStrings[htmlStrings.length] = "resourceMimeType[" + i + "] = \"" + resourceMimeType[i] + "\"; ";
                        htmlStrings[htmlStrings.length] = "resourceBase64Data[" + i + "] = \"" + btoa(resourceContent[i]) + "\";\n";
                    }
                }
                htmlStrings[htmlStrings.length] = "}\n</script>";
            }
            
            
            date = new Date();
            
            if (menuAction == 0)
            {
                state = "Basic Items;";
                if (usePageLoader && !savedPage) state += " Used page loader;";
                if (retainCrossFrames) state += " Retained cross-origin frames;";
                if (removeUnsavedURLs) state += " Removed unsaved URLs;";
                state += " Max frame depth = " + maxFrameDepth + ";";
                state += " Max resource size = " + maxResourceSize + "MB;";
                state += " Max resource time = " + maxResourceTime + "s;";
            }
            else if (menuAction == 1)
            {
                state = "Chosen Items;";
                if (saveHTMLImagesAll) state += " HTML image files (all);";
                if (saveHTMLAudioVideo) state += " HTML audio & video files;";
                if (saveHTMLObjectEmbed) state += " HTML object & embed files;";
                if (saveCSSImagesAll) state += " CSS image files (all);";
                if (saveCSSFontsWoff) state += " CSS font files (woff for any browser);";
                if (saveScripts) state += " Scripts (in same-origin frames);";
                if (usePageLoader && !savedPage) state += " Used page loader;";
                if (retainCrossFrames) state += " Retained cross-origin frames;";
                if (removeUnsavedURLs) state += " Removed unsaved URLs;";
                state += " Max frame depth = " + maxFrameDepth + ";";
                state += " Max resource size = " + maxResourceSize + "MB;";
                state += " Max resource time = " + maxResourceTime + "s;";
            }
            else if (menuAction == 2)
            {
                state = "Standard Items;";
                if (usePageLoader && !savedPage) state += " Used page loader;";
                if (retainCrossFrames) state += " Retained cross-origin frames;";
                if (removeUnsavedURLs) state += " Removed unsaved URLs;";
                state += " Max frame depth = " + maxFrameDepth + ";";
                state += " Max resource size = " + maxResourceSize + "MB;";
                state += " Max resource time = " + maxResourceTime + "s;";
            }
            
            htmltext = "\n";
            htmltext += "<meta name=\"savepage-url\" content=\"" + decodeURIComponent(document.URL) + "\">\n";
            htmltext += "<meta name=\"savepage-title\" content=\"" + document.title + "\">\n";
            htmltext += "<meta name=\"savepage-date\" content=\"" + date.toString() + "\">\n";
            htmltext += "<meta name=\"savepage-state\" content=\"" + state + "\">\n";
            htmltext += "<meta name=\"savepage-version\" content=\"" + chrome.runtime.getManifest().version + "\">\n";
            htmltext += "<meta name=\"savepage-comments\" content=\"" + enteredComments + "\">\n";
            
            htmlStrings[htmlStrings.length] = htmltext;
        }
        
        if (element.localName == "body" && depth == 0)
        {
            if (includeInfoBar)
            {
                
                date = new Date();
                
                htmltext = pageInfoBar;
                
                htmltext = htmltext.replace(/%URL%/g,document.URL);
                htmltext = htmltext.replace(/%DECODED-URL%/g,decodeURIComponent(document.URL));
                htmltext = htmltext.replace(/%DATE%/g,date.toDateString().substr(8,2) + " " + date.toDateString().substr(4,3) + " " + date.toDateString().substr(11,4));
                htmltext = htmltext.replace(/%TIME%/g,date.toTimeString().substr(0,8));
                
                htmlStrings[htmlStrings.length] = htmltext;
            }
        }
        
        htmlStrings[htmlStrings.length] = endTag;
    }
}

function replaceCSSURLsInStyleSheet(csstext,baseuri,crossorigin)
{
    var regex;
    var matches = new Array();
    
    
    regex = new RegExp(/(?:( ?)@import\s*(?:url\(\s*)?(?:'|")?(?!data:)([^\s'";)]+)(?:'|")?(?:\s*\))?\s*;)|/.source +  
                       /(?:( ?)url\(\s*(?:'|")?(?!data:)([^\s'")]+)(?:'|")?\s*\))|/.source +  
                       /(?:"(?:\\"|[^"])*")|/.source +
                       /(?:'(?:\\'|[^'])*')|/.source +
                       /(?:\/\*(?:\*[^\\]|[^\*])*?\*\/)/.source,
                       "gi");
    
    csstext = csstext.replace(regex,_replaceCSSURLOrImportStyleSheet);
    
    return csstext;
    
    function _replaceCSSURLOrImportStyleSheet(match,p1,p2,p3,p4,offset,string)
    {
        var i,location,csstext,datauri,origstr;
        
        if (match.trim().substr(0,7).toLowerCase() == "@import")  
        {
            if (baseuri != null)
            {
                location = resolveURL(p2,baseuri);
                
                if (location != null)
                {
                    for (i = 0; i < resourceLocation.length; i++)
                        if (resourceLocation[i] == location && resourceStatus[i] == "success") break;
                    
                    if (i < resourceLocation.length)  
                    {
                        
                        csstext = replaceCSSURLsInStyleSheet(resourceContent[i],resourceLocation[i],crossorigin);
                        
                        return p1 + "/*savepage-import-url=" + p2 + "*/" + p1 + csstext;
                    }
                }
            }
            
            if (removeUnsavedURLs) return p1 + "/*savepage-import-url=" + p2 + "*/" + p1;
            else return match;  
        }
        else if (match.trim().substr(0,4).toLowerCase() == "url(")  
        {
            datauri = replaceURL(p4,baseuri,crossorigin);
            
            origstr = (datauri == p4) ? p3 : p3 + "/*savepage-url=" + p4 + "*/" + p3;
            
            return origstr + "url(" + datauri + ")";
        }
        else if (match.substr(0,1) == "\"") return match;  
        else if (match.substr(0,1) == "'") return match;  
        else if (match.substr(0,2) == "/*") return match;  
    }
}

function replaceCSSURLs(csstext,baseuri,crossorigin)
{
    var regex;
    
    regex = /( ?)url\(\s*(?:'|")?(?!data:)([^\s'")]+)(?:'|")?\s*\)/gi;  
        
    csstext = csstext.replace(regex,_replaceCSSURL);
    
    return csstext;
    
    function _replaceCSSURL(match,p1,p2,offset,string)
    {
        var datauri,origstr;
        
        datauri = replaceURL(p2,baseuri,crossorigin);
        
        origstr = (datauri == p2) ? p1 : p1 + "/*savepage-url=" + p2 + "*/" + p1;
        
        return origstr + "url(" + datauri + ")";
    }
}

function replaceURL(url,baseuri,crossorigin)
{
    var i,location,count,resourceURL,frameURL;
    
    if (savedPage) return url;  
    
    if (baseuri != null)
    {
        location = resolveURL(url,baseuri);
        
        if (location != null)
        {
            for (i = 0; i < resourceLocation.length; i++)
                if (resourceLocation[i] == location && resourceStatus[i] == "success") break;
            
            if (i < resourceLocation.length)
            {
                if (resourceAllowOrigin[i] != "*")  
                {
                    
                    resourceURL = new URL(location,"about:blank");
                    frameURL = new URL(baseuri,"about:blank");
                    
                    if (resourceURL.origin != frameURL.origin &&  
                        (resourceAllowOrigin[i] == "" || resourceAllowOrigin[i] != frameURL.origin))  
                    {
                        if (removeUnsavedURLs) return "";  
                        else return url;  
                    }
                }
                
                if (resourceCharSet[i] == "")  
                {
                    count = usePageLoader ? 1 : resourceRemembered[i];
                    
                    if (resourceContent[i].length*count*(4/3) > maxResourceSize*1024*1024)  /* skip large and/or repeated resource */  
                    {
                        if (removeUnsavedURLs) return "";  
                        else return url;  
                    }
                    
                    resourceReplaced[i]++;
                    
                    if (usePageLoader && !crossorigin)
                    {
                        return "data:" + resourceMimeType[i] + ";resource=" + i + ";base64,";  
                    }
                    
                    return "data:" + resourceMimeType[i] + ";base64," + btoa(resourceContent[i]);  
                }
                else  
                {
                    resourceReplaced[i]++;
                    
                    return "data:" + resourceMimeType[i] + ";charset=utf-8," + encodeURIComponent(resourceContent[i]);  
                }
            }
        }
    }
    
    if (removeUnsavedURLs) return "";  
    else return url;  
}



function resolveURL(url,baseuri)
{
    var resolvedURL;
    
    try
    {
        resolvedURL = new URL(url,baseuri);
    }
    catch (e)
    {
        return null;  
    }
    
    return resolvedURL.href;
}

function convertUTF8ToUTF16(utf8str)
{
    var i,byte1,byte2,byte3,byte4,codepoint,utf16str;
    
    
    i = 0;
    utf16str = "";
    
    while (i < utf8str.length)
    {
        byte1 = utf8str.charCodeAt(i++);
        
        if ((byte1 & 0x80) == 0x00)
        {
            utf16str += String.fromCharCode(byte1);  
        }
        else if ((byte1 & 0xE0) == 0xC0)
        {
            byte2 = utf8str.charCodeAt(i++);
            
            codepoint = ((byte1 & 0x1F) << 6) + (byte2 & 0x3F);
            
            utf16str += String.fromCodePoint(codepoint);  
        }
        else if ((byte1 & 0xF0) == 0xE0)
        {
            byte2 = utf8str.charCodeAt(i++);
            byte3 = utf8str.charCodeAt(i++);
            
            codepoint = ((byte1 & 0x0F) << 12) + ((byte2 & 0x3F) << 6) + (byte3 & 0x3F);
            
            utf16str += String.fromCodePoint(codepoint);  
        }
        else if ((byte1 & 0xF8) == 0xF0)
        {
            byte2 = utf8str.charCodeAt(i++);
            byte3 = utf8str.charCodeAt(i++);
            byte4 = utf8str.charCodeAt(i++);
            
            codepoint = ((byte1 & 0x07) << 18) + ((byte2 & 0x3F) << 12) + ((byte3 & 0x3F) << 6) + (byte4 & 0x3F);
            
            utf16str += String.fromCodePoint(codepoint);  
        }
    }
    
    return utf16str;
}



function viewSavedPageInfo()
{
    var i,xhr,parser,pageinfodoc,container,metaurl,metatitle,metadate,metastate,metaversion,metacomments;
    
    function complete()
    {
        
    }
    
    function clickOpenURL()
    {
        window.open(metaurl);
    }
    
    function clickOkay()
    {
        document.documentElement.removeChild(document.getElementById("savepage-pageinfo-panel-container"));
    }
}



function removePageLoader()
{
    var resourceBlobURL = new Array();
    var resourceMimeType = new Array();
    var resourceCharSet = new Array();
    var resourceContent = new Array();
    var resourceStatus = new Array();
    var resourceRemembered = new Array();
    
    var resourceCount;
    
    gatherBlobResources();
    
    
    function gatherBlobResources()
    {
        chrome.runtime.sendMessage({ type: "setSaveBadge", text: "REM", color: "#FF8000" });
        
        findBlobResources(0,window,document.documentElement);
        
        loadBlobResources();
    }
    
    function findBlobResources(depth,frame,element)
    {
        var i,csstext,regex;
        var matches = new Array();
        
        if (element.hasAttribute("style"))
        {
            csstext = element.style.cssText;
            regex = /url\(\s*(?:'|")?(blob:[^\s'")]+)(?:'|")?\s*\)/gi;
            while ((matches = regex.exec(csstext)) != null) rememberBlobURL(matches[1],"image/png","");
        }
        
        if (element.localName == "script")
        {
        }
        else if (element.localName == "style")
        {
            csstext = element.textContent;
            regex = /url\(\s*(?:'|")?(blob:[^\s'")]+)(?:'|")?\s*\)/gi;
            while ((matches = regex.exec(csstext)) != null) rememberBlobURL(matches[1],"image/png","");
        }
        else if (element.localName == "link" && (element.rel.toLowerCase() == "icon" || element.rel.toLowerCase() == "shortcut icon"))
        {
            if (element.href.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.href,"image/vnd.microsoft.icon","");
        }
        else if (element.localName == "body")
        {
            if (element.background.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.background,"image/png","");
        }
        else if (element.localName == "img")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.src,"image/png","");
        }
        else if (element.localName == "input" && element.type.toLowerCase() == "image")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.src,"image/png","");
        }
        else if (element.localName == "audio")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.src,"audio/mpeg","");
        }
        else if (element.localName == "video")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.src,"video/mp4","");
            if (element.poster.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.poster,"image/png","");
        }
        else if (element.localName == "source")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:")
            {
                if (element.parentElement.localName == "audio") rememberBlobURL(element.src,"audio/mpeg","");
                else if (element.parentElement.localName == "video") rememberBlobURL(element.src,"video/mp4","");
            }
        }
        else if (element.localName == "track")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.src,"text/vtt","utf-8");
        }
        else if (element.localName == "object")
        {
            if (element.data.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.data,"application/octet-stream","");
        }
        else if (element.localName == "embed")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.src,"application/octet-stream","");
        }
        
        
        if (element.localName == "iframe" || element.localName == "frame")  
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") rememberBlobURL(element.src,"text/html","utf-8");
            
            if (depth < maxFrameDepth)
            {
                try
                {
                    if (element.contentDocument.documentElement != null)  
                    {
                        findBlobResources(depth+1,element.contentWindow,element.contentDocument.documentElement);
                    }
                }
                catch (e) {}  
            }
        }
        else
        {
            for (i = 0; i < element.children.length; i++)
                if (element.children[i] != null)  
                    findBlobResources(depth,frame,element.children[i]);
        }
    }
    
    function rememberBlobURL(bloburl,mimetype,charset)
    {
        var i;
        
        for (i = 0; i < resourceBlobURL.length; i++)
            if (resourceBlobURL[i] == bloburl) break;
        
        if (i == resourceBlobURL.length)  
        {
            resourceBlobURL[i] = bloburl;
            resourceMimeType[i] = mimetype;  
            resourceCharSet[i] = charset;  
            resourceContent[i] = "";  
            resourceStatus[i] = "pending";
            resourceRemembered[i] = 1;
        }
        else resourceRemembered[i]++;  
    }
    
    
    function loadBlobResources()
    {
        var i,xhr;
        
        resourceCount = 0;
        
        for (i = 0; i < resourceBlobURL.length; i++)
        {
            if (resourceStatus[i] == "pending") 
            {
                resourceCount++;
                
                try
                {
                    xhr = new XMLHttpRequest();
                    
                    xhr.open("GET",resourceBlobURL[i],true);
                    xhr.setRequestHeader("Cache-Control","no-store");
                    xhr.responseType = "arraybuffer";
                    xhr.timeout = 1000;
                    xhr._resourceIndex = i;
                    xhr.onload = loadSuccess;
                    xhr.onerror = loadFailure;
                    xhr.ontimeout = loadFailure;
                    
                    xhr.send();  
                }
                catch(e)
                {
                    resourceStatus[i] = "failure";
                    
                    --resourceCount;
                }
            }
        }
        
        if (resourceCount <= 0) substituteBlobResources();
    }
    
    function loadSuccess()
    {
        var i,binaryString,contenttype,mimetype,charset;
        var byteArray = new Uint8Array(this.response);
        var matches = new Array();
        
        if (this.status == 200)
        {
            binaryString = "";
            for (i = 0; i < byteArray.byteLength; i++) binaryString += String.fromCharCode(byteArray[i]);
            
            contenttype = this.getResponseHeader("Content-Type");
            if (contenttype == null) contenttype = "";
            
            matches = contenttype.match(/([^;]+)/i);
            if (matches != null) mimetype = matches[1].toLowerCase();
            else mimetype = "";
            
            matches = contenttype.match(/;charset=([^;]+)/i);
            if (matches != null) charset = matches[1].toLowerCase();
            else charset = "";
            
            switch (resourceMimeType[this._resourceIndex].toLowerCase())  
            {
                case "image/png":  
                case "image/vnd.microsoft.icon":  
                case "audio/mpeg":  
                case "video/mp4":  
                case "application/octet-stream":  
                
                    if (mimetype != "") resourceMimeType[this._resourceIndex] = mimetype;
                    
                    resourceContent[this._resourceIndex] = binaryString;
                    
                    break;
                    
               case "text/vtt":  
               case "text/html":  
                    
                    if (mimetype != "") resourceMimeType[this._resourceIndex] = mimetype;
                    if (charset != "") resourceCharSet[this._resourceIndex] = charset;
                    
                    resourceContent[this._resourceIndex] = binaryString;
                    
                    break;
            }
            
            resourceStatus[this._resourceIndex] = "success";
        }
        else resourceStatus[this._resourceIndex] = "failure";
        
        if (--resourceCount <= 0) substituteBlobResources();
    }
    
    function loadFailure()
    {
        resourceStatus[this._resourceIndex] = "failure";
        
        if (--resourceCount <= 0) substituteBlobResources();
    }
    
    
    function substituteBlobResources()
    {
        var i,dataurisize,skipcount,failcount,count,script;
        
        
        dataurisize = 0;
        skipcount = 0;
        
        for (i = 0; i < resourceBlobURL.length; i++)
        {
            if (resourceCharSet[i] == "")  
            {
                count = resourceRemembered[i];
                
                if (resourceContent[i].length*count*(4/3) > maxResourceSize*1024*1024) skipcount++;  /* skip large and/or repeated resource */  
                else dataurisize += resourceContent[i].length*count*(4/3);  /* base64 expands by 4/3 */
            }
        }
        
        if (dataurisize > 200*1024*1024)  
        {
            alert("Cannot remove page loader because the total size of resources exceeds 200MB.\n\n" +
                  "Try this suggestion:\n\n" +
                  "  • Reduce the 'Maximum size allowed for a resource' option value.\n\n");
                  
            chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
            
            return;
        }
        
        if (skipcount > 0 && showWarning)
        {
            if (!confirm(skipcount + " resources exceed maximum size and will be discarded.\n\n" +
                  "Try this suggestion:\n\n" +
                  "  • Reduce the 'Maximum size allowed for a resource' option value.\n\n"))
            {
                chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
                
                return;
            }
        }
        
        
        script = document.getElementById("savepage-pageloader");
        script.parentElement.removeChild(script);
        
        
        for (i = 0; i < resourceBlobURL.length; i++) 
            window.URL.revokeObjectURL(resourceBlobURL[i]);
        
        
        replaceBlobResources(0,window,document.documentElement);  
        
        savedPageLoader = false;
        
        chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
    }
    
    function replaceBlobResources(depth,frame,element)
    {
        var i,csstext,regex;
        
        if (element.hasAttribute("style"))
        {
            csstext = element.style.cssText;
            regex = /url\(\s*(?:'|")?(blob:[^\s'")]+)(?:'|")?\s*\)/gi;
            element.style.cssText = csstext.replace(regex,replaceCSSBlobURL);
        }
        
        if (element.localName == "script")
        {
        }
        else if (element.localName == "style")
        {
            csstext = element.textContent;
            regex = /url\(\s*(?:'|")?(blob:[^\s'")]+)(?:'|")?\s*\)/gi;
            element.textContent = csstext.replace(regex,replaceCSSBlobURL);
        }
        else if (element.localName == "link" && (element.rel.toLowerCase() == "icon" || element.rel.toLowerCase() == "shortcut icon"))
        {
            if (element.href.substr(0,5).toLowerCase() == "blob:") element.href = replaceBlobURL(element.href);
        }
        else if (element.localName == "body")
        {
            if (element.background.substr(0,5).toLowerCase() == "blob:") element.background = replaceBlobURL(element.background);
        }
        else if (element.localName == "img")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") element.src = replaceBlobURL(element.src);
        }
        else if (element.localName == "input" && element.type.toLowerCase() == "image")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") element.src = replaceBlobURL(element.src);
        }
        else if (element.localName == "audio")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:")
            {
                element.src = replaceBlobURL(element.src);
                element.load();
            }
        }
        else if (element.localName == "video")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:")
            {
                element.src = replaceBlobURL(element.src);
                element.load();
            }
            if (element.poster.substr(0,5).toLowerCase() == "blob:") element.poster = replaceBlobURL(element.poster);
        }
        else if (element.localName == "source")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:")
            {
                element.src = replaceBlobURL(element.src);
                element.parentElement.load();
            }
        }
        else if (element.localName == "track")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") element.src = replaceBlobURL(element.src);
        }
        else if (element.localName == "object")
        {
            if (element.data.substr(0,5).toLowerCase() == "blob:") element.data = replaceBlobURL(element.data);
        }
        else if (element.localName == "embed")
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") element.src = replaceBlobURL(element.src);
        }
        
        
        if (element.localName == "iframe" || element.localName == "frame")  
        {
            if (element.src.substr(0,5).toLowerCase() == "blob:") element.src = replaceBlobURL(element.src);
            
            if (depth < maxFrameDepth)
            {
                try
                {
                    if (element.contentDocument.documentElement != null)  
                    {
                        replaceBlobResources(depth+1,element.contentWindow,element.contentDocument.documentElement);
                    }
                }
                catch (e) {}  
            }
        }
        else
        {
            for (i = 0; i < element.children.length; i++)
                if (element.children[i] != null)  
                    replaceBlobResources(depth,frame,element.children[i]);
        }
    }
    
    function replaceCSSBlobURL(match,p1,offset,string)
    {
        return "url(" + replaceBlobURL(p1) + ")";
    }
    
    function replaceBlobURL(bloburl)
    {
        var i,count;
        
        for (i = 0; i < resourceBlobURL.length; i++)
            if (resourceBlobURL[i] == bloburl && resourceStatus[i] == "success") break;
        
        if (i < resourceBlobURL.length)
        {
            if (resourceCharSet[i] == "")  
            {
                count = resourceRemembered[i];
                
                if (resourceContent[i].length*count*(4/3) > maxResourceSize*1024*1024) return bloburl;  /* skip large and/or repeated resource */  
                
                return "data:" + resourceMimeType[i] + ";base64," + btoa(resourceContent[i]);  
            }
            else  
            {
                return "data:" + resourceMimeType[i] + ";charset=utf-8," + encodeURIComponent(resourceContent[i]);  
            }
        }
        
        return bloburl;
    }
}



function extractSavedPageMedia(srcurl)
{
    chrome.runtime.sendMessage({ type: "setSaveBadge", text: "EXT", color: "#00A000" });
    
    if (!extract(0,window,document.documentElement)) alert("Image/Audio/Video element not found.");
    
    chrome.runtime.sendMessage({ type: "setSaveBadge", text: "", color: "#000000" });
    
    function extract(depth,frame,element)
    {
        var i,baseuri,location,mediaURL,filename,datestr,text,link;
        var pathsegments = new Array();
        var date = new Date();
        
        if (element.localName == "img" || element.localName == "audio" || element.localName == "video" || element.localName == "source")
        {
            if (element.src == srcurl)  
            {
                baseuri = element.ownerDocument.baseURI;
                
                if (baseuri != null)
                {
                    location = resolveURL(element.getAttribute("data-savepage-src"),baseuri);
                    
                    if (location != null)
                    {
                        mediaURL = new URL(location,"about:blank");
                        
                        pathsegments = mediaURL.pathname.split("/");
                        filename = pathsegments.pop();
                        if (filename == "") filename = pathsegments.pop();
                        
                        filename = decodeURIComponent(filename);
                        
                        datestr = new Date(date.getTime()-(date.getTimezoneOffset()*60000)).toISOString();
                        
                        if (prefixFileName)
                        {
                            text = prefixText;
                            
                            text = text.replace(/%DOMAIN%/,mediaURL.hostname);
                            text = text.replace(/%DATE%/,datestr.substr(0,10));
                            text = text.replace(/%TIME%/,datestr.substr(11,8).replace(/:/g,"-"));
                            
                            filename = text + filename;
                        }
                        
                        if (suffixFileName)
                        {
                            text = suffixText;
                            
                            text = text.replace(/%DOMAIN%/,mediaURL.hostname);
                            text = text.replace(/%DATE%/,datestr.substr(0,10));
                            text = text.replace(/%TIME%/,datestr.substr(11,8).replace(/:/g,"-"));
                            
                            i = filename.lastIndexOf(".");
                            if (i < 0) filename = filename + text;
                            else filename = filename.substring(0,i) + text + filename.substring(i);
                        }
                        
                        link = document.createElement("a");
                        link.download = filename;
                        link.href = srcurl;
                        
                        document.body.appendChild(link);
                        
                        link.click();  
                        
                        document.body.removeChild(link);
                        
                        return true;
                    }
                }
            }
        }
        
        
        if (element.localName == "iframe" || element.localName == "frame")  
        {
            if (depth < maxFrameDepth)
            {
                try
                {
                    if (element.contentDocument.documentElement != null)  
                    {
                        if (extract(depth+1,element.contentWindow,element.contentDocument.documentElement)) return true;
                    }
                }
                catch (e) {}  
            }
        }
        else
        {
            for (i = 0; i < element.children.length; i++)
                if (element.children[i] != null)  
                    if (extract(depth,frame,element.children[i])) return true;
        }
        
        return false;
    }
}