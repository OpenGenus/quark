function dhm2(ms){
	days = Math.floor(ms / (24*60*60*1000));
	daysms=ms % (24*60*60*1000);
	hours = Math.floor((daysms)/(60*60*1000));
	hoursms=ms % (60*60*1000);
	minutes = Math.floor((hoursms)/(60*1000));
	minutesms=ms % (60*1000);
	sec = Math.floor((minutesms)/(1000));
	return [days,hours,minutes,sec];
}

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({
		'url': chrome.extension.getURL('popup.html')
		}, function(tab) {
			localStorage.setItem("openThroughWeb", "no");
			});
});

//notification to indicate that you aren't connected to internet
window.addEventListener('offline', createNotification);
window.addEventListener('offline', audioNotification);

//notification to indicate that you are back online
window.addEventListener('online', createNotification);
window.addEventListener('online', audioNotification);

//list type notification
function createNotification(){
	//boolean var status to check if connxn is online/offline
	let status = navigator.onLine;
	let notification = {type: "list", message: '', iconUrl: "icon/icon.png"};
	if(status) {
		notification.title = 'Internet : ONLINE';
		notification.items = [{ title: "", message: "You\'re back online!"}];
	}
	if(!status) {
		notification.title = 'Internet : OFFLINE';
		notification.items = [{title:"",message:"Do not close/refresh open tabs."}, 
					{ title: "Use Quark", message: "to continue learning!"}];
	}
    chrome.notifications.create("connxnNotification",notification,function(){});
}

//alert sound for the above notification
function audioNotification(){
    let alertSound = new Audio('audio/kick.wav');
    alertSound.play();
}


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

			var value = dhm2(request.time)
			url.days = value[0];
			url.hrs = value[1];
			url.mins = value[2];
			url.secs = value[3];
			url.lastV = request.lastV;
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
						var value = dhm2(current_sites[index].time)
						current_sites[index].days = value[0];  
						current_sites[index].hrs = value[1];    
						current_sites[index].mins = value[2]; 
						current_sites[index].secs = value[3]; 
						current_sites[index].lastV = url.lastV;
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