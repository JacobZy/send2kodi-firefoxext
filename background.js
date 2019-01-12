var videoPattern = /^https?:\/\/www\.youtube\.com\/.*[?&]v=([A-Za-z0-9_-]{11})/;
var playlistPattern = /^https?:\/\/www\.youtube\.com\/.*[?&]list=([A-Za-z0-9_-]{34})/;

function idToURL(id) {
    switch (id) {
        case "b_play":
            var data = {"method": "Player.Open", "params": {"item": {"file": ""}}};
            getURLfromTab(data);
            break;
        case "b_queue":
            var data = {"method": "Playlist.Add", "params": {"playlistid":1, "item": {"file": ""}}};
            getURLfromTab(data);
            break;
        case "b_clearlist":
            var data = {"method": "Playlist.Clear", "params": {"playlistid":1}};
            getHostData(data);
            break;
        case "b_pause":
            var data = {"method": "Input.ExecuteAction", "params": ["pause"]};
            getHostData(data);
            break;
        case "b_stop":
            var data = {"method": "Input.ExecuteAction", "params": ["stop"]};
            getHostData(data);
            break;
        case "b_skipprevious":
            var data = {"method": "Input.ExecuteAction", "params": ["skipprevious"]};
            getHostData(data);
            break;
        case "b_volmute":
            var data = {"method": "Input.ExecuteAction", "params": ["mute"]};
            getHostData(data);
        case "b_volup":
            var data = {"method": "Input.ExecuteAction", "params": ["volumeup"]};
            getHostData(data);
        case "b_voldown":
            var data = {"method": "Input.ExecuteAction", "params": ["volumedown"]};
            getHostData(data);
            break;
        window.close();
    }
}

function getURLfromTab(data) {
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
        parseYoutubeURL(data, tabs[0].url);
    });
}

function parseYoutubeURL(data, url) {

    data["params"]["item"]["file"] = "plugin://plugin.video.sendtokodi/?" + url
    getHostData(data);
}

function getHostData(data) {
    var getting = browser.storage.local.get(null, function(result){
        var hostData = result;
        sendRequestToKODI(data, hostData);
    });
}

function sendRequestToKODI(data, hostData) {
    
    var xhr = new XMLHttpRequest();
    
    data["jsonrpc"] = "2.0";
    data["id"] = 1;
    console.log(hostData);
    console.log(JSON.stringify(data));

    xhr.open("POST", "http://" +hostData.user + ":" + hostData.pass + "@" + hostData.host + ":" + hostData.port + "/jsonrpc", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    
    if (hostData.proxyprocol != '') {
	data["params"]["item"]["file"] = data["params"]["item"]["file"]+' '+'{\"ydlOpts\":{\"proxy\":\"'+ hostData.proxyprocol+"://"+hostData.proxyadd+":"+hostData.proxyport+'\"}}';
	xhr.send(JSON.stringify(data));
    }
    else xhr.send(JSON.stringify(data));
    
    console.log(JSON.stringify(data));
    xhr.timeout = 5000;
    xhr.onreadystatechange = function (aEvt) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                var resp = xhr.responseText;
                parseJSON(resp);
            } else {
                notify("Error Sending request to KODI");
            }
        }
    };
    xhr.send();
}

function parseJSON(resp) {
    console.log(resp);
    var json = JSON.parse(resp);
    
    if (json["result"] && json["result"] == "OK") notify("Sent to KODI");
    else notify("Error recived from KODI");
}

function notify(message) {
    chrome.notifications.getAll(function(n) {
        // clear all notifications
        for(var i in n) {
            chrome.notifications.clear(i);
        }
        // create new notification
        chrome.notifications.create({
            "type": "basic",
            "iconUrl": chrome.extension.getURL("icons/youtube2kodi-48.png"),
            "title": "Youtube 2 KODI",
            "message": message
        });
    });
}

function encodeQueryData(data) {
    var k;
    var ret = [];
    for (k in data) {
        if (data[k] != '') {
            ret.push((k) + '=' + data[k]);
        }
    }
    return escape(ret.join('&'));
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse){
    idToURL(request.selectedId);
});
