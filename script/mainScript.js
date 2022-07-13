let searchValue = document.querySelector(".search-box input"),
    searchBtn = document.querySelector(".search-icon"),
    info = document.querySelectorAll(".info div span");

let path, map, marker, ipLocation, latitude, longitude;

// path = "../countryCity.json";
path = "https://geo.ipify.org/api/v2/country,city?apiKey=at_pcV1zsrt30BojPME3jpZjMmkDF9Zi"

start(path);
// search button event
searchBtn.addEventListener("click", () => {
    search();
})

//start function, and creat map 
async function start(path) {
    ipLocation = await getData(path);
    info[0].innerHTML = ipLocation.ip;
    info[1].innerHTML = ipLocation.location.city + ", " + ipLocation.location.country;
    info[2].innerHTML = ipLocation.location.timezone;
    info[3].innerHTML = ipLocation.isp;
    latitude = ipLocation.location.lat;
    longitude = ipLocation.location.lng;
    createMap(latitude, longitude);
}

// search function
async function search() {
    const ipReg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/; // ip RegE
    const domainReg = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/; // domain RegE

    let requist;
    // check if the input is matching ip address
    if (ipReg.test(searchValue.value)) {
        requist = path + `&ipAddress=${searchValue.value}`; // creat api url by ip address
        ipLocation = await getData(requist);
        info[0].innerHTML = ipLocation.ip;
        info[1].innerHTML = ipLocation.location.city + ", " + ipLocation.location.country;
        info[2].innerHTML = ipLocation.location.timezone;
        info[3].innerHTML = ipLocation.isp;
        latitude = ipLocation.location.lat;
        longitude = ipLocation.location.lng;
        updateMape(latitude, longitude)
    }
    // check if the input is matching domain format like "google.com"
    else if (domainReg.test(searchValue.value)) {
        requist = path + `&domain=${searchValue.value}`; // creat api url by domain address
        ipLocation = await getData(requist);
        info[0].innerHTML = ipLocation.ip;
        info[1].innerHTML = ipLocation.location.city + ", " + ipLocation.location.country;
        info[2].innerHTML = ipLocation.location.timezone;
        info[3].innerHTML = ipLocation.isp;
        latitude = ipLocation.location.lat;
        longitude = ipLocation.location.lng;
        updateMape(latitude, longitude)
    }
    // if search text is wrong (not matching ip, or dmain format)
    else {
        searchValue.classList.add("error")
        searchValue.value = "Shoud be IP address format or domain like 'domain.com'";
        setTimeout(clear, 1000)
    }
}
// clear iput form if error
function clear() {
    searchValue.value = "";
    searchValue.classList.remove("error")
}

// get data function
async function getData(path) {
    const data = await fetch(path);
    const scrampled = await data.json();
    return scrampled
}

// create map function
function createMap(latitude, longitude) {
    map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup("Your IP address here " + latitude + ", " + longitude).openPopup();
    
    // little pan if in mobile mode
    if (window.innerWidth <= 900) {
        point = L.point(0, -160);
        map.panBy(point)
    }
}

// update map function
function updateMape(latitude, longitude) {
    map.removeLayer(marker); // rempove old marker layer
    map.flyTo([latitude, longitude], 13); // fly to new location
    marker = L.marker([latitude, longitude]).addTo(map); // add new marker layer, and add popup message
    marker.bindPopup("Your IP address here " + latitude + ", " + longitude).openPopup();
    
    // little pan if in mobile mode
    if (window.innerWidth <= 900) {
        // applay pan when animation finish
        map.on("zoomend", ()=> {
            point = L.point(0, -160);
            map.panBy(point)
        })
    }
}

