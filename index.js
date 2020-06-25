"use strict";

//List of species and their number of villagers.
var species = { "Alligator": 7, "Anteater": 7, "Bear": 15, "Bird": 13, "Bull": 6, "Cat": 23, "Chicken": 9, "Cow": 4, "Cub": 16, "Deer": 10, "Dog": 16, "Duck": 17, "Eagle": 9, "Elephant": 11, "Frog": 18, "Goat": 8, "Gorilla": 9, "Hamster": 8, "Hippo": 7, "Horse": 15, "Kangaroo": 8, "Koala": 9, "Lion": 7, "Monkey": 8, "Mouse": 15, "Octopus": 3, "Ostrich": 10, "Penguin": 13, "Pig": 15, "Rabbit": 20, "Rhino": 6, "Sheep": 13, "Squirrel": 18, "Tiger": 7, "Wolf": 11 };

var speciesSelector = document.getElementById('species-select');
var result = document.getElementById('result');
var currentFormula = document.getElementById('formula-span');

//Create Chart
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Probabilities',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            pointRadius: 0,
            borderWidth: 1
        }]
    },
    options: {
        title: {
            display: true,
            text: "Probabilities/number of tickets"
        } 
    }
});

//Creates the entries in the villager species select.
for (var villagerKind in species) {
    var opt = document.createElement('option');
    opt.value = villagerKind;
    opt.innerHTML = villagerKind;
    speciesSelector.appendChild(opt);
}

function calculateVillagersOdds() {
    //Get the user inputs.
    var numberOfVillager = species[document.getElementById("species-select").value];
    var selectedSpecies = document.getElementById("species-select").value.toLowerCase();
    var numberOwned = +document.getElementById("villager-number").value;
    var nmtNumber = +document.getElementById("nmt-number").value;
    var decimalPlaces = +document.getElementById("decimal-places").value;

    //Limits the number of decimal places to 1 (would also break toFixed() if user entered something smaller than 1).
    if (decimalPlaces < 1) {
        decimalPlaces = 1;
    }

    //Update the number of species that can be found if the user has complete species on his island (eg: all octopi and all cows...).
    var numberOfSpecies = Object.keys(species).length;
    if (document.getElementById('has-1-species').checked || document.getElementById('has-2-species').checked) {
        numberOfSpecies--;
        if (document.getElementById('has-2-species').checked) {
            numberOfSpecies--;
        }
    }
    var percent = (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100).toFixed(decimalPlaces);

    //Calculate the odds of finding a specific villager based on the number of tickets.
    var bernoulli = (100 - Math.pow((100 - (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100)) / 100, nmtNumber) * 100).toFixed(decimalPlaces);

    //Don't blame me if you don't get Raymond in 40000 islands.
    if (bernoulli == 100) {
        bernoulli = 99.99;
    }

    //Calcalates the fractional odds.
    var fractionalOdd = 1 / ((1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100) / 100);

    //Check if the percent is positive and not equal to 0. Which would mean that the number of villager entered is greater than the number within the species.
    if (Math.sign(percent) !== -1 && Math.sign(percent) !== 0 && isFinite(percent)) {
        result.innerHTML = "You have a <b>" + percent + "%</b> chance (<b>1:" + Math.round(fractionalOdd) + "</b>) of finding a specific <b>" + selectedSpecies + "</b> per Nook Miles Ticket and a <b>" + (1/numberOfSpecies * 100).toFixed(decimalPlaces) + "%</b> chance (<b>1:" + numberOfSpecies + "</b>) of finding any <b>" + selectedSpecies + "</b>.";
        currentFormula.innerHTML = "<br><br>Current formula: 1/" + numberOfSpecies + " * 1/(" + numberOfVillager + "-" + numberOwned + ")"; 

        //Check if the entered number of NMT is greater than 1. Otherwise the result would be the same as the line above.
        if (Math.sign(nmtNumber) !== -1 && Math.sign(nmtNumber) !== 0 && nmtNumber !== 1 && !isNaN(nmtNumber)) {
            result.innerHTML += "<br><br>If you use <b>" + nmtNumber + "</b> Nook Miles Tickets, you have a <b>" + bernoulli + "%</b> chance of encountering said villager.";
        }
    } else {
        result.innerHTML = "The number you entered is greater than the number of villagers within that species.";
        currentFormula.innerHTML = "";
    }

    updateChart(nmtNumber, numberOfSpecies, numberOwned, decimalPlaces, numberOfVillager);
    
}

function updateChart(nmtNumber, numberOfSpecies, numberOwned, decimalPlaces,  numberOfVillager) {
    var probArray = [];
    var labelArray = [];
    console.log(nmtNumber)
    for (let index = 0; index <= nmtNumber; index++) {
       probArray.push((100 - Math.pow((100 - (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100)) / 100, index) * 100).toFixed(decimalPlaces))
       labelArray.push("" + index);
        
    }
    console.log(probArray)
    console.log(labelArray)
    myChart.data.datasets[0].data = probArray;
    myChart.data.labels = labelArray;
    myChart.update();
}