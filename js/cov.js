// create an async function to handle promised based execution order
(async()=>{
    // define some globals
  var update = async()=>{

    // download the data
    console.log('Report: Download Started');
    var url = 'https://cov19.cc/report.json?v='+Math.random();
    var res = await fetch(url);
    var report = await res.json();
    
    // set the last updated time
    $('#last_updated').text(moment.utc(report.last_updated).fromNow());

    // get variable data
    var world = report.regions.world;

    var total_confirmed = report.regions.world.totals.confirmed;
    document.getElementById("total_confirmed").innerHTML = total_confirmed.commaSplit();

    var total_critical = world.totals.critical;
    document.getElementById("total_critical").innerHTML = total_critical.commaSplit();

    var total_deaths = world.totals.deaths;
    document.getElementById("total_deaths").innerHTML = total_deaths.commaSplit();

    var total_active = world.totals.confirmed - (world.totals.deaths + world.totals.recovered);
    document.getElementById("total_active").innerHTML = total_active.commaSplit();

    var total_recovered = world.totals.recovered;
    document.getElementById("total_recovered").innerHTML = total_recovered.commaSplit();

    // hide the loading icon
    $('#loader').hide();
    };

    // store last updated date
    var old_last_updated;

    // check for the last update
    var update_check = async()=>{
    console.log('Checking for updates');
    var res = await fetch('https://cov19.cc/last_updated.txt');
    var last_updated = await res.text();
        
    // if the last updated date is newer than the stored last updated date then update the variable and update the table with the new data
    if(old_last_updated == last_updated)return;
    old_last_updated = last_updated;

    update();
    };

    // initialize
    update_check();

    // check for updates every 60 seconds
    setInterval(update_check, 60000);
})();

    //cov19 prototypes
    String.prototype.commaSplit = function() {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    Number.prototype.commaSplit = String.prototype.commaSplit;


