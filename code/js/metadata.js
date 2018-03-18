// Copyright (c) 2018 The OpenGenus Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var obj = {};

function readDirectory(dirEntry) {
	var dirReader = dirEntry.createReader();
	dirReader.readEntries(function(entries) {
		for(var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			if (entry.isDirectory){
				readDirectory(entry);
			}
			else if (entry.isFile) {
				var filename = entry.name;				
				var filepath = entry.fullPath.split("/").slice(2,-1).join("/");
				if (!obj[filepath]) {
					obj[filepath] = [];
				}
				obj[filepath].push(filename);
			}
		}
		localStorage["metadata"] = JSON.stringify(obj);
	});
}

function populate () {
	chrome.runtime.getPackageDirectoryEntry(function(storageRootEntry) {
		if(storageRootEntry.isDirectory) {
			var dirReader = storageRootEntry.createReader();

			var readEntries = function() {
				dirReader.readEntries(function(entries) {
					for(var i = 0; i < entries.length; i++) {
						var entry = entries[i];
						if (entry.name === "code") {
							readDirectory(entry);
							break;
						}
					}

					if (!entries.length)
						readEntries();
				});
			};

			readEntries();
		}
	});	
}

if (!localStorage["metadata"] || location.hash === "#refresh") {
	populate();
}
