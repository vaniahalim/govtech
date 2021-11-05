searchBtn = document.getElementById("search-btn")
searchBtn2 = document.getElementById("search-btn2")
table = document.getElementById("data")
table2 = document.getElementById('data2')
progressBar = document.getElementById("progressBar")
progressBar2 = document.getElementById("progressBar2")
iocHashesInput = document.getElementById("ioc-hashes")
ipInput = document.getElementById('ioc-ip')

function openTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("content-tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" is-active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " is-active";
}

async function queryIocDb(hashes) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"hash":hashes});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://9pqfx4beaf.execute-api.ap-southeast-1.amazonaws.com/queryIocDb", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log("hash: ",JSON.parse(result))
            return JSON.parse(result)
        })
        .catch(error => {
            console.log('error', error)
            return []
        });
}

async function queryIpDb(ip) {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({'ip_address':ip});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect:'follow'
    }

    return fetch("https://9pqfx4beaf.execute-api.ap-southeast-1.amazonaws.com/dynamodb-query", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log("ips: ", JSON.parse(result))
            return JSON.parse(result)
        })
        .catch(error => {
            console.log('error', error)
            return []
        });

}

function initiateFakeLoad() {
    // Fake Loading Bar Logic
    var progressInc = setInterval(loadLogic, 10);
    function loadLogic() {
        if (progressBar.value >= 100) {
            clearInterval(progressInc);
            progressBar.value = 0;
            progressBar.style.display = "none"
            if(ioc_hashes.length == 0) {
                searchBtn.innerHTML="No Vulnerabilities Found!"
                searchBtn.style.backgroundColor='#72E8B5'
            } else {
                searchBtn.innerHTML="Vulnerabilities Detected!"
                searchBtn.style.backgroundColor= '#ff5050'
            }
        } else {
            progressBar.value++
        }
    }
}

function initiateFakeLoad2() {
    // Fake Loading Bar Logic
    var progressInc = setInterval(loadLogic2, 10);
    function loadLogic2() {
        if (progressBar2.value >= 100) {
            clearInterval(progressInc);
            progressBar2.value = 0;
            progressBar2.style.display = "none"
            if(ioc_ip.length == 0) {
                searchBtn2.innerHTML="No Vulnerabilities Found!"
                searchBtn2.style.backgroundColor='#72E8B5'
            } else {
                searchBtn2.innerHTML="Vulnerabilities Detected!"
                searchBtn2.style.backgroundColor= '#ff5050'
            }
        } else {
            progressBar2.value++
        }
    }
}

searchBtn.onclick = async () => {
    searchBtn.innerHTML = "Searching"
    table.innerHTML = '' // Clear all previous search results
    table2.innerHTML = ''
    progressBar.style.display = "block" // Make Progress bar visible (initially display == none)

    // Fake loading bar for style points
    initiateFakeLoad()

    ioc_hashes = iocHashesInput.value.split("\n").filter(_ => _)
    response = await queryIocDb(ioc_hashes)

    for (const record of response) {
        row = document.createElement("tr");

        const {instanceId, md5, filepath} = record

        filepath_f = document.createElement("td");
        md5_f = document.createElement("td");
        instanceId_f = document.createElement("td");

        filepath_f.innerHTML = filepath
        md5_f.innerHTML = md5
        instanceId_f.innerHTML = instanceId

        row.appendChild(instanceId_f)
        row.appendChild(md5_f)
        row.appendChild(filepath_f)

        table.appendChild(row);
    }
}


searchBtn2.onclick = async () => {
    searchBtn2.innerHTML = "Searching"
    table.innerHTML = '' // Clear all previous search results
    table2.innerHTML = ''
    progressBar2.style.display = "block" // Make Progress bar visible (initially display == none)

    // Fake loading bar for style points
    initiateFakeLoad2()

    ioc_ip = ipInput.value.split('\n').filter(_=>_)
    responseIp = await queryIpDb(ioc_ip)

    for (const r of responseIp) {
        row2 = document.createElement('tr');

        requestCount  = r["Request Count"] 
        ipAddress     = r["IP Address"] 
        scanPeriod    = r["Scan Period"] 

        requestCount_f = document.createElement("td");
        ipAddress_f = document.createElement("td");
        scanPeriod_f = document.createElement("td");

        requestCount_f.innerHTML = requestCount
        ipAddress_f.innerHTML = ipAddress
        scanPeriod_f.innerHTML = scanPeriod

        row2.appendChild(ipAddress_f)
        row2.appendChild(requestCount_f)
        row2.appendChild(scanPeriod_f)

        table2.appendChild(row2);

    }
}

