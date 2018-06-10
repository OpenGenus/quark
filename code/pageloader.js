"use strict";

function savepage_PageLoader(maxframedepth) {
    var resourceMimeType = new Array();
    var resourceBase64Data = new Array();
    var resourceBlobUrl = new Array();
    window.addEventListener("DOMContentLoaded", function(a) {
        createBlobURLs();
        replaceReferences(0, document.documentElement)
    }, false);

    function createBlobURLs() {
        var i, j, binaryString, blobData;
        var a = new Array();
        for (i = 0; i < resourceMimeType.length; i++) {
            if (typeof resourceMimeType[i] != "undefined") {
                binaryString = atob(resourceBase64Data[i]);
                resourceBase64Data[i] = "";
                a.length = 0;
                for (j = 0; j < binaryString.length; j++) {
                    a[j] = binaryString.charCodeAt(j)
                }
                blobData = new Blob([new Uint8Array(a)], {
                    type: resourceMimeType[i]
                });
                resourceMimeType[i] = "";
                resourceBlobUrl[i] = window.URL.createObjectURL(blobData)
            }
        }
    }

    function replaceReferences(a, b) {
        var i, regex1, regex2, csstext, blobData;
        regex1 = /url\(\s*(?:'|")?data:[^;]*;resource=(\d+);base64,(?:'|")?\s*\)/gi;
        regex2 = /data:[^;]*;resource=(\d+);base64,/i;
        if (b.hasAttribute("style")) {
            csstext = b.style.cssText;
            b.style.cssText = csstext.replace(regex1, replaceCSSRef)
        }
        if (b.localName == "style") {
            csstext = b.textContent;
            b.textContent = csstext.replace(regex1, replaceCSSRef)
        } else if (b.localName == "link" && (b.rel.toLowerCase() == "icon" || b.rel.toLowerCase() == "shortcut icon")) {
            if (b.href != "") b.href = b.href.replace(regex2, replaceRef)
        } else if (b.localName == "body") {
            if (b.background != "") b.background = b.background.replace(regex2, replaceRef)
        } else if (b.localName == "img") {
            if (b.src != "") b.src = b.src.replace(regex2, replaceRef)
        } else if (b.localName == "input" && b.type.toLowerCase() == "image") {
            if (b.src != "") b.src = b.src.replace(regex2, replaceRef)
        } else if (b.localName == "audio") {
            if (b.src != "") {
                b.src = b.src.replace(regex2, replaceRef);
                b.load()
            }
        } else if (b.localName == "video") {
            if (b.src != "") {
                b.src = b.src.replace(regex2, replaceRef);
                b.load()
            }
            if (b.poster != "") b.poster = b.poster.replace(regex2, replaceRef)
        } else if (b.localName == "source") {
            if (b.src != "") {
                b.src = b.src.replace(regex2, replaceRef);
                b.parentElement.load()
            }
        } else if (b.localName == "track") {
            if (b.src != "") b.src = b.src.replace(regex2, replaceRef)
        } else if (b.localName == "object") {
            if (b.data != "") b.data = b.data.replace(regex2, replaceRef)
        } else if (b.localName == "embed") {
            if (b.src != "") b.src = b.src.replace(regex2, replaceRef)
        }
        if (b.localName == "iframe" || b.localName == "frame") {
            if (a < maxframedepth) {
                if (b.hasAttribute("data-savepage-sameorigin")) {
                    blobData = new Blob([decodeURIComponent(b.src.substr(29))], {
                        type: "text/html;charset=utf-8"
                    });
                    b.onload = function() {
                        try {
                            if (b.contentDocument.documentElement != null) {
                                replaceReferences(a + 1, b.contentDocument.documentElement)
                            }
                        } catch (e) {}
                    };
                    b.src = window.URL.createObjectURL(blobData)
                }
            }
        } else {
            for (i = 0; i < b.children.length; i++)
                if (b.children[i] != null) replaceReferences(a, b.children[i])
        }
    }

    function replaceCSSRef(a, b, c, d) {
        return "url(" + resourceBlobUrl[+b] + ")"
    }

    function replaceRef(a, b, c, d) {
        return resourceBlobUrl[+b]
    }
}