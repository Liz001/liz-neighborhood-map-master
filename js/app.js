var places = [{
        'name': 'Cattedrale',
        'lat': 38.11437,
        'long': 13.3560026,
    },
    {
        'name': 'Fontana Pretoria',
        'lat': 38.1154832,
        'long': 13.3620746,
    },
    {
        'name': 'Martorana',
        'lat': 38.1147661,
        'long': 13.362868,
    },
    {
        'name': 'Cappella Palatina',
        'lat': 38.1108871,
        'long': 13.353536,
    },
    {
        'name': 'Castello della Zisa',
        'lat': 38.1167484,
        'long': 13.340999,
    },
    {
        'name': 'Teatro Massimo',
        'lat': 38.1201924,
        'long': 13.357230,
    },
    {
        'name': 'Palazzina cinese',
        'lat': 38.1667408,
        'long': 13.3303276,
    },
    {
        'name': 'Duomo di Monreale',
        'lat': 38.0821016,
        'long': 13.292367,
    },
];

var map;
var client_id = "UISD4REMOZSQ2J5NJAXNQFUXNNNN121QPQ5XVC1AGKWXMMVB";
var client_secret = "4FEOXYFGY0F0ASIPCTOVAPBSIJ44OO5JOYQFJYRGSQ2RUI0P";

var Location = function(data) {
    var self = this;

    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;

    // Foursquare
    this.category = "";
    this.address = "";

    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?' +
        'll=' + this.lat + ',' + this.long +
        '&client_id=' + client_id +
        '&client_secret=' + client_secret +
        '&v=20180411' +
        '&query=' + this.name +
        '&limit=1';

    $.ajax({
        type: "GET",
        url: foursquareURL,
        data: data,
        success: function(data) {
            self.category = data.response.venues[0].categories[0].name || '';
            self.address = data.response.venues[0].location.address || '';
        }
    }).fail(function() {
        alert("Foursquare error. Try reloading the page.");
    });;



    this.label = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.long),
        map: map,
        title: this.name
    });




    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });

    this.label.setMap(map);

    this.label.addListener('click', function() {
        self.contentString = `<div class="info-window-content">
                                <b>` + self.name + `</b><br />
                                ` + self.category + `<br />
                                ` + self.address + `
                            </div>`;
        self.infoWindow.setContent(self.contentString);
        self.infoWindow.open(map, this);
        self.label.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.label.setAnimation(null);
        }, 750);
    });

    this.bounce = function(place) {
        google.maps.event.trigger(self.label, 'click');
    };

}

function initMap() {
    var self = this;

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 38.115687,
            lng: 13.361267
        },
        zoom: 14
    });

    this.locationList = ko.observableArray([]);

    places.forEach(function(placeUnit) {
        self.locationList.push(new Location(placeUnit));
    });

    // Menu Filter
    this.query = ko.observable("")

    this.filteredList = ko.computed(function() {
        var filter = self.query().toLowerCase();
        if (!filter) {
            self.locationList().forEach(function(placeUnit) {
                placeUnit.label.setVisible(true);
            });
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(placeUnit) {
                var string = placeUnit['name'].toLowerCase();
                var result = (string.indexOf(filter) !== -1);
                placeUnit.label.setVisible(result);
                return result;
            });
        }
    }, self);

}

function initApp() {
    ko.applyBindings(new initMap());
}

function googleError() {
    alert("Google Map error. Try reloading the page.");
}
