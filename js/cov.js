// popup window function
function togglePopup(){
  document.getElementById("popup-1").classList.toggle("active");
}

// fill country data menu
var fillCountryMenu = async() => {
  // get report data
  var url = 'https://cov19.cc/report.json?v=' + Math.random();
  try {
    var res = await fetch(url);
    var report = await res.json();
  } catch (err) {
    console.log(err)
  }

  // fill select menu with countries
  var world_list = report.regions.world.list.sort(function(a, b) {
    return (a.country.toUpperCase() < b.country.toUpperCase()) ? -1 : (a.country.toUpperCase() > b.country.toUpperCase()) ? 1 : 0;
  });
  for(var i in world_list){
    var countryObject = world_list[i];
    var x = JSON.stringify(countryObject.country);
    x = x.replace(/^"|"$/g, '');
    // set US as default selected
    if(countryObject.country == "United States"){
      var o = new Option(x, i, false, true);
    } else {
      var o = new Option(x, i,);
    }
    $(o).html(x);
    $("select").append(o);
  }

  // fill default selected country info
  getCountryInfo();
}

// get country info when changed
var getCountryInfo = async() => {
  // get report data
  var url = 'https://cov19.cc/report.json?v=' + Math.random();
  try {
    var res = await fetch(url);
    var report = await res.json();
  } catch (err) {
    console.log(err)
  }

  var world_list = report.regions.world.list;

  // remove previous flag
  document.getElementById("countryFlag").innerHTML = ``;
  // filling select menu
  var d = document.getElementById("dropView");
  var userOpt = d.options[d.selectedIndex].text;
  for(var i in world_list){
    var countryObject = world_list[i];
    // look for selected country
    if(countryObject.country == userOpt){
      document.getElementById("countryName").innerText = userOpt;
      $('#countryFlag').prepend(`
        <i class="flag-icon flag-icon-${countryObject.country_code} rounded">
      `);
      // update/set country statistics
      document.getElementById("country_confirmed").textContent = countryObject.confirmed.toLocaleString('en-US')
      document.getElementById("country_deaths").textContent = countryObject.deaths.toLocaleString("en-US")
      document.getElementById("country_recovered").textContent = countryObject.recovered.toLocaleString("en-US")
      document.getElementById("country_active").textContent = (countryObject.confirmed - (countryObject.deaths + countryObject.recovered)).toLocaleString('en-US')
      document.getElementById("country_critical").textContent = countryObject.critical.toLocaleString("en-US")
      document.getElementById("country_tests").textContent = countryObject.tests.toLocaleString("en-US")
      // round incidence rate/fatality ratio
      var incidenceNum = parseFloat(countryObject.Incidence_Rate);
      var roundedIncidence = incidenceNum.toFixed(2);
      document.getElementById("country_incidence_rate").textContent = roundedIncidence;
      var fatalityRatio = parseFloat(countryObject["Case-Fatality_Ratio"])
      var roundedFatalityRatio = fatalityRatio.toFixed(2);
      document.getElementById("country_fatality_ratio").textContent =  roundedFatalityRatio;
    }
  }
}

// create an async function to handle promised based execution order
(async() => {
  // populate select country menu once
  fillCountryMenu();

  // define some globals
  var update = async(text, updateTime) => {
    // download the data
    // console.log('Report: Download Started');
    var url = 'https://cov19.cc/report.json?v=' + Math.random();
    try {
      var res = await fetch(url);
      var report = await res.json();
    } catch (err) {
      console.log(err)
    }

    // set the last updated time
    document.getElementById('last_updated').innerHTML = moment.utc(report.last_updated).fromNow();

    var world = report.regions.world.totals;
    // adding totals
    document.getElementById('total_confirmed').textContent = world.confirmed.toLocaleString('en-US')
    document.getElementById('total_deaths').textContent = world.deaths.toLocaleString('en-US')
    document.getElementById('total_critical').textContent = world.critical.toLocaleString('en-US')
    document.getElementById('total_recovered').textContent = world.recovered.toLocaleString('en-US')
    document.getElementById('total_active').textContent = (world.confirmed - (world.deaths + world.recovered)).toLocaleString('en-US')

    // set data list
    //document.getElementById('data_container').innerHTML = createHTMLTemplate(report.regions.world.totals)
   
    // hide the loading icon
    $('#loader').hide();
  };

  // store last updated date
  var old_last_updated;

  // check for the last update
  var update_check = async() => {
    //console.log('Checking for updates');
    var res = await fetch('https://cov19.cc/last_updated.txt');
    var last_updated = await res.text();

    // if the last updated date is newer than the stored last updated date then update the variable and update the table with the new data
    // if (old_last_updated == last_updated) return;
    old_last_updated = last_updated;

    update(last_updated, Date.now());
  };

  // initialize
  update_check();

  // check for updates every 60 seconds
  setInterval(update_check, 60000);
})();

function createHTMLTemplate(data) {
  let html = ''
  for (let key in data) {
    html += `<div>${key}: ${data[key].toLocaleString('en-US')}</div>`
  }
  html += `<div>active: ${(data.confirmed - (data.deaths + data.recovered)).toLocaleString('en-US')}</div>`
  return html
}