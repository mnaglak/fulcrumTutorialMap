//Define map startup options, here defined to center on Gabii
	var mapOptions = {
		center: [41.8875, 12.72], //set center lat/long on your area of interest
		zoom: 18 , //set initial zoom level
		maxZoom : 24,  //set max zoom level
			}

//Creates map object according to map options 
	var map = new L.map('map', mapOptions); 

//Example of an externally called basemap
	var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}).addTo(map);

//Creation of panning and zooming functions from Leaflet.PanControl  
	L.control.pan().addTo(map);
	L.control.scale().addTo(map);



//adding a marker and binding text and images
var marker = L.marker( [41.887, 12.719] ).addTo(map);
var photoImg = "<img src='./siteImages/Fig. 1 Louvre Israel Silvestre.jpeg' width=300px/>";
marker.bindPopup("I am the Louvre. I do not belong at Gabii" + "<br>" + photoImg);




//imports layer and says that the popUp function should be called if any feature is clicked in this layer
var phaseA1 = new L.GeoJSON.AJAX("PhaseA1_geojsonLocal.geojson",
			{onEachFeature: popUp});
			phaseA1.addTo(map);	

//Example of a locally called tiled basemap created from a geotiff using gdal2tiles, adjust opacity, zoom, attribution, etc. as desired
	var airPhoto2010 = L.tileLayer('./airPhoto2010/{z}/{x}/{y}.png', {tms: true, opacity: 1, attribution: "", minZoom: 18, maxZoom: 24}); 
//replace airPhoto2010 with the folder name containing your tiles in both locations
	//airPhoto2010.addTo(map); //adds the airPhoto variable to the map; commented out for the later control box

//baseLayers is a layer group of all the layers we want to act as basemaps
var baseLayers = {
	"Satellite Imagery" : Esri_WorldImagery,
	"2010 Imagery" : airPhoto2010
	};
//overlayMaps is a layer group of all the layers we want to act as overlays
var overlayMaps = {
	"Phase1" : phaseA1,
	"Marker" : marker
	};
//adds the layer control to the map
L.control.layers(baseLayers, overlayMaps).addTo(map);

//generalized function popup box for any .geojson
	function popUp(f,l){
		var out = [];
		if (f.properties){
			for(key in f.properties){
			out.push(key+": "+f.properties[key]);
			}
		}
		l.bindPopup(out.join("<br />"));
	}

//add Phases 2 and 3 to the map
var phaseA2 = new L.GeoJSON.AJAX("PhaseA2_geojsonLocal.geojson",
			{onEachFeature: popUp});
				
var phaseA3 = new L.GeoJSON.AJAX("PhaseA3_geojsonLocal.geojson",
			{onEachFeature: popUp});
			
//Create Timeline Slider 
 var slider = d3
    .sliderHorizontal()
    .min(1)
    .max(3)
    .step(1)
	.ticks(2)
	.tickFormat(d3.format(',.0f')) //integer format. Others possible
    .width(150)
    .displayValue(true)
    .on('end', val => { //tells it to run onSlider when engaged with
	    onSlider(val);
    });

  d3.select('#slider') //this edits the timeline location, while the .css edits the box
    .append('svg')
    .attr('width', 200)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(20,10)')
    .call(slider); 

//What to do on each slider value?
	function onSlider(val) { //function receives the value on the slider
			if (val == 1) {
				phaseA1.addTo(map);
				phaseA2.remove();
				phaseA3.remove();
			};
			
			if (val == 2) {
				phaseA2.addTo(map);
				phaseA1.remove();
				phaseA3.remove();
			}; 
			if (val == 3) {
				phaseA3.addTo(map);
				phaseA1.remove();
				phaseA2.remove();
			}; 
	}

//Initial filter to open the map with
	onSlider(1);