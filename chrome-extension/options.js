var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45267314-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var config = new Config();

function updateClearStatsInterval() {
  var select = document.getElementById("clear_stats_interval");
  var option = select.options[select.selectedIndex];
  config.clearStatsInterval = option.value;
  // TODO(nav): Set nextTimeToClear in Config
  restoreOptions();
}

function addIgnoredSite() {
  var newSite = document.getElementById("new_ignored_site").value;
  if (newSite.indexOf("http://") != 0 &&
      newSite.indexOf("https://") != 0) {
    alert("Include http:// or https:// prefix.");
    return;
  }

  chrome.extension.sendRequest(
     {action: "addIgnoredSite", site: newSite},
     function(response) {
       restoreOptions();
     });
}

function removeIgnoredSites() {
  var select = document.getElementById("ignored_sites");
  var ignoredSites = [];
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.selected == false) {
      ignoredSites.push(child.value);
    }
  }
  localStorage['ignoredSites'] = JSON.stringify(ignoredSites);
  restoreOptions();
}

// Restores options from localStorage, if available.
function restoreOptions() {
  var ignoredSites = localStorage['ignoredSites'];
  if (!ignoredSites) {
    return;
  }
  ignoredSites = JSON.parse(ignoredSites);
  var select = document.getElementById("ignored_sites");
  select.options.length = 0;
  for (var i in ignoredSites) {
    var option = document.createElement("option");
    option.text = ignoredSites[i];
    option.value = ignoredSites[i];
    select.appendChild(option);
  }

  var clearStatsInterval = config.clearStatsInterval;
  select = document.getElementById("clear_stats_interval");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == clearStatsInterval) {
      option.selected = true;
      break;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("add_ignored").addEventListener(
    "click", addIgnoredSite);
  document.getElementById("remove_ignored").addEventListener(
    "click", removeIgnoredSites);
  document.getElementById("clear_stats_interval").addEventListener(
    "change", updateClearStatsInterval);
  restoreOptions();
});

