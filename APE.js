// ==UserScript==
// @name         Admin Enhancements
// @namespace    APE
// @version      1
// @description  Chris's Admin Enhancements
// @author       Chris Pittelko
// @match        https://admin.ring.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://code.highcharts.com/highcharts.js
// @require      http://code.highcharts.com/modules/exporting.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/vis/4.9.0/vis.min.js
// @updateURL    https://raw.githubusercontent.com/EpicChloe/AdminEnhancements/master/AdminEnhancements.user
// ==/UserScript==

/* Change Log
r1


For full change log, please see: https://raw.githubusercontent.com/EpicChloe/AdminEnhancements/master/README.md
*/

(function() {

    // Declaring Namespacing
    var APE = {};

    // Determin global scope (should be window)
    APE.GLOBAL = (new Function('return this'))();

    // Namespace helper
    APE.namespace = function (path) {
        var parts = path.split('.'),
            obj = APE.GLOBAL,
            i,
            length;

        for (i = 0, length = parts.length; i < length; i = i + 1) {
            if (obj[parts[i]] === undefined) {
                obj[parts[i]] = {};
            }
            obj = obj[parts[i]];
        }
        return obj;
    };

    // Declare helper namespace
    APE.namespace('APE.helper');

    // Begin helper functions
    APE.helper.registerGlobals = function () {

        // Add reverse to JQuery
        $.fn.reverse = [].reverse;
    };

    // Add style sheets to page
    APE.helper.addStyleSheet = function(style) {

        var getHead = document.getElementsByTagName("HEAD")[0];
        var cssNode = window.document.createElement( 'style' );
        var elementStyle= getHead.appendChild(cssNode);
        elementStyle.innerHTML = style;
        return elementStyle;
    };

    APE.helper.toggleDumpMenu = function() {
        $('#APEDumpModal').toggleClass('hidden');
    };

    APE.helper.labelSnooze = function() {
        var snoozeVal = $('#settings > div:nth-child(3) > div > div:nth-child(3) > input').val();
        var label = '';
        if (snoozeVal == '0,0,0') {
            label = "Frequent";
        } else if (snoozeVal == '1,5,15') {
            label = "Standard";
        } else if (snoozeVal == '2,10,30') {
            label = "Light";
        } else {
            label = "Custom";
        }
        $('#settings > div:nth-child(3) > div > div:nth-child(3) > h5').append(' - <strong>' + label + '<strong>');

    };

    APE.helper.nullConvert = function(value) {
        return (value == null) ? '---' : value;
    };

    APE.helper.converti2cValueToString = function(value) {
        var returnValue = [];
        if (value >= 16) {
            value = value - 16;
            returnValue.push("PIR");
        }
        if (value >= 8) {
            value = value - 8;
            returnValue.push("IR Filter");
        }
        if (value >= 4) {
            value = value - 4;
            returnValue.push("Weather Station");
        }
        if (value >= 2) {
            value = value - 2;
            returnValue.push("Fuel Gauge");
        }
        if (value >= 1) {
            value = value - 1;
            returnValue.push("LED Issue");
        }
        if (value > 1) {
            console.log("i2c Conversion Error");
        }

        if (returnValue.length > 1) {
            return returnValue.join(", ");
        } else if (returnValue.length == 1) {
            return returnValue.join("");
        } else {
            return "None";
        }

    };

    APE.helper.toggleSummaryButtons = function() {
        $('[popover-template="\'summaryTemplate.html\'"]').toggleClass('hidden');
        $('.APESummaryButton').toggleClass('hidden');
        $('.defaultReportButtons').toggleClass('hidden');
        $('#ReportButton').toggleClass('hidden');
    };

    APE.helper.toggleLegend = function() {
        $('#APEColorLegend').toggleClass('hidden');
    };

    APE.helper.timestampDifference = function(now, then, mil, short) {

        //var now  = "11/10/2015 01:42:08:353";
        //var then = "11/09/2015 01:42:41:352";

        var ms = moment(now).diff(moment(then));
        var d = moment.duration(ms);
        var s;
        if (mil) {
            s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss:SSS");
        } else if (short) {
            s = moment.utc(ms).format("ss.SSS");
        } else {
            s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        }

        return s;

    };

    APE.helper.deviceType = function() {
        if(window.location.href.indexOf("doorbot") > -1) {
            var subtype = $('.doorbotKMID .doorbotProduct p').text();
            if ( subtype == 'Doorbell' ) {
                return 'ring';
            } else if (subtype == 'Doorbot') {
                return 'doorbot';
            } else if (subtype == 'Lpd v1') {
                return 'pro'
            } else {
                return 'ring'
            }
        }

        if(window.location.href.indexOf("cam") > -1) {
            return 'cam';
        }

        if(window.location.href.indexOf("chime") > -1) {
            return 'chime';
        }
    };

    // Declare charts namespace
    APE.namespace('APE.charts');

    // Builds Startup Timeline (visjs)
    APE.charts.buildTimelineStartup = function() {

        var data = [];

        $( "APEData" ).each( function( index, element ){

            var _data = {};

            _data = JSON.parse( $( this ).text() );

            if (_data[0] == null) {

            } else {

                $.each(_data[0]['connectData'], function (index, value) {

                    data.push(value);

                });

            }

        });

        console.log(data);

        // Clear contents of DOM element
        $('#APEcontainer').html('');
        $('#APEcontainer').html('<h3>Timeline (Start Up)</h3>');

        // DOM element where the Timeline will be attached
        var container = document.getElementById('APEcontainer');

        var groups = new vis.DataSet();

        groups.add({id: 0, content: "L3"});
        groups.add({id: 1, content: "DNS_lookup"});
        groups.add({id: 2, content: "API_response"});
        groups.add({id: 3, content: "SIP_accept"});
        groups.add({id: 4, content: "first_audio"});

        var dataset = new vis.DataSet(data);

        var options = {
            style:'bar',
            stack:true,
            barChart: {width:50, align:'center'}, // align: left, center, right
            drawPoints: false,
            dataAxis: {
                icons:true
            },
            legend: true,
            orientation:'top'
        };
        var graph2d = new vis.Graph2d(container, data, groups, options);

    };

    APE.charts.buildTimeline = function() {

        // Assign Initial Variables
        var dataArray = [],
            lastValue,
            content;

        // Clear contents of DOM element
        $('#APEcontainer').html('');
        $('#APEcontainer').html('<h3>Timeline (Time Since Last Event)</h3>');

        // DOM element where the Timeline will be attached
        var container = document.getElementById('APEcontainer');

        var timeData = $('td.status .key.ng-binding:contains("time")').parent(),
            timeReport,
            timeValue,
            data = [];
        for (var key in timeData) {
            if (timeData.hasOwnProperty(key)) {
                timeReport = timeData.eq(key);
                timeValue = timeReport.find(':nth-child(2)').html();
                if (timeValue != null) {
                    data.unshift(timeValue);
                }
            }
        }

        // Convert and sort by UNIX timestamp
        data.sort(function(a,b){
            return moment(a).unix() - moment(b).unix();
        });

        // Keeping data sorted by handling data push in order
        for (var i = 0; i < data.length; i++) {
            // Assigns data label as oldest or time difference
            if(i!=0){content = APE.helper.timestampDifference(data[i], lastValue, false, false);}else{content='oldest'}
            // Pushes data index to new object
            dataArray.push({
                id: i,
                start: data[i],
                content: content
            });
            // Assign last timestamp for next call
            lastValue = data[i];
        }

        // Create timeline data set from
        var timelineData = new vis.DataSet(dataArray);

        // Configuration for the Timeline
        var options = {};

        // Create a Timeline
        var timeline = new vis.Timeline(container, timelineData, options);

    };

    APE.charts.buildTimelineBattery = function() {

        $('#APEcontainer').html('');
        $('#APEcontainer').html('<h3>Timeline (Battery)</h3>');

        var container = document.getElementById('APEcontainer');
        var batteryData = $('.key.ng-binding:contains("battery_percentage")').parent(),
            batteryReport,
            batteryValue,
            timeData = $('td.status .key.ng-binding:contains("time")').parent(),
            timeReport,
            timeValue,
            data = [];
        for (var key in batteryData) {
            if (batteryData.hasOwnProperty(key)) {
                batteryReport = batteryData.eq(key);
                batteryValue = batteryReport.find(':nth-child(2)').html();

                timeReport = timeData.eq(key);
                timeValue = timeReport.find(':nth-child(2)').html();
                if (timeValue != null) {
                    data.unshift([timeValue, parseInt(batteryValue)]);
                }

            }
        }

        data.sort(function(a,b){
            return moment(a[0]).unix() - moment(b[0]).unix();
        });
        var dataArray = [];

        // Keeping data sorted by handling data push in order
        for (var i = 0; i < data.length; i++) {
            // Pushes data index to new ojbject
            dataArray.push({
                x: data[i][0],
                y: data[i][1],
                label: {
                    content: data[i][1]
                }
            });
            // Assign last timestamp for next call
        }

        var dataset = new vis.DataSet(dataArray);
        var options = {
            drawPoints: {
                size: 4,
                style: 'circle'
            },
            interpolation: {
                enabled: false
            }
        };
        var graph2d = new vis.Graph2d(container, dataset, options);

    };

    APE.charts.buildBatteryReport = function() {

        $('#APEcontainer').html('');

        $('#APEcontainer').highcharts({
            chart: {
                type: 'line',
                height: 400
            },
            title: {
                text: 'Battery Report'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                title: {
                    text: 'Reports (Oldest -> Newest)'
                }
            },
            yAxis: {
                title: {
                    text: 'Battery Percentage (%)'
                },
                min: 0,
                max: 100
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                },
                series: {
                    lineWidth: 2,
                    events: {
                        click: function(event) {

                            var selectedEvent = $('.key.ng-binding:contains("battery_percentage")').reverse().eq(event.point.x).parent().parent().parent().parent().css('border', '3px solid #04759f');

                        }
                    }
                }
            },
            series: [{
                name: 'Unit Battery',
                data: (function () {
                    var batteryData = $('.key.ng-binding:contains("battery_percentage")').parent(),
                        batteryReport,
                        batteryValue,
                        data = [];
                    for (var key in batteryData) {
                        if (batteryData.hasOwnProperty(key)) {
                            batteryReport = batteryData.eq(key);
                            batteryValue = batteryReport.find(':nth-child(2)').html();
                            if (batteryValue != null) {
                                data.unshift(parseInt(batteryValue));
                            }
                        }
                    }

                    return data;
                }())
            }]
        });
    };

    APE.charts.buildRSSIReport = function() {

        $('#APEcontainer').html('');

        $('#APEcontainer').highcharts({
            chart: {
                type: 'line',
                height: 400
            },
            title: {
                text: 'RSSI Report'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                title: {
                    text: 'Reports (Oldest -> Newest)'
                }
            },
            yAxis: {
                title: {
                    text: 'RSSI Reading'
                },
                min: 0,
                max: 100
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                },
                series: {
                    events: {
                        click: function(event) {

                            var selectedEvent = $('.key.ng-binding:contains("rssi")').reverse().eq(event.point.x).parent().parent().parent().parent().css('border', '3px solid #04759f');

                        }
                    }
                }
            },
            series: [{
                type: 'line',
                name: 'Average RSSI',
                data: (function () {
                    var rssiData = $('.key.ng-binding:contains("rssi")').parent(),
                        rssiReport,
                        rssiValue,
                        data = [];
                    for (var key in rssiData) {
                        if (rssiData.hasOwnProperty(key)) {
                            rssiReport = rssiData.eq(key);
                            rssiValue = rssiReport.find(':nth-child(2)').html();
                            if (rssiValue != null) {
                                data.unshift(parseInt(Math.abs(rssiValue)));
                            }
                        }
                    }
                    var average = data.map(function(x,i,arr){return x/arr.length}).reduce(function(a,b){return a + b});
                    return [[0, Math.round(average)], [(data.length - 1), Math.round(average)]];
                }()),
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false,
                        lineWidth: 0
                    }
                },
                enableMouseTracking: false,
                color: 'orange'

            }, {

                name: 'Reported RSSI',
                data: (function () {
                    var rssiData = $('.key.ng-binding:contains("rssi")').parent(),
                        rssiReport,
                        rssiValue,
                        data = [];
                    for (var key in rssiData) {
                        if (rssiData.hasOwnProperty(key)) {
                            rssiReport = rssiData.eq(key);
                            rssiValue = rssiReport.find(':nth-child(2)').html();
                            if (rssiValue != null) {
                                data.unshift(parseInt(Math.abs(rssiValue)));
                            }
                        }
                    }
                    return data;
                }())
            }]
        });
    };

    APE.charts.buildStreamReport = function() {

        $('#APEcontainer').html('');

        $('#APEcontainer').highcharts({
            chart: {
                type: 'line',
                height: 400
            },
            title: {
                text: 'Stream Profile Report'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                title: {
                    text: 'Reports (Oldest -> Newest)'
                }
            },
            yAxis: {
                title: {
                    text: 'Stream Profile'
                },
                min: 0,
                max: 5
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                },
                series: {
                    events: {
                        click: function(event) {

                            //var selectedEvent = $('.key.ng-binding:contains("end_stream_profile")').reverse().eq(event.point.x).parent().parent().parent().parent().css('border', '3px solid #04759f');

                        }
                    }
                }
            },
            series: [{
                type: 'line',
                name: 'Average End Stream',
                data: (function () {
                    var endStreamData = $('.key.ng-binding:contains("end_stream_profile")').parent(),
                        endStreamReport,
                        endStreamValue,
                        data = [];
                    for (var key in endStreamData) {
                        if (endStreamData.hasOwnProperty(key)) {
                            endStreamReport = endStreamData.eq(key);
                            endStreamValue = endStreamReport.find(':nth-child(2)').html();
                            if (endStreamValue != null) {
                                data.unshift(parseInt(Math.abs(endStreamValue)));
                            }
                        }
                    }
                    var average = data.map(function(x,i,arr){return x/arr.length}).reduce(function(a,b){return a + b});
                    return [[0, Math.round(average)], [(data.length - 1), Math.round(average)]];
                }()),
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false,
                        lineWidth: 0
                    }
                },
                enableMouseTracking: false,
                color: 'orange'

            }, {

                name: 'End Stream Profile',
                data: (function () {
                    var endStreamData = $('.key.ng-binding:contains("end_stream_profile")').parent(),
                        endStreamReport,
                        endStreamValue,
                        data = [];
                    for (var key in endStreamData) {
                        if (endStreamData.hasOwnProperty(key)) {
                            endStreamReport = endStreamData.eq(key);
                            endStreamValue = endStreamReport.find(':nth-child(2)').html();
                            if (endStreamValue != null) {
                                data.unshift(parseInt(Math.abs(endStreamValue)));
                            }
                        }
                    }
                    return data;
                }())

            }, {

                name: 'Start Stream Profile',
                data: (function () {
                    var startStreamData = $('.key.ng-binding:contains("start_stream_profile")').parent(),
                        startStreamReport,
                        startStreamValue,
                        data = [];
                    for (var key in startStreamData) {
                        if (startStreamData.hasOwnProperty(key)) {
                            startStreamReport = startStreamData.eq(key);
                            startStreamValue = startStreamReport.find(':nth-child(2)').html();
                            if (startStreamValue != null) {
                                data.unshift(parseInt(Math.abs(startStreamValue)));
                            }
                        }
                    }
                    return data;
                }())
            }]
        });
    };

    APE.charts.buildTemperatureBatteryReport = function() {

        $('#APEcontainer').html('');

        $('#APEcontainer').highcharts({
            chart: {
                type: 'line',
                height: 400
            },
            title: {
                text: 'Temperature & Battery Report'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                title: {
                    text: 'Reports (Oldest -> Newest)'
                }
            },
            yAxis: {
                title: {
                    text: 'Reading'
                },
                min: -20,
                max: 130
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                },
                series: {
                    events: {
                        click: function(event) {

                            //var selectedEvent = $('.key.ng-binding:contains("end_stream_profile")').reverse().eq(event.point.x).parent().parent().parent().parent().css('border', '3px solid #04759f');

                        }
                    }
                }
            },
            series: [{
                color: 'black',
                name: 'Unit Battery',
                data: (function () {
                    var batteryData = $('.key.ng-binding:contains("battery_percentage")').parent(),
                        batteryReport,
                        batteryValue,
                        data = [];
                    for (var key in batteryData) {
                        if (batteryData.hasOwnProperty(key)) {
                            batteryReport = batteryData.eq(key);
                            batteryValue = batteryReport.find(':nth-child(2)').html();
                            if (batteryValue != null) {
                                data.unshift(parseInt(batteryValue));
                            }
                        }
                    }

                    return data;
                }())

            }, {
                color: 'orange',
                name: 'Temperature Reading',
                data: (function () {
                    var temperatureData = $('.key.ng-binding').filter(function() {return $(this).text() === "temp";}).parent(),
                        temperatureReport,
                        temperatureValue,
                        temp,
                        data = [];
                    for (var key in temperatureData) {
                        if (temperatureData.hasOwnProperty(key)) {
                            temperatureReport = temperatureData.eq(key);
                            temp = temperatureReport.find(':nth-child(2)').html();
                            if (temp != null) {
                                temperatureValue = temp.replace(/\(.*?\)/, '').replace(' F ', '');
                                data.unshift(parseInt(temperatureValue));
                            }
                        }
                    }
                    return data;
                }())
            }]
        });
    };

})();