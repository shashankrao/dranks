'use strict';

var target = 2000,
    cupSize,
    addDrinkButtonNode = $('#add-drink-button'),
    settingsPanelNode = $('.settings-panel'),
    settingsButtonNode = $('#settings-button'),
    settingsCupSizeNode = $('.settings-panel-cup-size-input'),
    saveSettingsButton = $('#save-settings-button'),
    bodyOverlayNode = $('.body-overlay'),
    waterQuantityNode = $('.water-quantity'),
    waterQuantityValueNode = $('.water-log-quantity-value'),
    waterQuantityCupNode = $('.water-log-quantity-cups'),
    waterQuantityPercentageNode = $('.water-quantity-percentage'),
    cupNode = $('.cup'),
    cupCheckNode = $('.cup-check'),
    cupNumberNode = $('.cup-number'),
    historyLogNode = $('.history-log-list'),
    saveTime,
    drinkLog,
    newDrinkLog,
    generateId,
    cupSizeSetting,
    canvas = document.createElement('canvas'),
    ctx,
    faviconImg = document.createElement('img'),
    link = document.getElementById('favicon').cloneNode(true),
    todayDrinks;

var drinkLog = [];
var drinkInfo = {};

function dynamicFavicon() {
    if(canvas.getContext) {
        canvas.height = canvas.width = 16;
        ctx = canvas.getContext('2d');
        faviconImg.onload = function () {
            ctx.drawImage(this, 0, 0);
            ctx.font = 'bold 10px "helvetica", sans-serif';
            ctx.fill();
            ctx.fillStyle = '#008AE8';
            ctx.textAlign = 'center';
            ctx.fillText(todayDrinks.length, 8, 12);
            link.href = canvas.toDataURL('image/png');
            document.head.appendChild(link);
        };
        faviconImg.src = 'favicon.png';
    }
};


// New drink constructor
function newDrinkInfo() {

    var now = new Date();

    drinkInfo = {
        drinkAmount: cupSize,
        date: [ now.getMonth() + 1, now.getDate(), now.getFullYear() ],
        time: [ now.getHours(), now.getMinutes(), now.getSeconds() ],
    };
}

function totalDrinks() {
    var count = 0;  
    for (var i=0, n=todayDrinks.length; i<n; i++){
        count += todayDrinks[i];
    }
    return count;
};

function addDrink() {
    todayDrinks.push(cupSize);
    newDrinkInfo();
    drinkLog.push(drinkInfo)
    localStorage['todayDrinks'] = JSON.stringify(todayDrinks);
    localStorage['drinkLog'] = JSON.stringify(drinkLog);

    console.log(todayDrinks);
    console.log(totalDrinks());
    console.log(percentageCalc());
    console.log(todayDrinks.length)

    var percentage = percentageCalc().toFixed(2);
    var cupNumber = todayDrinks.length;
    dynamicFavicon();
    cupNumberNode.html(cupNumber);
    historyLogNode.html(drinkLog.length)
    cupNode.eq(cupNumber - 1).addClass('cup--active');
    waterQuantityNode.css('height',percentage + '%');
    waterQuantityValueNode.html('You drank ' + Math.round(totalDrinks()) + 'ml');
    waterQuantityCupNode.html(todayDrinks.length + ' cups down');
    waterQuantityPercentageNode.html('You drank ' + '<strong>' + Math.round(totalDrinks()) + 'ml ' + '</strong>' + 'of water, '+ '<strong>' + percentage + '</strong>' + '%' + 'of the recommended daily intake');
};

function removeDrink() {
    if (todayDrinks.length > 0 && confirm('Are you sure you want to remove last drink?')){
        todayDrinks.pop();
        drinkLog.pop();
    } else {
        // do nothing
    }

    localStorage['todayDrinks'] = JSON.stringify(todayDrinks);
    localStorage['drinkLog'] = JSON.stringify(drinkLog);

    var percentage = percentageCalc().toFixed(2);
    var cupNumber = todayDrinks.length;
    dynamicFavicon();
    cupNode.eq(cupNumber).removeClass('cup--active');
    cupNumberNode.html(cupNumber);
    waterQuantityNode.css('height',percentage + '%');
    
    if (todayDrinks.length == 0) {
            waterQuantityPercentageNode.html("You drank nothing today.")
        } else {
            waterQuantityPercentageNode.html('You drank ' + '<strong>' + Math.round(totalDrinks()) + 'ml ' + '</strong>' + 'of water, '+ '<strong>' + percentage + '</strong>' + '%' + 'of the recommended daily intake');
        };
};

function percentageCalc() {
    var totalDrinksNumber = totalDrinks();

    return totalDrinksNumber / target * 100;
};

function resetDay() {
    todayDrinks.length = 0;
    console.log(totalDrinks());
    localStorage["todayDrinks"] = JSON.stringify(todayDrinks);

    var percentage = percentageCalc().toFixed(2);
    cupNumberNode.html(todayDrinks.length);
    cupNode.removeClass('cup--active');
    waterQuantityNode.css('height',percentage + '%');
    waterQuantityValueNode.html('You drank ' + Math.round(totalDrinks()) + 'ml');
    waterQuantityCupNode.html(todayDrinks.length + ' cups down');
    waterQuantityPercentageNode.html('You drank ' + '<strong>' + Math.round(totalDrinks()) + 'ml ' + '</strong>' + 'of water, '+ '<strong>' + percentage + '</strong>' + '%' + 'of the recommended daily intake');
};

function toggleSetup() {
    settingsPanelNode.toggleClass('settings-panel--active');
    bodyOverlayNode.toggleClass('body-overlay--active')
}

function init() {
    if (window.localStorage) {
        var percentage;

        // Set favicon
        dynamicFavicon();

         
        // Retreive existing value from localStorage or init empty array
        todayDrinks = JSON.parse(localStorage.getItem('todayDrinks')) || [];
        drinkLog = JSON.parse(localStorage.getItem('drinkLog')) || [];
        cupSizeSetting = JSON.parse(localStorage.getItem('cupSize')) || 250;
        cupSize = cupSizeSetting;
        var percentage = percentageCalc().toFixed(2);
        
        // Set water height
        waterQuantityNode.css('height',percentage + '%');
        waterQuantityValueNode.html('You drank ' + Math.round(totalDrinks()) + 'ml');

        // Set message
        if (todayDrinks.length == 0) {
            waterQuantityPercentageNode.html("You drank nothing today.")
        } else {
            waterQuantityPercentageNode.html('You drank ' + '<strong>' + Math.round(totalDrinks()) + 'ml ' + '</strong>' + 'of water, '+ '<strong>' + percentage + '</strong>' + '%' + 'of the recommended daily intake');
        };

        // Set cup checks
        cupNumberNode.html(todayDrinks.length);
        cupNode.slice(0, todayDrinks.length).addClass('cup--active');
    } else {
        // Handle no local storage
        console.log('Browser doesn\'t support localStorage');
    }
     
        // Check if last drink's date matches today's date
        var now = new Date();
        var todayDate = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
        var lastDrinkDate = drinkLog[ drinkLog.length - 1 ].date

        if (lastDrinkDate[0] != todayDate[0] || lastDrinkDate[1] != todayDate[1] || lastDrinkDate[2] != todayDate[2]) {
            alert("It's a new day!");
            resetDay();
        };
}

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

$(document).ready(init);

$(document).keypress(function(e) {
  if(e.charCode == 61) {
    addDrink();
  } else {
    //nothing
  }
});

$(document).keypress(function(e) {
  if(e.charCode == 45) {
    removeDrink();
  } else {
    //nothing
  }
});

function saveSettings() {
    cupSizeSetting = settingsCupSizeNode.val();
    localStorage["cupSize"] = cupSizeSetting;
    window.reload();
};

bodyOverlayNode.click(function(){
    toggleSetup();
});
