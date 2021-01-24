var cryptoDiv = document.getElementById("crypto");

fetch("https://data.messari.io/api/v1/assets")
  .then((response) => response.json())
  .then((data) => crypto(data));

function crypto(response) {
  var cryptoCurrency = response.data;

  for (var i = 0; i < cryptoCurrency.length; i++) {
    if (cryptoCurrency[i].symbol.toLowerCase() == "aave") {
      i++;
    }
    if (cryptoCurrency[i].symbol.toLowerCase() == "wbtc") {
      cryptoCurrency[i].name = "Wrapped BTC";
    }
    cryptoDiv.innerHTML += `<div class="crypto-currency">
        <img src="media/symbols/${cryptoCurrency[i].symbol.toLowerCase()}.svg" alt="" />
        <h4>${cryptoCurrency[i].name} (${cryptoCurrency[i].symbol})</h4>
        <span class="price" id="${cryptoCurrency[i].metrics.market_data.price_usd}"></span>
      </div>
      <div class="hr"><div>`;
  }
}

function convertValue(currency, price) {
  for (var i = 0; i < price.length; i++) {
    switch (currency) {
      case "usd":
        price[i].innerHTML = `$${(Math.round(price[i].id * 100) / 100).toLocaleString()}`;
        break;
      case "eur":
        price[i].innerHTML = `€${(
          Math.round(price[i].id * 0.827849 * 100) / 100
        ).toLocaleString()}`;
        break;
      case "gbp":
        price[i].innerHTML = `£${(
          Math.round(price[i].id * 0.735916 * 100) / 100
        ).toLocaleString()}`;
        break;
      case "gau":
        price[i].innerHTML = `GAU ${(
          Math.round(price[i].id * 0.017 * 100) / 100
        ).toLocaleString()}`;
        break;
    }
  }
}

var optionsDiv = document.getElementById("options");
var radioButton = document.querySelectorAll(".radio");
var settings = document.getElementById("settings");

function options(click) {
  if (click == "open") {
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
