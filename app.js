//https://www.geeksforgeeks.org/how-to-use-selenium-web-driver-and-javascript-to-login-any-website/
// Include the chrome driver
//require("chromedriver");
//https://medium.com/@andrey.dobra/web-testing-using-selenium-webdriver-part-4-adding-javascript-node-js-and-mocha-656df2a12787
//https://stackoverflow.com/questions/17385779/how-do-i-load-a-javascript-file-into-the-dom-using-selenium/17387127


//const { fstat } = require("fs-extra");

//const { data } = require("jquery");
//const { setDefaultService } = require("selenium-webdriver/chrome");



//Template to prepend inside html body
htmlTemplate = `
<style>
.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid blue;
  border-right: 3px solid green;
  border-bottom: 3px solid red;
  border-left: 3px solid pink;
  width: 15px;
  height: 15px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
<div  onclick="document.getElementById('sumapp').style.display='block'" style="position: fixed; top: 50px; right: 20px; z-index: 100001;" class="btn btn-primary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
    <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z"/>
    </svg> &nbsp; RUN 4 FUN Reports
</div>
<input type="hidden" id="mycmd" value="">
<div id="sumapp" style="z-index: 1000002;background-color:  #00000069; position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px; height: 100vh; padding: 50px 50px 50px 50px; display:none" class="">
    <div style="width: auto; height: calc(100vh - 150px); background-color: whitesmoke; padding: 20px;">
        <div style="height: 50px;">
            <a id='dlLink' class='btn btn-primary' href='#'>Download csv</a>

            <button class='btn btn-primary' type="button" onClick="callScript()">Click Me</button>

            <input type="button" class="btn btn-default float-right" value="X" onClick="document.getElementById('sumapp').style.display='none'" >
            <div id="itemCounts" class="float-right" style="padding-top: 10px; padding-right: 10px">Items: 0</div>
            <div id="newItemCounts" class="float-right" style="padding-top: 10px; padding-right: 10px">New Items: 0</div>
        </div>
        <div style="height: calc(100% - 80px);overflow:auto;" >
            <div id="sumWrapper">
            <table id="extable" style="width: 100%;"><tr><td></td><td><b>Name</b></td><td><b>Date</b></td><td><b>Distance</b></td><td><b>Pace</b></td><td><b>Unit</b></td><td><b>Time</b></td><td><b>Elev</b></td><td></td></tr>
            </table>
            </div>
        </div>
        <center>
        <div class='float-left' style="margin-top: 10px">Powered by <b>Luis Matos Ferreira</b></div>
        </center>

    </div>

</div>`



//If we need to import the function from other file
//module.exports = {
//    auth: function() {


auth()
function auth() {       

console.log('Strava summarize init');
console.log('Get Strava Tokens');

//import luxon from 'luxon'
let luxon = require("luxon")

var entries = 0;
var DateTime2 = luxon.DateTime;
var Duration = luxon.Duration;
        
var data = [];
var data2 = [];     
              
var fs = require('fs-extra');
let fetch = require("node-fetch");
let swd = require("selenium-webdriver");
let By = swd.By;
let until = swd.until;
let browser = new swd.Builder();
let driver = browser.forBrowser("chrome").build();
//let driver = browser.forBrowser("firefox").build();
driver.manage().window().maximize();

const cheerio = require('cheerio');
//const Window = require('window');

let { club_id, client_id, client_secret } = require("./Oauth2.json");
let urlauth = "http://www.strava.com/oauth/authorize?client_id=" + client_id + "&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read_all,profile:read_all,activity:read_all"
console.log("uralauth: ", urlauth)

//let urlauth = 'https://www.strava.com/login'
//let urlpage = 'https://www.strava.com/dashboard/following/200'
let urlpage = 'https://www.strava.com/clubs/' + club_id + '/recent_activity'

// Get the credentials from the JSON file
let { email, pass } = require("./credentials.json");

//driver.get(urlauth);


// Step 1 - Opening the Strava sign in page
let tabToOpen =
    driver.get(urlauth);

tabToOpen
    .then(function () {  
        // Timeout to wait if connection is slow
        //driver.manage().window().maximize();
        let findTimeOutP =
            driver.manage().setTimeouts({
                implicit: 10000, // 10 seconds
            });
        return findTimeOutP;
    })
    .then(function () {  
        // Step 2 - Finding the username input
        let promiseUsernameBox =
            driver.findElement(swd.By.css("#email"));
        return promiseUsernameBox;
    })
    .then(function (usernameBox) {
        // Step 3 - Entering the username
        let promiseFillUsername =
            usernameBox.sendKeys(email);
        return promiseFillUsername;
    })
    .then(function () {
        console.log(
            "Username entered successfully in " +
            "RUN 4 FUN"
        );
  
        // Step 4 - Finding the password input
        let promisePasswordBox =
            driver.findElement(swd.By.css("#password"));
        return promisePasswordBox;
    })
    .then(function (passwordBox) {  
        // Step 5 - Entering the password
        let promiseFillPassword =
            passwordBox.sendKeys(pass);
        return promiseFillPassword;
    })
    .then(function () {
        console.log(
            "Password entered successfully in " +
            "RUN 4 FUN"
        );
  
        // Step 6 - Finding the Sign In button
        let promiseSignInBtn = driver.findElement(
            swd.By.css("#login-button")
        );
        return promiseSignInBtn;
    })
    .then(function (signInBtn) {
  
        // Step 7 - Clicking the Sign In button
        let promiseClickSignIn = signInBtn.click();
        return promiseClickSignIn;
    })
    .then(function () {
        console.log("Successfully signed in RUN 4 FUN!");
    })
    .catch(function (err) {
        console.log("Error ", err, " occurred!");
    })
    .then(function(){
        // Step 8 - Perform Oauth2
        // Get the code from the return url
        let getData = async() => {
            await driver.executeScript('document.getElementById("authorize").click();')
            let currentUrl = await driver.getCurrentUrl()
            return await currentUrl
        }
        (async () => {
            currentUrl = await getData()
            console.log(await currentUrl)
            let code = await currentUrl.split('&')[1].split('=')[1]
            let codeJson = {
                "code": code
            }
            // Save the code
            console.log(codeJson)
            let codeData = JSON.stringify(codeJson)
            fs.writeFileSync('code.json', codeData)
            token(await code)
          })()
          
        function token(code) {

            let proxyTrue = true
           //let page = driver.get(url)

            const fetch = require("node-fetch");
            //Headers = require("node-fetch");
            //var myHeaders = new Headers();
            //myHeaders.append("Content-Type", "application/json");

            // Use credentials
            let { club_id, client_id, client_secret } = require("./Oauth2.json");

            var raw = JSON.stringify({
              "client_id": client_id,
              "client_secret": client_secret,
              "code": code,
              "grant_type": "authorization_code"
            });

            // If we need to go through a proxy this must be true; it will fetch the proxy credentials from file
            if (proxyTrue) {
                let { userProxy, passProxy, ipProxy } = require("./proxy.json")                
                const httpsProxyAgent = require('https-proxy-agent');
                proxy = "http://" + userProxy + ":" + passProxy + "@" + ipProxy
                var proxyAgent = new httpsProxyAgent(proxy);

                var requestOptions = {
                    method: 'POST',
                    //headers: myHeaders,
                    headers: {"Content-Type": "application/json"},
                    body: raw,
                    redirect: 'follow',
                    agent: proxyAgent
                  }; 
            }
            else {
                var requestOptions = {
                    method: 'POST',
                    //headers: myHeaders,
                    headers: {"Content-Type": "application/json"},
                    body: raw,
                    redirect: 'follow'
                  };               
            }

            // Fetch the token for Oauth2
            fetch("https://www.strava.com/oauth/token", requestOptions)
              .then(response => response.text())
              .then(result => {
                    console.log(result)
                    fs.writeFileSync('strava_tokens.json', result)
              })
              .catch(error => console.log('error', error));

            getAll()  
        }

        // Get the activities from the Page
        function getAll() {
            //driver.get(urlauth);
            console.log("GetPage")
            let getData = async(url) => {
                await driver.get(url);
                //const window = new Window();
                //console.log(window.location)

                // Scroll down to get most activities
                console.log("Scrolling down")
                await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
                await new Promise(r => setTimeout(r, 2000));
                await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
                await new Promise(r => setTimeout(r, 2000));
                await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
                await new Promise(r => setTimeout(r, 2000));
                await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
                await new Promise(r => setTimeout(r, 2000));
                await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
                let page = await driver.getPageSource();
                //await new Promise(resolve => setTimeout(resolve, 7000));
                //console.log(page)
                //var doc = this.browserbot.getUserWindow().document;
                //let activities = await driver.findElements(By.xpath("//div[@data-react-class='Activity']"));
                //const $ = cheerio.load(page)            
                //console.log($)
    
                const $ = cheerio.load(page)
                //window.scrollTo(0,document.body.scrollHeight);
                //await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
    
                var activities = $('div[data-react-class=Activity], div[data-react-class=GroupActivity]')
                var data0 = []
                activities.each((i, e) => {
                    var json = $(e).data('react-props');
                    data0.push(json)
                    //console.log(json)
                })
                //console.log(data)
                return await data0
            }
            (async () => {
                data0 = await getData(urlpage)
                //console.log(await data)
                loadActivities(await data0)
              })()
    
            
            //page = getData(urlpage);
            //console.log(data.length)
            //console.log(page)
            //const $ = cheerio.load(page)
            //console.log($)
            //var activities = $('div[data-react-class=Activity], div[data-react-class=GroupActivity]')
    
            function loadActivities(activities){
                //window.scrollTo(0,document.body.scrollHeight);
                console.log("Number of activities: ", activities.length)
    
                activities.forEach((json, i) => {
    
                    //console.log(json)
                    if (json.timeAndLocation == null){
                    //if (json.timeAndLocation == null && json.activity.timeAndLocation.displayDate == 'Today'){
                        buildActivity(json.activity, json.activity.timeAndLocation);
                    }else { 
                    //}else if (json.timeAndLocation != null && json.timeAndLocation.displayDate == 'Today') {
                        // console.log('build group')
                        json.rowData.activities.forEach(element => {
                            //console.log(element)
                            buildActivity(element, json.timeAndLocation, true);
                        });            
                    }
                })
                data.sort((a, b) => { return new Date(a.time) - new Date(b.time) })
                //data.sort((a, b) => { return (a.activityId) - (b.activityId) })
                //console.log(data)
                getActivities3();
            
                //showActivities();
                //updateDownload();
            
                console.log(`feed counts: ${data.length}`);
            }
    
    
            function buildActivity(activity, timeLocation, isgroup = false){
                var stats = activity.stats;
                var distant = getValue(stats, 'Distance');
                var pace = getValue(stats, 'Pace');
                var duration = getValue(stats, 'Time');
                var time = getTime(timeLocation.displayDateAtTime)
                var cal = getValue(stats, 'Cal')
                var elev = getValue(stats, 'Elev Gain')
                
                //console.log(activity)
                var name = (activity.athlete)?activity.athlete.athleteName : activity.athlete_name
                //var short_name = (activity.athlete)?activity.athlete.short_name : activity.short_name
                //var firstname = (activity.athlete)?activity.athlete.athlete_first_name : activity.athlete_first_name
                var activityId = activity.id || activity.entity_id
                name = name.replace("\"","").replace("#", "")
                var firstname = name.split(' ')[0]
                var lastname = name.split(' ')[1]
                var key0 = distant.value.slice(0, -1)
                var key = firstname + lastname.slice(0, 1).toUpperCase() + key0
                var strongKey = key + time.value
                var timestamp = Date.now().toString().slice(0, -3)
            
                //console.log(activityId)
                //console.log(duration)
            
                if (data.findIndex(e => e.activityId == activityId) < 0) {
            
                    var {tunedDur, tunedObj} = tuneDuration( duration.value)
                    var durMinutes = Duration.fromObject(tunedObj).shiftTo('minutes').minutes;
                    var durHours = Duration.fromObject(tunedObj).shiftTo('hours').hours
                    var dis = parseFloat(distant.value.replace(",",""))
            
                    var estpace = "", estspeed = ""
                    
                    if (dis > 0){
                        if (distant.unit == 'm'){
                            dis = dis/100
                        }
            
                        estpace = Duration.fromObject({minutes: durMinutes/dis}).shiftTo("minutes", "seconds").toFormat('m:ss') + ((distant.unit == 'm')?'/100m':'');
                    }
            
                    if (durHours > 0 && dis > 0){
                        if (activity.type.toLowerCase() == 'swim'){
                            dis = dis/10
                        }
                        estspeed = (dis/durHours).toFixed(1);
                    }
            
                    if (activity.type == "Run") {
                    data.push({
                        "activityId": activityId,
                        "type": activity.type,
                        "name": name,
                        "location": timeLocation.location || '',
                        "time": time.value,
                        "distance": distant.value,
                        "pace": pace.value,
                        "estPace": estpace,
                        "estSpeed": estspeed,
                        "unit": distant.unit,
                        "duration": tunedDur,
                        "elev": elev.value,
                        "unitElev": "m",
                        //"short_name": short_name,
                        //"firstname": firstname,
                        //"calo": cal.value,
                        "key": key,
                        "strongKey": strongKey,
                        "timestamp": timestamp
                    })
                    }
                }
                //console.log(data)
            
                return {activityId}
            }
            
            function tuneDuration(str){
                var parts = str.trim().split(" ");
                var h ='0', m ='0', s ='0';
                parts.forEach(p => {
                    if (p.endsWith('h')){
                        h = p.replace("h","");
                    }
                    if (p.endsWith("m")){
                        m = p.replace("m", "");
                    }
                    if (p.endsWith("s")){
                        s = p.replace("s", "")
                    }
                })
            
                return {tunedDur: `${h.padStart(2,0)}:${m.padStart(2,0)}:${s.padStart(2,0)}`, tunedObj: {hours:h, minutes: m, seconds: s}}
            }
            
            function getTime(timeStr) {
            
                try {
                    timeStr = timeStr.replace("at ", "")
                    var today = DateTime2.now().toFormat('LLLL dd, yyyy');
                    var yesterday = DateTime2.now().plus({days: -1}).toFormat('LLLL dd, yyyy');
                    timeStr = timeStr.replace("Today", today);
                    timeStr = timeStr.replace("Yesterday", yesterday);
                    var d = DateTime2.fromFormat(timeStr, "LLLL d, yyyy h:m a");
                    // console.log('Timestring ' + timeStr + ' ' + d.toISO())
                    return {value: d.toISO(), unit: timeStr}
                } catch (error) {
                    return {value: "", unit: ""}
            
                }
            
            
            }
            
            function getValue(stats, typeName){
                var i = stats.findIndex((e) => e.value == typeName)
                if (i< 1) return {value: "", unit: ""}
            
                var parts = stats[i-1].value.split('<')
                let strippedString = parts[1].split('>')[1].replace(/(<([^>]+)>)/gi, "").trim();
                let strippedFull = stats[i-1].value.replace(/(<([^>]+)>)/gi, "").trim()
                return {value: (typeName == 'Time')? strippedFull : parts[0].trim(), unit: (typeName == 'Time')? strippedFull : strippedString}
            }
    
    
    
            
            function getActivities3() {

                let {token_type, expires_at, expires_in, refresh_token, access_token, athlete} = require("./strava_tokens.json");
                console.log("Perform Oauth2")
                console.log("access_token:", access_token)
            
                console.log("Get API activities")
                let fetch = require("node-fetch");
                let httpsProxyAgent = require('https-proxy-agent');
                var proxyAgent = new httpsProxyAgent(proxy);
                let { club_id, client_id, client_secret } = require("./Oauth2.json");
                const activities_link = "https://www.strava.com/api/v3/clubs/" + club_id + "/activities?page=1&per_page=200&access_token=" + access_token
                i = 0
                //fetch(activities_link, { agent: proxyAgent})
                    //.then(res => res.json())
            
                let getData3 = async() => {
                    let activities = await fetch(activities_link, { agent: proxyAgent})
                    //console.log(activities.json())
                    return await activities
                }
                (async () => {
                    data3 = await getData3()
                    //console.log(await "See Number of activities: " + data3.length)
                    //loadActivities3(await data3.json())
                    dataPush(await data3.json())
                })()
            
            
                function dataPush(activities) {
                    activities.forEach((json, i) => {
                        loadActivities3(json)
                    })

                    //console.log(data2)
                    //dataWrite(data)
                    mergeActivities(data2)


                    cloneData = [...data];
                    //console.log(cloneData.length)
                    //showActivities(cloneData)

                    //console.log("Chegou ate aqui")
                    //console.log(data.length)

                    const filename = 'Strava.csv'
                    const fs = require("fs-extra")

                    if (fs.existsSync(filename)) {
                        //file exists
                        console.log("CSV Exists!")
                        readActivities(cloneData)
                    }
                    else {
                        console.log("CSV does not exist!")
                        saveActivities(false, cloneData)
                    }                  
                    //readActivities()
                    //saveActivities()
                }
                   
                function loadActivities3(json){
    
                    var name = json.name
                    var distanceRaw = json.distance
                    var distance = (json.distance/1000)
                    var athlete = json.athlete.firstname + ' ' + json.athlete.lastname
                    var time = json.moving_time
                    var elev = Math.round(json.total_elevation_gain)
                    var type = json.type
                    //var key = json.athlete.firstname + distance
                    var key0 = (json.distance/1000).toFixed(3)
                    var key = json.athlete.firstname + json.athlete.lastname.slice(0, 1).toUpperCase() + key0.slice(0, -2)
            
                    data2.push({
                        "athlete": athlete,
                        "name": name,
                        "distanceRaw": distanceRaw,
                        "distance": distance,
                        "time": time,
                        "elev": elev,
                        "type": type,
                        "key": key
                    })
                
                }

                function mergeActivities(data2) {
                    data.forEach((a, i) => {
                        data2.forEach((b, j) => {
    
                            try{
                                if (a.key == b.key) {
                                    //console.log(i)
                                    //console.log(a.key, b.key)
                                    a.elev = b.elev
                                    //console.log(a)
                                }
                            }
                            catch{return i}
    
                        })
                    })
                }


                //cloneData = [...data];
                //console.log(cloneData.length)
                //showActivities(cloneData)
            }


            function readActivities(cloneData){


                const filename = 'Strava.csv'
                const fs = require("fs-extra")
                const csv = require('csv-parser');
                const results = []
               
                fs
                .createReadStream(filename, 'utf16le')
                .pipe(csv({ separator: '|' }))
                .on('data', (data4) => {
                  results.push(data4);
                })
                .on('end', () => {
                  //console.log(results);
                  const data5 = []
                  results.forEach((e, i) => {
                      data5[i] = e['activityId']
                      //console.log(data[i])
                      //someFunction(results)
                  })
                  //console.log(results)
                  //showActivities(data)
                  //console.log(data5)
                  removeDuplicates(data5);
                })

                function removeDuplicates(data5) {
                    console.log("Activities in CSV: ", data5.length)
                    // do anything with data
                    //data.forEach((a, i) => {
                    //var flag = false
                    for (var i = 0; i < data.length; i++){
                        //console.log(a.activityId, i)
                        //if (i > -1) {console.log("A:", i, data.length)}
                        //else{console.log(i)}

                        //data5.forEach((b, j) => {
                        for (var j = 0; j < data5.length; j++){
                            //console.log(b.activityId, j)
                            //if (i > -1) {console.log("B:", i, j)}
                            //else{console.log(i, j)}
                            //if (data.length > 0 && -1 < i < data.length) {
                            if (data[i].activityId == data5[j]) {
                                data.splice(i, 1)
                                    //flag = true
                                i--
                                    //console.log(a.name)
                                //console.log("B:", i, data.length)
                                break
                            }
                        }
                            //if (flag == true) {i--}
                        //})
                    }

                    /*
                    data.forEach((a, i) => {
                        //console.log(a.activityId, i)
                        data5.forEach((b, j) => {
                            //console.log(b.activityId, j)
                            if (data[i].activityId == b) {
                                data.splice(i, 1)
                                i--
                                console.log(a.name)
                                console.log(data.length)
                            }
                        })                    
                    })
                    */
                    //console.log(data4)
                    //console.log(data)
                    console.log("the Number of new activities: ", data.length)
                    if (data.length > 0) {saveActivities(true)}
                    //saveActivities()

                    ///////////showActivities(data)
                    //elm4 = driver.findElement(By.id("newItemCounts"))
                    //driver.executeScript(`arguments[0].innerHTML = ` + `'New Items: ${data.length}'`, elm4)
                }
                //saveActivities()
                
                showActivities(cloneData)

            }
                
    
            function saveActivities(exists){

                
                var fs = require('fs-extra');
                
                //console.log(data);
                console.log("Number of new activities: ", data.length);
    
                var csv = "";
                var keys = (data[0] && Object.keys(data[0])) || [];
                console.log("CSV exists? ", exists)
                if (exists == false) {
                    csv += keys.join('|') + '\n';
                }
                for (var line of data) {
                  csv += keys.map(key => line[key]).join('|') + '\n';
                }
    
                fs.appendFile('Strava.csv', csv, 'utf16le', function(err) {
                    if (err) {
                      console.log('Some error occured - file either not saved or corrupted file saved.');
                    } else {
                      console.log("CSV saved!");
                    }
                  });
    
            }

            function showActivities(cloneData) {

                console.log("Show Activities")
                //cloneData2 = [...data];
                /////console.log(cloneData)

            
                let getData = async() => {

                    let page = await driver.getPageSource();        
                    const $ = cheerio.load(page)

                    await driver.executeScript("window.scrollTo(0, 0);")
                    console.log("All Good")
                    elm = await driver.findElement(By.id("global-header"))

                    htmlTemplate = '`' + htmlTemplate + '`'
                    //console.log(htmlTemplate)
        
                    result = await driver.executeScript(`arguments[0].innerHTML = ` + htmlTemplate, elm)

                    return await [result, $]
                }
                (async () => {
                    [result, $] = await getData()
                    //console.log(await result)
                    loadActivities(await result, $)
                    //loadActivities(data)
                })()

                
                function loadActivities(result, $) {

                    //console.log("Mostrar atividades")
                    //console.log(cloneData2)

                    elm2 = driver.findElement(By.id("sumWrapper"))
                    //let htmlTable = ''
                    //var htmlTable = `<table id="extable" style="width:100%"><tr><td></td><td><b>Location</b></td><td><b>Name</b></td><td><b>Date</b></td><td><b>Distance</b></td><td><b>Pace</b></td><td><b>Unit</b></td><td><b>Time</b></td><td><b>Elev</b></td><td style="color: red"><b>Est Pace</b></td><td style="color:red"><b>Est Speed</b></td></tr>`
                    var htmlTable = `<table id='extable' style='width:100%'><tr><td></td><td><b>Location</b></td><td><b>Name</b></td><td><b>Date</b></td><td><b>Distance</b></td><td><b>Pace</b></td><td><b>Unit</b></td><td><b>Time</b></td><td><b>Elev</b></td><td style='color: red'><b>Est Pace</b></td><td style='color:red'><b>Est Speed</b></td></tr>`
            
                    //var htmlTable = '`<table id="extable"><tr><td>`'
            
            
                    cloneData.map(a => {
                        htmlTable += `<tr id='${a.activityId}' style='height:40px'><td><a href='https://www.strava.com/activities/${a.activityId}' target='_blank'>${a.type}</a></td><td>${a.location}</td><td>${a.name}</td><td>${(new Date(a.time)).toLocaleString()}</td><td class='distance'>${a.distance}</td><td class='pace'>${a.pace}</td><td class='unit'>${a.unit}</td><td class='duration'>${a.duration}</td><td class='elev'>${a.elev}</td><td>${a.estPace}</td><td>${a.estSpeed}</td></tr>`
                    })
                    

                    htmlTable = '`' + htmlTable + '`'  
                    driver.executeScript(`arguments[0].innerHTML = ` + htmlTable, elm2)
                    //console.log(htmlTable)


                    /*
                    htmlScript = `            
                    <script>function addtext() {console.log("Olá");const para = document.createElement("p");para.innerText = "Sucesso";document.body.appendChild(para)}</script>`
                    htmlFinal = htmlTable + htmlScript
                    htmlFinal = '`' + htmlFinal + '`'
                    driver.executeScript(`arguments[0].innerHTML = ` + htmlFinal, elm2)
                    */

                    elm3 = driver.findElement(By.id("itemCounts"))
                    driver.executeScript(`arguments[0].innerHTML = ` + `'Items: ${cloneData.length}'`, elm3)

                    elm4 = driver.findElement(By.id("newItemCounts"))
                    driver.executeScript(`arguments[0].innerHTML = ` + `'New Items: ${data.length}'`, elm4)
           
                    /*
                    driver.executeScript(function() {
                        return document.querySelector('#sumWrapper').innerHTML;
                      }).then(function(innerHTML) {
                       //check content here
                       console.log(innerHTML) 
                      });
                      */
            
                    //driver.executeScript(`document.querySelector('#sumWrapper').innerHTML = ` + htmlTable)
                    //driver.executeScript("document.querySelector('#itemCounts').innerHTML = " + `'Items: ${data.length}'`)
                    
                    /*
                    htmlScript = `            
                    <script>function addtext() {console.log("Olá");const para = document.createElement("p");para.innerText = "Sucesso";document.body.appendChild(para)}</script>`
                    */

                    //htmlScript = '`' + htmlScript + '`'
                    
                    //htmlScript = `<script>require('./script.js')</script>`
                    //htmlScript = `<script src='C:/Users/ferrelm/Backend Developement/JavaScript/10.3_WebScraperSelenium/web-scraper-selenium/script.js'></script>`



                    //In order to fetch a local script it is necessary to provide it through a server, in order to circunvent chrome security
                    const FileServer = require('file-server');

                    const fileServer = new FileServer((error, request, response) => {
                        response.statusCode = error.code || 500;
                        response.end(error);
                    });
                    
                    serveScriptsDirectory = fileServer.serveDirectory('C:/Users/ferrelm/Backend Developement/JavaScript/10.3_WebScraperSelenium/web-scraper-selenium/scripts', {
                        '.js': 'text/plain',
                    })

                    //const serveScript = fileServer.serveFile('C:/Users/ferrelm/Backend Developement/JavaScript/10.3_WebScraperSelenium/web-scraper-selenium/script.js', 'text/plain');
                    
                    require('http')
                        .createServer(serveScriptsDirectory)
                        .listen(8081);

                    // Read the script from localhost
                    driver.executeScript("var s=window.document.createElement('script');\
                        s.src='http://localhost:8081/script.js';\
                        window.document.body.appendChild(s);");
                        
                        
                    /*
                    driver.executeScript("var s=window.document.createElement('script');\
                        s.src='C:/Users/ferrelm/Backend Developement/JavaScript/10.3_WebScraperSelenium/web-scraper-selenium/script.js';\
                        window.document.body.appendChild(s);");
                    */

                    
                    /*
                    var csvContent = "data:text/csv;charset=utf-8,"
                    csvContent += "Type,Location,Name,Date,Distance,Pace,Unit,Duration,Elev,Calo,EstPace,EstSpeed\r\n"
                
                    cloneData.map(a => {
                        csvContent += `"${a.type}","${a.location}","${a.name}","${a.time}","${a.distance}","${a.pace}","${a.unit}","${a.duration}","${a.elev}","${a.calo}","${a.estpace}","${a.estspeed}"\r\n`;
                    })
                
                    var encodedUri = encodeURI(csvContent);
                    //console.log(encodedUri)
                    var d = new Date();
                    var filename = `Strava-${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${d.getHours()}.csv`
                    //console.log(filename)
                    $("#dlLink").attr('href', encodedUri).attr('download', filename);
                    */


                }

            }
    
        }
        //driver.close()

    })

}


//}
