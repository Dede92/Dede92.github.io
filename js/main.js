
// Radio button

var current_choice = 2;
var current_json = '/data/cal_data_year.csv';

function handleClick(myRadio) {
    current_choice = myRadio.value;

    if (+current_choice == 0 ){
    	current_json = '/data/cal_data_day.csv';
    	console.log(0);
    } else if ( current_choice == 1) {
    	current_json = '/data/cal_data_month.csv';
    	console.log(1);
    } else if ( current_choice == 2) {
    	current_json = '/data/cal_data_year.csv';
    	console.log(2);
    }
}

var day_slider = $("#ex_day").slider();
var month_slider = $("#ex_month").slider();
var year_slider = $("#ex_year").slider();

var original_day;
var original_month;
var original_year;

var check_day = $('input[name="choice"]:checked').val();
var check_month = $('input[name="choice"]:checked').val();
var check_year = $('input[name="choice"]:checked').val();

$('#ex_day').slider().on('slideStart', function(ev){
    original_day = day_slider.val();
});

$('#ex_month').slider().on('slideStart', function(ev){
    original_month = month_slider.val();
});

$('#ex_year').slider().on('slideStart', function(ev){
    original_year = year_slider.val();
});
// Call a method on the slider
$("#ex_day").on("slide", function(slideEvt) {
	$("#ex_daySliderVal").text(slideEvt.value);
	var day = day_slider.val();

	if ((day-original_day) != 0)  {

		var month = month_slider.val();
		var year = year_slider.val();

		if (day.toString().length < 2){
			var myNumber = day;
			day = ("0" + myNumber).slice(-2);
		}

		if (month.toString().length < 2){
			var myNumber = month;
			month = ("0" + myNumber).slice(-2);
		}

	    var date = "" + year + month + day;

	    updateData(day, month,year);

	    original_day=day;
	    console.log(date)
	}
	
});

// Call a method on the slider
$("#ex_month").on("slide", function(slideEvt) {
	$("#ex_monthSliderVal").text(slideEvt.value);
	var month = month_slider.val();

	if ((month-original_month) != 0)  {

		var day = day_slider.val();
		var year = year_slider.val();

		if (day.toString().length < 2){
			var myNumber = day;
			day = ("0" + myNumber).slice(-2);
		}

		if (month.toString().length < 2){
			var myNumber = month;
			month = ("0" + myNumber).slice(-2);
		}

	    var date = "" + year + month + day;

	    updateData(day, month,year);

	    original_month=month;
	    console.log(date)
	}
});

// Call a method on the slider
$("#ex_year").on("slide", function(slideEvt) {
	$("#ex_yearSliderVal").text(slideEvt.value);
	var year = year_slider.val();

	if ((year-original_year) != 0)  {

		var day = day_slider.val();
		var month = month_slider.val();

		if (day.toString().length < 2){
			var myNumber = day;
			day = ("0" + myNumber).slice(-2);
		}

		if (month.toString().length < 2){
			var myNumber = month;
			month = ("0" + myNumber).slice(-2);
		}

	    var date = "" + year + month + day;

	    updateData(day, month,year);
	    original_year=year;
	    console.log(date)
	}
});

function myFunction() {
    var day = day_slider.val();
	var month = month_slider.val();
	var year = year_slider.val();

	if (day.toString().length < 2){
		var myNumber = day;
		day = ("0" + myNumber).slice(-2);
	}

	if (month.toString().length < 2){
		var myNumber = month;
		month = ("0" + myNumber).slice(-2);
	}

    var date = "" + year + month + day;
    console.log(date);
    updateData(day,month,year);
}

myFunction()

var width = 750,
	height = 600;

var scale0 = 2200;
var translateX = -118;
var translateY = 37.5;

// set projection
var projection = d3.geo.mercator()
					.scale(scale0)
					.center([translateX, translateY]);

// create path variable
var path = d3.geo.path()
    		.projection(projection);

// create svg variable
var svg = d3.select("body").selectAll("div.svgsvg").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style('fill', 'none');

var g = svg.append("g");

var zoom = d3.behavior.zoom()
				.on("zoom",function() {
				g.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")")
				});

svg.call(zoom);
  

var color_domain = ["<400", "400-549", "550-699", "700-849", "850-1000"];
var color_range = ["#0099cc", "#0033cc", "#6600cc","#cc0099", "#cc0000"];
var color = d3.scale.ordinal()
    .domain(color_domain)
    .range(color_range);

var legendRectSize = 18;
var legendSpacing = 4;

var legend = svg
				.append("g")
				.selectAll("g")
				.data(color.domain())
				.enter()
				.append('g')
				.attr('class', 'legend')
				.attr('transform', function(d, i) {
					var height = legendRectSize ;
					var offset =  0;
					var horz = legendRectSize;
					var vert = i * height - offset;
					return 'translate(' + horz + ',' + vert + ')';
				});

legend.append('rect')
	.attr('width', legendRectSize)
	.attr('height', legendRectSize)
	.style('fill', color)
	.style('stroke', color);

legend.append('text')
	.attr('x', legendRectSize + legendSpacing)
	.attr('y', legendRectSize - legendSpacing)
	.text(function(d) { return d; })
    .attr("font-family","sans-serif")
      .attr("font-size","11px")
      .attr("stroke","black");;

d3.json("/data/calif_geo.json", function(error, topo) { 

    console.log(topo);
    // add a rectangle to see the bound of the svg
	g.append("rect")
		.attr('width', width+100)
		.attr('height', height+100)
		// .style('stroke', 'black') //Contour
		.style('fill', '#ffffff');

  	// add states from topojson
  	g.selectAll("path")
        .data(topo.features).enter()
        .append("path")
        .attr("d", path)
        .attr("class", "feature")
        .style("fill", "#ffffff")
        .style("stroke-width", "0.5")
        .style("stroke", "black");

 });

function updateData(day, month, year) {
	// var date = this.getAttribute("value");
	console.log(day+'/'+month+'/'+year)
	d3.csv("/data/cal_data_month.csv").row(function (d, i) {
		// var str = "20090101 00:00:00"; 
		// var n = d.DAY.search(date);
		// console.log('couc');
		// var n_day = d.DAY.search(day)
		var n_month = d.MONTH.search(month)
		var n_year = d.YEAR.search(year)
		// console.log(n_day);
		// console.log(n_month);
		// console.log(n_year);
		if (n_month==0 && n_year==0){
			if (isNaN(d.LATITUDE) || isNaN(d.LONGITUDE)) {
				return null;
			}else {
				return {
					station: d.STATION,
					station_name: d.STATION_NAME,
					elevation: +d.ELEVATION,
					latitude: +d.LATITUDE,
					longitude: +d.LONGITUDE,
					month: +d.MONTH,
					year: +d.YEAR,
					hpcp: +d.HPCP
				};
			}
		}


	}).get(function(error, rows) {
		data = rows
		console.log("Loaded " + data.length + " rows");

		var circles = g.selectAll("circle")
						.data(data);

		circles.enter()
			.append("circle");

		circles
			.attr("cx", function (d) { return projection([d.longitude, d.latitude])[0]; })
			.attr("cy", function (d) { return projection([d.longitude, d.latitude])[1]; })
			.attr("r", function (d) { 
				var radius;
				if (d.hpcp < .20) { radius = "7px";
				} else if (d.hpcp < 1.03) { radius = "9px";
				} else if (d.hpcp < 2.55) { radius = "12px";
				} else if (d.hpcp < 19) { radius = "15px"; 
				} else {radius = "18px"; }
				return radius; 
			})
			.style("fill", function(d) {
				var returnColor;
				if (d.hpcp < 2) { returnColor = color_range[0];
				} else if (d.hpcp < 5) { returnColor = color_range[1];
				} else if (d.hpcp < 20) { returnColor = color_range[2]; 
				} else {returnColor = color_range[3]; }
				return returnColor;
			});

		circles.exit().remove();
	})
}
