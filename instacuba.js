var APPID = ''; // Your Yahoo Application ID
var DEG = 'c';  // c for celsius, f for fahrenheit

var xml = '';

var LAT = 23.1225;
var LNG = -82.386389;

if (Meteor.is_server) {
	Meteor.startup(function () {	});
		Meteor.methods({
			checkWeather: function () {
	  			this.unblock();
				return Meteor.http.get("http://api.yr.no/weatherapi/locationforecast/1.8/?lat=23.1225;lon=-82.386389");
			}
		});

}


if (Meteor.is_client) {

/* NOTE:  Template.<your var>.rendered
template must first render for d3 to be able to manipulate it
*/

var dataset = [-82.386389,23.1225];
Template.page.events({
  'mousedown div.map svg': function (event, template) {
    Session.set("selected", event.target.id);
	console.log(event.target.id);
  }
})

					
Template.page.rendered = function() {	
	var width = 750,
	    height = 350,
	    centered;

	var projection = d3.geo.azimuthal()
		.scale(4000)
		.mode("orthographic")
	    .origin([-82.386389,23.1225])
		.translate([-170,-75]);

	var path = d3.geo.path()
	    .projection(projection);

	var svg = d3.select("div.map").select("svg")
	    .attr("width", width)
	    .attr("height", height);

	svg.append("rect")
	    .attr("class", "background")
	    .attr("width", width)
	    .attr("height", height);
	
	var g = svg.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.append("g")
		.attr("id","country");
			
	d3.json("world.json", function(json) {
		g.selectAll("path")
		.data(json.features)
	    .enter().append("path")
		.attr("d", path);
	});
	
	var t = svg.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.append("g")
		.attr("id","towns");

	d3.json("cuba.json", function(json,i) {
		t.selectAll("path")
		.data(json.features)
	    .enter().append("path")
		.attr("d", path)
		.attr("id",function(json){return json.properties.name;})
		.attr("class", "town");
	});


};

//Havana 23.1168,-82.388557

Template.page.show_details = function() {
	Meteor.call('checkWeather', function(e, r) {
      console.log('e', e);
	  console.log('r', r);
	  xml = jQuery.parseXML(r.content);
    });
	return Session.get("selected");
};

Template.details.details = function() {
	console.log("ok");
	return Session.get("selected");
};

Template.details.temperature = function() {
	var temperature = [];
	temperature = jQuery(xml).find("time").each(function(temp){
		 jQuery(temp).find("temperature").attr("value");
	});
	console.log(temperature[0]);
};

//var url = 'https://api.instagram.com/v1/media/search?lat=23.140675688202197&lng=-82.36810684204102&distance=5000?client_id=4bcad2b298f448dbb74744e9bc1128b8&access_token=974427.4bcad2b.42eaba75eb9341e8bc16bf819789ed0b';
//

}