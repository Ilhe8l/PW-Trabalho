document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("btn");
    const switchDiv = document.querySelector(".switch");

    function leftClick() {
        btn.style.left = '0';
    }

    function rightClick() {
        const switchWidth = switchDiv.offsetWidth;
        const btnWidth = btn.offsetWidth;
        btn.style.left = (switchWidth - btnWidth - 5) + 'px';
    }

    // Adiciona event listeners aos botões
    document.querySelector(".toggle-btn:nth-of-type(1)").addEventListener("click", leftClick);
    document.querySelector(".toggle-btn:nth-of-type(2)").addEventListener("click", rightClick);

    // Ajusta a posição do botão ao redimensionar a janela
    window.addEventListener("resize", function () {
        if (btn.style.left !== '0') {
            rightClick();
        }
    });
});

let map;
let currentInfoWindow = null;
let geocoder;
let markersArray = []; // Armazena todos os marcadores para fácil remoção

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -20.3155, lng: -40.3128 }, // Vitória - ES
        zoom: 12
    });

    geocoder = new google.maps.Geocoder();

    // Carrega os marcadores armazenados no localStorage
    loadMarkers();

    map.addListener('rightclick', function (event) {
        showAddLocationForm(event.latLng);
    });
}

function showAddLocationForm(location) {
    if (currentInfoWindow) {
        currentInfoWindow.close();
    }

    geocoder.geocode({ location: location }, function (results, status) {
        if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            const addressComponents = results[0].address_components;
            let street = '';
            let neighborhood = '';
            let city = '';

            for (const component of addressComponents) {
                if (component.types.includes('route')) {
                    street = component.long_name;
                }
                if (component.types.includes('sublocality') || component.types.includes('political')) {
                    neighborhood = component.long_name;
                }
                if (component.types.includes('administrative_area_level_2')) {
                    city = component.long_name;
                }
            }

            const formHtml = `
                <div id="form">
                    <h3>Adicionar Local</h3>
                    <label>Nome:</label><br>
                    <input type="text" id="name"><br>
                    <label>Descrição:</label><br>
                    <textarea id="description"></textarea><br>
                    <label>Imagem:</label><br>
                    <input type="file" id="image"><br>
                    <p>Endereço: ${address}</p>
                    <p>Rua: ${street}</p>
                    <p>Bairro: ${neighborhood}</p>
                    <p>Cidade: ${city}</p>
                    <button onclick="addMarker('${street}', '${neighborhood}', '${city}', ${location.lat()}, ${location.lng()})">Adicionar</button>
                </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
                content: formHtml,
                position: location
            });

            infoWindow.open(map);
            currentInfoWindow = infoWindow;
        } else {
            alert('Geocoder falhou devido a: ' + status);
        }
    });
}

function addMarker(street, neighborhood, city, lat, lng) {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];

    let imageUrl = '';
    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = function () {
            imageUrl = reader.result;
            saveMarker({ lat, lng, name, description, imageUrl, street, neighborhood, city });
            createMarker({ lat, lng, name, description, imageUrl, street, neighborhood, city });
        }
        reader.readAsDataURL(imageFile);
    } else {
        saveMarker({ lat, lng, name, description, street, neighborhood, city });
        createMarker({ lat, lng, name, description, street, neighborhood, city });
    }

    if (currentInfoWindow) {
        currentInfoWindow.close();
    }
}

function saveMarker(marker) {
    let markers = JSON.parse(localStorage.getItem('markers')) || [];
    markers.push(marker);
    localStorage.setItem('markers', JSON.stringify(markers));
}

function loadMarkers() {
    let markers = JSON.parse(localStorage.getItem('markers')) || [];
    markers.forEach(marker => {
        createMarker(marker);
    });
}

function createMarker({ lat, lng, name, description, imageUrl, street, neighborhood, city }) {
    const location = { lat: parseFloat(lat), lng: parseFloat(lng) };

    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: name
    });

    markersArray.push(marker); // Adiciona o marcador ao array

    marker.addListener('click', function () {
        displayMarkerInfo({ name, description, imageUrl, street, neighborhood, city, lat, lng });
    });

    map.panTo(location);
}

function displayMarkerInfo({ name, description, imageUrl, street, neighborhood, city, lat, lng }) {
    const infoDiv = document.querySelector(".info");
    const infoContent = `
        <h3>${name}</h3>
        <p>${description}</p>
        ${imageUrl ? `<img src="${imageUrl}" alt="${name}" style="max-width: 100px; max-height: 100px;">` : ''}
        <p>Rua: ${street}</p>
        <p>Bairro: ${neighborhood}</p>
        <p>Cidade: ${city}</p>
        <p>Latitude: ${lat}</p>
        <p>Longitude: ${lng}</p>
        <button onclick="deleteMarker(${lat}, ${lng})">Excluir</button>
    `;
    infoDiv.innerHTML = infoContent;
}

function searchLocation() {
    const address = document.getElementById('searchBox').value;
    geocoder.geocode({ address: address }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
        } else {
            alert('Geocode não foi bem-sucedido por causa de: ' + status);
        }
    });
}

// Função para excluir um marcador
function deleteMarker(lat, lng) {
    // Remover o marcador do localStorage
    let markers = JSON.parse(localStorage.getItem('markers')) || [];
    markers = markers.filter(marker => marker.lat !== lat || marker.lng !== lng);
    localStorage.setItem('markers', JSON.stringify(markers));

    // Remover o marcador do mapa e do array markersArray
    markersArray.forEach((marker, index) => {
        if (marker.position.lat() === lat && marker.position.lng() === lng) {
            marker.setMap(null); // Remove o marcador do mapa
            markersArray.splice(index, 1); // Remove o marcador do array
        }
    });

    // Limpar a div de informações
    document.querySelector('.info').innerHTML = '';
}

// Função para criar um marcador no mapa e adicionar suas informações na div info
function createMarker({ lat, lng, name, description, imageUrl, street, neighborhood, city }) {
    const location = { lat: parseFloat(lat), lng: parseFloat(lng) };

    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: name
    });

    markersArray.push(marker); // Adiciona o marcador ao array

    marker.addListener('click', function () {
        const infoDiv = document.querySelector('.info');
        const infoWindowContent = `
            <h3>${name}</h3>
            <p>${description}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="${name}" style="max-width: 100px; max-height: 100px;">` : ''}
            <p>Rua: ${street}</p>
            <p>Bairro: ${neighborhood}</p>
            <p>Cidade: ${city}</p>
            <p>Latitude: ${lat}</p>
            <p>Longitude: ${lng}</p>
            <button onclick="deleteMarker(${lat}, ${lng})">Excluir</button>
        `;
        infoDiv.innerHTML = infoWindowContent;
    });

    map.panTo(location);
}
