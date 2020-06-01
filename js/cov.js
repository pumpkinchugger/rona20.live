// popup window function
function togglePopup(){
  document.getElementById("popup-1").classList.toggle("active");
}

// create an async function to handle promised based execution order
(async() => {
  // define some globals
  var update = async(text, updateTime) => {
    // download the data
    console.log('Report: Download Started');
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
    console.log('Checking for updates');
    var res = await fetch('https://cov19.cc/last_updated.txt');
    var last_updated = await res.text();

    // if the last updated date is newer than the stored last updated date then update the variable and update the table with the new data
    // if (old_last_updated == last_updated) return;
    old_last_updated = last_updated;

    update(last_updated, Date.now());
  };

  // initialize
  update_check();

  // check for updates every 10 seconds
  setInterval(update_check, 10000);
})();

function createHTMLTemplate(data) {
  let html = ''
  for (let key in data) {
    html += `<div>${key}: ${data[key].toLocaleString('en-US')}</div>`
  }
  html += `<div>active: ${(data.confirmed - (data.deaths + data.recovered)).toLocaleString('en-US')}</div>`
  return html
}