var cryptoDiv = document.getElementById("crypto");

fetch("https://data.messari.io/api/v1/assets")
  .then((response) => response.json())
  .then((data) => crypto(data));

function crypto(response) {
  var cryptoCurrency = response.data;
  console.log(response);

  for (var i = 0; i < cryptoCurrency.length; i++) {
    switch (cryptoCurrency[i].symbol.toLowerCase()) {
      case "wbtc":
        cryptoCurrency[i].name = "Wrapped BTC";
        break;
    }
    output(cryptoCurrency[i]);
  }

  save(cryptoCurrency);
}

function output(array) {
  cryptoDiv.innerHTML += `<div class="crypto-currency" onclick="details('${array.symbol.toLowerCase()}')">
    <img src="media/symbols/${array.symbol.toLowerCase()}.svg" alt="" />
    <h4>${array.name} (${array.symbol})</h4>
      <span class="price" id="${array.metrics.market_data.price_usd}"></span>
    </div>
    <div class="hr"><div>`;
}

function save(data) {
  if (sessionStorage.getItem("crypto") != null) {
    sessionStorage.removeItem("crypto");
  }
  var sessionSave = JSON.parse(sessionStorage.getItem("crypto")) || [];
  sessionSave.push(data);
  sessionStorage.setItem("crypto", JSON.stringify(sessionSave));
}

var convertPrice = 0;
var symbolPrice;

function convertValue(currency, price) {
  for (var i = 0; i < price.length; i++) {
    switch (currency) {
      case "usd":
        convertPrice = `${(Math.round(price[i].id * 100) / 100).toLocaleString()}`;
        symbolPrice = "$";
        break;
      case "eur":
        convertPrice = `${(Math.round(price[i].id * 0.827849 * 100) / 100).toLocaleString()}`;
        symbolPrice = "€";
        break;
      case "gbp":
        convertPrice = `${(Math.round(price[i].id * 0.735916 * 100) / 100).toLocaleString()}`;
        symbolPrice = "£";
        break;
      case "gau":
        convertPrice = `${(Math.round(price[i].id * 0.017 * 100) / 100).toLocaleString()}`;
        symbolPrice = "GAU";
        break;
    }
    price[i].innerHTML = symbolPrice + convertPrice;
  }
}

var optionsDiv = document.getElementById("options");
var radioButton = document.querySelectorAll(".radio");
var settings = document.getElementById("settings");

function options(click) {
  if (click) {
    optionsDiv.style.display = "block";
    settings.style.animation = "rotate 5s linear infinite";
    document.body.style.overflow = "hidden";
  } else {
    optionsDiv.style.display = "none";
    settings.style.animation = "";
    document.body.style.overflow = "visible";
  }
}

setInterval(function () {
  var price = document.querySelectorAll(".price");
  if (radioButton[0].checked) {
    convertValue("usd", price);
    localStorage.setItem("convert", 0);
  } else if (radioButton[1].checked) {
    convertValue("eur", price);
    localStorage.setItem("convert", 1);
  } else if (radioButton[2].checked) {
    convertValue("gbp", price);
    localStorage.setItem("convert", 2);
  } else {
    convertValue("gau", price);
    localStorage.setItem("convert", 3);
  }
});

var convert = localStorage.getItem("convert");

if (convert != null) {
  radioButton[convert].checked = true;
} else {
  radioButton[0].checked = true;
}

var savedCrypto = JSON.parse(sessionStorage.getItem("crypto"))[0];

function search() {
  var searchInput = document.getElementById("search").value;
  cryptoDiv.innerHTML = "";

  for (var i = 0; i < savedCrypto.length; i++) {
    if (savedCrypto[i].name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1) {
      output(savedCrypto[i]);
    }
  }

  var searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = `Search results found for "${searchInput}"`;

  if (searchInput.length == 0) {
    searchResults.innerHTML = "";
  }
}

var detailsDiv = document.getElementById("details");

function details(type) {
  detailsDiv.innerHTML = "";
  detailsDiv.style.display = "block";
  detailsDiv.innerHTML = `<i class="fas fa-times" id="close" onclick="closeDetails()"></i>`;
  document.body.style.overflow = "hidden";
  for (var i = 0; i < savedCrypto.length; i++) {
    if (savedCrypto[i].symbol.toLowerCase() == type) {
      detailsDiv.innerHTML += `
      <div class="type">
        <img src="media/symbols/${savedCrypto[i].symbol.toLowerCase()}.svg" alt="" />
        <h4>${savedCrypto[i].name}</h4>
      </div>
      <div class="more">
        <h4>Relase date: ${savedCrypto[i].metrics.misc_data.asset_created_at}</h4>
        <h4>All Time High: $${savedCrypto[i].metrics.market_data.price_usd.toLocaleString()}</h4>
        <h4>Volume 24h: $${savedCrypto[
          i
        ].metrics.market_data.volume_last_24_hours.toLocaleString()}</h4>
        <h4>Mining Algorithm: ${savedCrypto[i].metrics.mining_stats.mining_algo}</h4>
      </div>`;
    }
  }
}

function closeDetails() {
  detailsDiv.style.display = "none";
  document.body.style.overflow = "visible";
}

window.addEventListener("scroll", () => {
  detailsDiv.style.top = window.scrollY + window.innerHeight / 2 + "px";
});
