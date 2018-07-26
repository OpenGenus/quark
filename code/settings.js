function loadSettings(){


    chrome.storage.local.get('safeMode', function (result) {
        let table_start = '<div id="tbl"><div class="table-responsive"><table id="t2" class="table table-hover"><thead><tr><th id="value"> </th><th style="width: 85%" id="name"> </th></tr></thead><tbody></div>';
        let table_body = ''
        //check if we are not in safe mode and save visited page
        if (result['safeMode'] || result['safeMode'] == undefined){
            table_body += "<tr><td><button id=" + "safeMode" + " type='button' class='btn btn-warning'>enabled</button></td><td class='align-middle'>"+"Safe Mode (if disabled OpenGenus extension will save all visited pages)"+"</td></tr>"
        } else {
            table_body += "<tr><td><button id=" + "safeMode" + " type='button' class='btn btn-danger'>disabled!</button></td><td class='align-middle'>"+"Safe Mode (if disabled OpenGenus extension will save all visited pages)"+"</td></tr>"
        }

        let table_end = "</tbody></table></div>";
        var element = document.getElementById("OpenGenus-table-saved.html")
        element.innerHTML = table_start+table_body+table_end;

        var element = document.getElementById("safeMode");
        element.addEventListener("click", function(){
            var text = $('#safeMode').text();
            if (text==='enabled') {
                $(this).text('disabled!');
                element.classList.remove("btn-warning");
                element.classList.add("btn-danger");
                chrome.storage.local.set({"safeMode": false}, function() {
                    console.log('SafeMode is set to ' + false);
                });
            } else {
                $(this).text('enabled');
                element.classList.remove("btn-danger");
                element.classList.add("btn-warning");
                chrome.storage.local.set({"safeMode": true}, function() {
                    console.log('SafeMode is set to ' + true);
                });
            }
        });

    });

}

$( document ).ready(function() {
loadSettings()
});