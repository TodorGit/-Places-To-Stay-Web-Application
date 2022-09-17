const { response } = require("express");

function addButtonAction(){

    document.getElementById('search-button').addEventListener('click', () =>{

        const region = document.getElementById('search-box').value;
        searchID(region)
    });
}

//Search by ID function
async function searchID(region){

    const response = await fetch(`/search/${region}`)
    const data = await response.json();
    let avgLatitude = 0.0; 
    let avgLong = 0.0;
    data.forEach(el => {
        avgLatitude += el.latitude;
        avgLong += el.longitude;
    });

    avgLatitude = avgLatitude / data.length;
    avgLong = avgLong / data.length;

    setMap(avgLatitude, avgLong, data);

}


//Map function
function setMap(lat, long, regions){

    const attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";
    L.tileLayer
    ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: attrib } ).addTo(map);
        
   // const position = [51.53988, 0.053980]   
    const position = [lat, long]        
    map.setView(position, 14);


    if(regions.length > 0){

        for(let i = 0; i < regions.length;i++){
            marker = new L.marker([regions[i].latitude, regions[i].longitude])
            .bindPopup( '<a href="booking/"'  + regions[i].ID + 'target="_blank" rel="noopener">' + regions[i].type + '</a>' )
            .addTo(map);
        }
    }


diplsay_location(regions);

}

//Dynamic table 
function diplsay_location(regions){
    document.getElementById('list').innerHTML='';
    var table = document.createElement('table');
    var thread = document.createElement('thread');
    var tbody = document.createElement('tbody');
    table.appendChild(thread);
    table.appendChild(tbody);
    document.getElementById('list').appendChild(table);

    let rowOne = document.createElement('tr');
    let rowOneHeadingOne = document.createElement('th');
    rowOneHeadingOne.innerHTML = 'Name';
    let rowOneHeadingTwo = document.createElement('th');
    rowOneHeadingTwo.innerHTML = 'Type';
    let rowOneHeadingThree = document.createElement('th');
    rowOneHeadingThree.innerHTML = 'Location';
    let rowOneHeadingFour = document.createElement('th');
    rowOneHeadingFour.innerHTML = 'Click and Book';
    rowOne.appendChild(rowOneHeadingOne);
    rowOne.appendChild(rowOneHeadingTwo);
    rowOne.appendChild(rowOneHeadingThree);
    rowOne.appendChild(rowOneHeadingFour);
    thread.appendChild(rowOne);

    //the below will add the data 
    regions.forEach((object ) =>{

    let rowTwo = document.createElement('tr');
    let rowTwoHeadingOne = document.createElement('td');
    rowTwoHeadingOne.innerHTML = object.name;
    let rowTwoHeadingTwo = document.createElement('td');
    rowTwoHeadingTwo.innerHTML = object.type;
    let rowTwoHeadingThree = document.createElement('td');
    rowTwoHeadingThree.innerHTML =  object.location;
    let rowTwoHeadingFour = document.createElement('td');
    rowTwoHeadingFour.innerHTML = `<button class = "bookButton" id = ${object.ID} > Book </button>`;
    rowTwo.appendChild(rowTwoHeadingOne);
    rowTwo.appendChild(rowTwoHeadingTwo);
    rowTwo.appendChild(rowTwoHeadingThree);
    rowTwo.appendChild(rowTwoHeadingFour);
    thread.appendChild(rowTwo);

});

document.querySelectorAll('.bookButton').forEach(item => {
    item.addEventListener('click', event => {
        alert(item.id);
        book(item.id);
    })
});


}


// Sending data - booking process 

async function book(id){

    var object = {accID :id, thedate :220601, username: 'admin', npeople: 1};

    fetch('/booking', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json',}, 
        body: JSON.stringify(object)
    })
    .then((response) => response.json())
    .then((data) => {alert('Success');})
    .catch((error) => {alert('Error Found in adding the data!')})
   

}



// async function book(id)
// {
//     var object={accID:id, thedate:220601, username:"admin", npeople:1};
//     fetch('/booking', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json',},
//         body: JSON.stringify(object)
//     })
//     .then((response)=>response.json())
//     .then((data)=>{alert("Success");})
//     .catch((error)=>{alert("Found error in adding data")})
// }


// function displayLocation(regions){


//     var num = 1;
//     var table = document.createElement('table');
//     var tr = table.insertRow(-1);
//     for(var i = 0; i < regions.length -2;i++){
//         var th = document.createElement('th');
//         th.innerHTML = col[i];
//         tr.child
//     }

//     document.getElementById('lists').appendChild(table)
// }

    // const spotOne = L.marker(position).addTo(map) // adding a marker on the map
    // var info = 'This is East Ham'
    // spotOne.bindPopup(info);

    // spotOne.on("click", e => {

    //     alert("Click..")
    // });