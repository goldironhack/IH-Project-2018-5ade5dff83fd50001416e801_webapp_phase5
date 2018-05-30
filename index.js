
var statesIDs = Object.keys(DATASETS_API_SERIES_ID);
var map;

function getDataFromURL(URL){
	var data = $.get(URL, function(){
		console.log(URL)
	})
		.done( function(){
			//Success
			//console.log(data);
			DATASETS_API_SERIES_ID[data.responseJSON.request.series_id].push(data.responseJSON.series[0].data);
		})
		.fail( function(error){
			console.error(error);
		})
}

function updateAllDatasets(){
	for (var statesID of statesIDs){
		var URL = DATASET_QUERY_FORMAT + statesID;
		getDataFromURL(URL);
	}
}

function updateTable(){
	tableReference = $("#mainTableBody")[0];
	var newRow, co2Amount, state;

	for( var statesID of statesIDs){
		newRow = tableReference.insertRow(tableReference.rows.length);
		state = newRow.insertCell(0);
		co2Amount = newRow.insertCell(1);
		state.innerHTML = DATASETS_API_SERIES_ID[statesID][0]
		co2Amount.innerHTML = DATASETS_API_SERIES_ID[statesID][2][0][1];
	}
}


//---------------------------------  D3.JS  ---------------------------------------

function updateChart(){
	var svg = d3.select("svg");
		margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 1200 - margin.right - margin.left,
		height = 400 - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%Y");

	var x = d3.scaleTime()
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var line = d3.line()
		.x(function(data) { return x(data.date); })
		.y(function(data) { return y(data.close); })

	var data = DATASETS_API_SERIES_ID["EMISS.CO2-TOTV-TT-TO-TX.A"][2].map(function(data){
		return{
			date: parseTime(data[0]),
			close: data[1]
		};
	});

	x.domain(d3.extent(data, function(d) {return d.date; }));
	y.domain(d3.extent(data, function(d) {return d.close; }));

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	g.append("g")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy" , "0.7em")
		.text("Texas CO2 Millions metric tons production")

	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 1.5)
		.attr("d", line);


}


//------------------------------------------ Google Maps ---------------------------------------------

function onGoogleMapResponse() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16
	});
	
	
    

/*var country = "United States";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		};
	});
	*/
	
	map.data.loadGeoJson(
      'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
	
}

function drawAllCircles(){
	for (var i = 0; i < statesIDs.length; i++) {
		var circle = new google.maps.Circle({
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			map: map,
			center: DATASETS_API_SERIES_ID[statesIDs[i]][1],
			radius: DATASETS_API_SERIES_ID[statesIDs[i]][2][0][1] * 1000
		})
	}
}

function hospedaje() {
    var data = $.get("https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD")
    .done(function() {
        console.log(data.responseJSON)
        
        var dataHousing = data.responseJSON.data;
        
        for(var house of dataHousing) {
            
            var marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(house[23]),
                    lng: parseFloat(house[24])
                    
                },
                map: map,
                title: 'Hello World!'
              });
          
        }
        
        
    }) 
    .fail(function(error){
        console.error("Error: ", error)
    })
}

function neighborhood() {
    var data = $.get("https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD")
    .done(function() {
        console.log(data.responseJSON)
        
        var neijborjuds = data.responseJSON.data;
        
        for(var neijborjud of neijborjuds) {
            var estring = neijborjud[9];
            var loc1 = parseFloat(neijborjuds[estring.substr(7,24))]);
            var loc2 = parseFloat(neijborjuds[estring.substr(26,42))]);
            var marker = new google.maps.Marker({
                
                position: {
                    lat: loc1,
                    lng: loc2
                    
                },
                map: map,
                title: 'Hello World!'
              });
          
        }
        
    }) 
    .fail(function(error){
        console.error("Error: ", error)
    })
}


function crimes() {
    var data = $.get("https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD")
    .done(function() {
        console.log(data.responseJSON)
        
        var crimes = data.responseJSON.data;
        
        for(var cricriminal of crimes) {
            
            var marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(cricriminal[32]),
                    lng: parseFloat(cricriminal[31])
                    
                },
                map: map,
                title: 'Hello World!'
              });
          
        }
        
        
    }) 
    .fail(function(error){
        console.error("Error: ", error)
    })
}



function districts() {
    var data = $.get("https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson")
    .done(function() {
        console.log(data.responseJSON)
        
        var distritos = data.responseJSON.data;
        
        for(var distrito of distritos) {
            
            var marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(distrito[0]),
                    lng: parseFloat(distrito[1])
                    
                },
                map: map,
                title: 'Hello World!'
              });
          
        }
        
        
    }) 
    .fail(function(error){
        console.error("Error: ", error)
    })
}


function museum() {
    var data = $.get("https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD")
    .done(function() {
        console.log(data.responseJSON)
        
        var coordinates = data.responseJSON.data;
        
        for(var coordinate of coordinates) {
            
            var marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(coordinate[0]),
                    lng: parseFloat(coordinate[1])
                    
                },
                map: map,
                title: 'Hello World!'
              });
          
        }
        
        
    }) 
    .fail(function(error){
        console.error("Error: ", error)
    })
}



function gallery() {
    var data = $.get("https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD")
    .done(function() {
        console.log(data.responseJSON)
        
        var galerias = data.responseJSON.data;
        
        for(var galeria of galerias) {
            
            var marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(house[0]),
                    lng: parseFloat(house[1])
                    
                },
                map: map,
                title: 'Hello World!'
              });
          
        }
        
        
    }) 
    .fail(function(error){
        console.error("Error: ", error)
    })
}


$(document).ready( function(){
	/*$("#getDataButton").on("click", updateAllDatasets);
	$("#updateTableButton").on("click", updateTable);
	$("#updateChartButton").on("click", updateChart);
	$("#drawCircles").on("click", drawAllCircles);*/
	
	$("#hospedaje").on("click", hospedaje)
})