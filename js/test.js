// radio

var current_choice = 0;
var current_json = '/data/cal_data_day.csv';

function handleClick(myRadio) {
    current_choice = myRadio.value;

    if (+current_choice == 0 ){
      $("#day_slider").show();
      $("#month_slider").show();
      $("#year_slider").show();

      current_json = "/data/cal_data_day.csv";

    } else if ( current_choice == 1) {
      $("#day_slider").hide();
      $("#month_slider").show();

      current_json = "/data/cal_data_month.csv";
    } else if ( current_choice == 2) {
      $("#day_slider").hide();
      $("#month_slider").hide();

      current_json = "/data/cal_data_year.csv";
    }
    console.log(current_json)
}

// slider
var day_slider = $("#ex_day").slider();
var month_slider = $("#ex_month").slider();
var year_slider = $("#ex_year").slider();

$('#ex_day').slider().on('slideStart', function(ev){
    original_day = day_slider.val();
});

$('#ex_month').slider().on('slideStart', function(ev){
    original_month = month_slider.val();
});

$('#ex_year').slider().on('slideStart', function(ev){
    original_year = year_slider.val();
});

// 

$("#hide").click(function(){
    
});

$("#show").click(function(){
    $("p").show();
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
      console.log(date);
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
      console.log(date);
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
      console.log(date);
  }
});

// SVG 
var width = 750,
  height = 520;

var projection = d3.geo.mercator()
                    .center([-120, 37])
                    .scale(2000)
                    .translate([width / 2, height / 2]);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
          .projection(projection);

var zoom = d3.behavior.zoom()
        .on("zoom",function() {
        g.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")")
        });

svg.call(zoom);

var g = svg.append("g");

var range_legend = [25, 50, 100, 200, 500, 900, 1200, 1400, 1600, 1800, 2000]
var range_px = ["2px", "3px", "4px", "5px", "7px","9px", "11px", "13px","15px", "17px", "19px", "21px"]
var color_domain = ["<25", "25-50", "50-100", "100-200", "200-900", "900-1000", "1000-1200", "1200-1400", "1400-1600", "1600-1800", "1800-2000", ">2000"];
var color_range = ["#00bfff", "#0080ff", "#0040ff", "#0000ff","#4000ff", "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040", "#ff0000"];
var color = d3.scale.ordinal()
    .domain(color_domain)
    .range(color_range);

var legendRectSize = 18;
var legendSpacing = 4;

var legend = svg.append("g")
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


/* JavaScript goes here. */
d3.json("/data/california.json", function(error, topology) {
  if (error) return console.error(error);
  // console.log(topology);

  g.append("path")
        .datum(topojson.feature(topology, topology.objects.subunits))
        .attr("class", "land")
        .attr("d", path);

  // Display each subunit
  g.selectAll(".subunit")
      .data(topojson.feature(topology, topology.objects.subunits).features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.properties.name; })
      .attr("d", path)
      .on("mouseover", function(d) {    
              div.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              div .html(
                  d.properties.fullName)  
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
          .on("mouseout", function(d) {   
              div.transition()    
                  .duration(500)    
                  .style("opacity", 0); 
          });

  // boundary
  g.append("path")
      .datum(topojson.mesh(topology, topology.objects.subunits, function(a, b) { return a === b ; }))
      .attr("d", path)
      .attr("class", "exterior-boundary");

  // display country-label
  // svg.selectAll(".subunit-label")
  //     .data(topojson.feature(topology, topology.objects.subunits).features)
  //   .enter().append("text")
  //     .attr("class", function(d) { return "subunit-label " + d.id; })
  //     .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
  //     .attr("dy", ".35em")
  //     .text(function(d) { return d.properties.name; });

  //tooltop declaration
  var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
});

// Get the data
myFunction()
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
    initData(day,month,year);
}

function initData(day, month, year) {
  d3.csv(current_json, function(d) {
    var n_day = d.DAY.search(day)
    var n_month = d.MONTH.search(month)
    var n_year = d.YEAR.search(year)


    if (n_year==0 && n_month==0 && n_day==0){
      if (!isNaN(d.LATITUDE) || !isNaN(d.LONGITUDE)) {
        return {
          station : d.STATION,
          station_name : d.STATION_NAME,
          elevation : d.ELEVATION,
          latitude : +d.LATITUDE,
          longitude : d.LONGITUDE,
          year : +d.YEAR,
          hpcp : +d.HPCP
        };
      }
    }
    
  }, function(data) {
        console.log(data.length + " rows loaded");
        var circles = g.selectAll("circle")
                             .data(data)
                             .enter()
                             .append("circle");

  //Add the circle attributes
  var circleAttributes = circles
                          .attr("class", function(d) { return "subunit " + d.station_name; })
                          .attr("r", function (d) { 
                            var radius;
                            if (d.hpcp < range_legend[0]) { radius = range_px[0];
                            } else if (d.hpcp < range_legend[1]) { radius = range_px[1];
                            } else if (d.hpcp < range_legend[2]) { radius = range_px[2];
                            } else if (d.hpcp < range_legend[3]) { radius = range_px[3]; 
                            } else if (d.hpcp < range_legend[4]) { radius = range_px[4]; 
                            } else if (d.hpcp < range_legend[5]) { radius = range_px[5]; 
                            } else if (d.hpcp < range_legend[6]) { radius = range_px[6]; 
                            } else if (d.hpcp < range_legend[7]) { radius = range_px[7]; 
                            } else if (d.hpcp < range_legend[8]) { radius = range_px[8]; 
                            } else if (d.hpcp < range_legend[9]) { radius = range_px[9]; 
                            } else if (d.hpcp < range_legend[10]) { radius = range_px[10]; 
                            } else{ radius = range_px[11] }
                            return radius; 
                          })
                         .attr("transform", function(d) {return "translate(" + projection([d.longitude,d.latitude]) + ")";})
                         .style("fill", function(d) {
                            var returnColor;
                            if (d.hpcp < range_legend[0]) { returnColor = color_range[0];
                            } else if (d.hpcp < range_legend[1]) { returnColor = color_range[1];
                            } else if (d.hpcp < range_legend[2]) { returnColor = color_range[2];
                            } else if (d.hpcp < range_legend[3]) { returnColor = color_range[3]; 
                            } else if (d.hpcp < range_legend[4]) { returnColor = color_range[4]; 
                            } else if (d.hpcp < range_legend[5]) { returnColor = color_range[5]; 
                            } else if (d.hpcp < range_legend[6]) { returnColor = color_range[6]; 
                            } else if (d.hpcp < range_legend[7]) { returnColor = color_range[7]; 
                            } else if (d.hpcp < range_legend[8]) { returnColor = color_range[8]; 
                            } else if (d.hpcp < range_legend[9]) { returnColor = color_range[9]; 
                            } else if (d.hpcp < range_legend[10]) { returnColor = color_range[10]; 
                            } else{ returnColor = color_range[11] }
                            return returnColor;
                          })
                          .style("stroke", function(d) {
                            var returnColor;
                            if (d.hpcp < range_legend[0]) { returnColor = color_range[0];
                            } else if (d.hpcp < range_legend[1]) { returnColor = color_range[1];
                            } else if (d.hpcp < range_legend[2]) { returnColor = color_range[2];
                            } else if (d.hpcp < range_legend[3]) { returnColor = color_range[3]; 
                            } else if (d.hpcp < range_legend[4]) { returnColor = color_range[4]; 
                            } else if (d.hpcp < range_legend[5]) { returnColor = color_range[5]; 
                            } else if (d.hpcp < range_legend[6]) { returnColor = color_range[6]; 
                            } else if (d.hpcp < range_legend[7]) { returnColor = color_range[7]; 
                            } else if (d.hpcp < range_legend[8]) { returnColor = color_range[8]; 
                            } else if (d.hpcp < range_legend[9]) { returnColor = color_range[9]; 
                            } else if (d.hpcp < range_legend[10]) { returnColor = color_range[10]; 
                            } else{ returnColor = color_range[11] }
                            return returnColor;
                          })
                         .on("mouseover", function(d) {    
                            div.transition()    
                                .duration(200)    
                                .style("opacity", .9);    
                            div .html(
                                d.station_name)  
                                .style("left", (d3.event.pageX) + "px")   
                                .style("top", (d3.event.pageY - 28) + "px");  
                            })          
                        .on("mouseout", function(d) {   
                            div.transition()    
                                .duration(500)    
                                .style("opacity", 0); 
                        });
    var div = d3.select("#map").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
  });
}



function updateData(day, month, year) {
  d3.csv(current_json, function(d) {
    // var n_year = d.YEAR.search(year)
    
    if (current_choice == 0) {
      var n_day = d.DAY.search(day)
      var n_month = d.MONTH.search(month)
      var n_year = d.YEAR.search(year)
      if (n_year==0 && n_month==0 && n_day==0){

      if (!isNaN(d.LATITUDE) || !isNaN(d.LONGITUDE)) {
          return {
            station : d.STATION,
            station_name : d.STATION_NAME,
            elevation : d.ELEVATION,
            latitude : +d.LATITUDE,
            longitude : d.LONGITUDE,
            year : +d.YEAR,
            hpcp : +d.HPCP
          };
        }
      }
    }

    if (current_choice == 1) {
      var n_month = d.MONTH.search(month)
      var n_year = d.YEAR.search(year)
      if (n_year==0 && n_month==0 ){

      if (!isNaN(d.LATITUDE) || !isNaN(d.LONGITUDE)) {
          return {
            station : d.STATION,
            station_name : d.STATION_NAME,
            elevation : d.ELEVATION,
            latitude : +d.LATITUDE,
            longitude : d.LONGITUDE,
            year : +d.YEAR,
            hpcp : +d.HPCP
          };
        }
      }
    }

    if (current_choice == 2) {
      var n_year = d.YEAR.search(year)
      if (n_year==0 ){

      if (!isNaN(d.LATITUDE) || !isNaN(d.LONGITUDE)) {
          return {
            station : d.STATION,
            station_name : d.STATION_NAME,
            elevation : d.ELEVATION,
            latitude : +d.LATITUDE,
            longitude : d.LONGITUDE,
            year : +d.YEAR,
            hpcp : +d.HPCP
          };
        }
      }
    }
    
  }, function(data) {
        console.log(data.length);
        var circles = g.selectAll("circle")
                             .data(data);

        circles.enter()
               .append("circle");

  //Add the circle attributes
  var circleAttributes = circles
                          .transition().duration(200)
                         .attr("r", function (d) { 
                            var radius;
                            if (d.hpcp < range_legend[0]) { radius = range_px[0];
                            } else if (d.hpcp < range_legend[1]) { radius = range_px[1];
                            } else if (d.hpcp < range_legend[2]) { radius = range_px[2];
                            } else if (d.hpcp < range_legend[3]) { radius = range_px[3]; 
                            } else if (d.hpcp < range_legend[4]) { radius = range_px[4]; 
                            } else if (d.hpcp < range_legend[5]) { radius = range_px[5]; 
                            } else if (d.hpcp < range_legend[6]) { radius = range_px[6]; 
                            } else if (d.hpcp < range_legend[7]) { radius = range_px[7]; 
                            } else if (d.hpcp < range_legend[8]) { radius = range_px[8]; 
                            } else if (d.hpcp < range_legend[9]) { radius = range_px[9]; 
                            } else if (d.hpcp < range_legend[10]) { radius = range_px[10]; 
                            } else{ radius = range_px[11] }
                            return radius; 
                          })
                         .attr("transform", function(d) {return "translate(" + projection([d.longitude,d.latitude]) + ")";})
                         .style("fill", function(d) {
                            var returnColor;
                            if (d.hpcp < range_legend[0]) { returnColor = color_range[0];
                            } else if (d.hpcp < range_legend[1]) { returnColor = color_range[1];
                            } else if (d.hpcp < range_legend[2]) { returnColor = color_range[2];
                            } else if (d.hpcp < range_legend[3]) { returnColor = color_range[3]; 
                            } else if (d.hpcp < range_legend[4]) { returnColor = color_range[4]; 
                            } else if (d.hpcp < range_legend[5]) { returnColor = color_range[5]; 
                            } else if (d.hpcp < range_legend[6]) { returnColor = color_range[6]; 
                            } else if (d.hpcp < range_legend[7]) { returnColor = color_range[7]; 
                            } else if (d.hpcp < range_legend[8]) { returnColor = color_range[8]; 
                            } else if (d.hpcp < range_legend[9]) { returnColor = color_range[9]; 
                            } else if (d.hpcp < range_legend[10]) { returnColor = color_range[10]; 
                            } else{ returnColor = color_range[11] }
                            return returnColor;
                          }).style("stroke", function(d) {
                            var returnColor;
                            if (d.hpcp < range_legend[0]) { returnColor = color_range[0];
                            } else if (d.hpcp < range_legend[1]) { returnColor = color_range[1];
                            } else if (d.hpcp < range_legend[2]) { returnColor = color_range[2];
                            } else if (d.hpcp < range_legend[3]) { returnColor = color_range[3]; 
                            } else if (d.hpcp < range_legend[4]) { returnColor = color_range[4]; 
                            } else if (d.hpcp < range_legend[5]) { returnColor = color_range[5]; 
                            } else if (d.hpcp < range_legend[6]) { returnColor = color_range[6]; 
                            } else if (d.hpcp < range_legend[7]) { returnColor = color_range[7]; 
                            } else if (d.hpcp < range_legend[8]) { returnColor = color_range[8]; 
                            } else if (d.hpcp < range_legend[9]) { returnColor = color_range[9]; 
                            } else if (d.hpcp < range_legend[10]) { returnColor = color_range[10]; 
                            } else{ returnColor = color_range[11] }
                            return returnColor;
                          });


                        circles.on("mouseover", function(d) {    
                            div.transition()    
                                .duration(200)    
                                .style("opacity", .9);    
                            div .html(
                                d.station_name)  
                                .style("left", (d3.event.pageX) + "px")   
                                .style("top", (d3.event.pageY - 28) + "px");  
                            })          
                        .on("mouseout", function(d) {   
                            div.transition()    
                                .duration(500)    
                                .style("opacity", 0); 
                        });


var div = d3.select("#map").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

  circles.exit().remove();
  });
}
