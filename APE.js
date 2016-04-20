// ==UserScript==
// @name         Admin Enhancements
// @namespace    APE
// @version      1
// @description  Chris's Admin Enhancements
// @author       Chris Pittelko
// @match        https://admin.ring.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://raw.githubusercontent.com/EpicChloe/AdminEnhancements/master/waitForKeyElements.js
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

    APE.namespace(APE.display);
    
    APE.display.createModals = function() {
        $('.topnav').find('.nav-horizontal').prepend('<li class="nav-parent" id="APEStatus-parent"><button type="button" class="btn navbar-btn" id="APEStatus"><i class="fa fa-flask"></i></button></li>');
        $('#APEStatus').on('click', function() {
            $('#APEInformationModal').toggleClass('hidden');
        });
        var APEDetailsButton = 0;
        var APEModal = [
            '<div class="APEModal hidden" id="APEInformationModal">',
            '<h3 class="page-header">Ring Admin Panel Enhancements</h3>',
            '<dl class="dl-horizontal">',
            '<dt>Version 0.9.*</dt>',
            '<dd>',
            '<ul>',
            '<li>Added Temperature & Battery Graph</li>',
            '<li>Removed i2c error from Stick Up Cam summaries</li>',
            '<li>Cleaned up Reports Menu</li>',
            '<li>New Information Dump Interface for QA</li>',
            '<li>Enabled Temperature Warnings on Stick Up Cams</li>',
            '<li>i2c errors now pulse</li>',
            '<li>Redesigned Reports Menu</li>',
            '<li>Disabled APE on Chimes</li>',
            '<li>Go Button should now open a new tab/window</li>',
            '<li>Changed APE interface elements to purple to distinguish from standard elements</li>',
            '<li>Added temperature to event summary table</li>',
            '<li>Added temperature to info dump function</li>',
            '<li>Added go button to see location on google maps</li>',
            '<li>Added temperature warning button</li>',
            '<li>Fixed issue with time difference calculation</li>',
            '<li>Added Battery Timeline</li>',
            '<li>Added Startup Timeline</li>',
            '<li>Added Startup hover button</li>',
            '<li>Corrected conflict with Chime Firmware Audios</li>',
            '</ul>',
            '</dd>',
            '<dt>Version</dt>',
            '<dd>0.9.12</dd>',
            '<dt>By</dt>',
            '<dd>Chris Pittelko - chris@ring.com</dd>',
            '<dt>Link</dt>',
            '<dd>https://raw.githubusercontent.com/EpicChloe/AdminEnhancements/master/AdminEnhancements.user</dd>',
            '</dl>',
            '</div>'
        ];
        $('.mainpanel').append(APEModal.join(''));
        $('#APENav').addClass('active');
        var APEModalDump = [
            '<div class="hidden" id="APEDumpModal">',
            '<h3>Please enter the exact fields, sperated by commas, that you want dumped:</h3>',
            '<div class="input-group">',
            '<input type="text" class="form-control" id="APEDumpFields" placeholder="item1,item2,item3,...">',
            '<span class="input-group-btn">',
            '<button class="btn btn-default" type="button" id="APEDumpButton"><i class="fa fa-download"></i></button>',
            '</span>',
            '</input>',
            '</div>',
            '</div>'
        ];
        $('#reports_resume .panel-title').prepend(APEModalDump.join(''));
    };
    
    
    APE.display.render = function() {
        var pingCheck = 0,
            pingSpree = 1,
            pingReports = 1,
            pingCustomer = 1,
            APEModal = [];
        var checkExist = setInterval(function() {
            console.log('Ping!');
            pingCheck ++;
            if ($('[data-title="\'Spree link\'"]').length && pingSpree) {
                // Bug with link fixed in default Admin Panel
                /*console.log("Found Spree Link! Correcting Link!");
                 var link = $('[data-title="\'Spree link\'"]').html();
                 link = link.trim().replace('https://', '');
                 console.log(link);
                 $('[data-title="\'Spree link\'"]').html(link);*/
                pingSpree = 0;
            }
            if ($('#reports_resume').length && pingReports && $('#APEcontainer').length == 0 && window.location.href.indexOf("chimes") == -1) {
                console.log('Found Reports! Generating Battery Report Button!');
                var APE_ddMenu = ['&nbsp;<div class="btn-group" id="ReportButton">',
                    '<button type="button" class="btn btn-ape btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Reports   <span class="caret"></span></button>',
                    '<ul class="dropdown-menu">',
                    '<li class="dropdown-submenu">',
                    '<a tabindex="-1" href="#">Graphs</i></a>',
                    '<ul class="dropdown-menu">',
                    '<li><a id="BatteryReport">Generate Battery Report</a></li>',
                    '<li><a id="RSSIReport">Generate RSSI Report</a></li>',
                    '<li><a id="StreamReport">Generate Stream Report</a></li>',
                    '<li><a id="TemperatureBatteryReport">Generate Temperature & Battery Report</a></li>',
                    '</ul>',
                    '</li>',
                    '<li class="dropdown-submenu">',
                    '<a tabindex="-1" href="#">Timelines</a>',
                    '<ul class="dropdown-menu">',
                    '<li><a id="APETimeline">Generate Last Update Timeline</a></li>',
                    '<li><a id="APETimelineBattery">Generate Battery Timeline</a></li>',
                    '<li><a id="APETimelineStartup">Generate Start Up Timeline</a></li>',
                    '</ul>',
                    '</li>',
                    '<li><a id="APEDumpMenuToggle">Toggle Dump Menu</a></li>',
                    '<li role="separator" class="divider"></li>',
                    '<li><a id="APESummaryToggle">Switch to Default</a></li>',
                    '</ul>',
                    '</div>'
                ];
                $('#reports_resume .panel-title').append(APE_ddMenu.join(''));
                $('#ReportButton').parent().prepend('<div id="APEcontainer"></div>');
                $('#BatteryReport').on( "click", APE.charts.buildBatteryReport );
                $('#RSSIReport').on( "click", APE.charts.buildRSSIReport );
                $('#StreamReport').on( 'click', APE.charts.buildStreamReport );
                $('#TemperatureBatteryReport').on( 'click', APE.charts.buildTemperatureBatteryReport );
                $('#APETimeline').on( 'click', APE.charts.buildTimeline );
                $('#APETimelineBattery').on( 'click', APE.charts.buildTimelineBattery );
                $('#APETimelineStartup').on( 'click', APE.charts.buildTimelineStartup );
                // Add report button toggle
                $('#APESummaryToggle').on ( 'click', APE.helper.toggleSummaryButtons );
                $('#APEDumpButton').on ( 'click', APE.helper.dumpSummaryReports );
                $('#APEDumpMenuToggle').on ( 'click', APE.helper.toggleDumpMenu );
                // Remove buttons for broken reports
                $('#reports_resume').find("div:nth-child(5)").addClass('hidden defaultReportButtons');
                // colorBlindHelper(); - Unable to hook due to base implementation. Base implementation is broken. All events fail ng-class logic check
                $('[tooltip="completed"]').attr("ng-class","").removeClass('fa-times text-danger').addClass('fa-check  text-success');
                //$('#reports_resume').find('.btn-group .ng-scope').parent().parent().clone(true, true).appendTo('#APEcontainer');
                $('#reports_resume th:first').css('width', '26px').html('<button id="reports_resume_legend"><i class="fa fa-info-circle fa-align-center"></i></button>').parent().parent().parent().parent().prepend('<div id="APEColorLegend" class="hidden">&nbsp;<i class="fa fa-square APEColorSwatch" style="color:#f2dede;"></i>&nbsp;MSP430 Error&nbsp;<i class="fa fa-square APEColorSwatch" style="color:#ffc370;"></i>&nbsp;Low Battery(<15%)&nbsp;<i class="fa fa-square APEColorSwatch" style="color:#d9edf7;"></i>&nbsp;OTA/Setup&nbsp;<i class="fa fa-square APEColorSwatch" style="color:#fcf8e3;"></i>&nbsp;RSSI <70</div>');
                $('#reports_resume_legend').on ( 'click', APE.helper.toggleLegend );
                // QoL Changes
                if ( $('.doorbotKMID .doorbotProduct p').text() == 'Doorbell' ) { $('.doorbotKMID .doorbotProduct p').text('Ring Video Doorbell'); };
                labelSnooze();
                $('.doorbotdetails h5').css('font-weight', '700');
                var coordinates = $('.doorbotMacID h5').filter(function() {return $(this).text() === "coordinates";}).parent().text().replace('coordinates', '').replace('Latitude: ', '').replace('Longitude: ', ',').trim().replace('\n', '').replace(/ /g, '');
                $('.doorbotMacID h5').filter(function() {return $(this).text() === "coordinates";}).parent().parent().append('<a class="btn btn-ape APELocationGoButton">Go <i class="fa fa-angle-double-right"></i></a>');
                $('.APELocationGoButton').on ( 'click' , function() { window.open('https://www.google.com/search?q='+coordinates); } );
                pingReports = 0;

            }
            if (pingCheck > 10) {
                clearInterval(checkExist);
            }
            if (window.location.href.indexOf("customers") !== -1 && pingCustomer == 1 && $('#APEInstallRequest').length == 0) {
                buildInstallRequest();
                pingCustomer = 0;
            }
        }, 1000);
    };
    
    APE.display.init = function() {
        $(document).ready(function() {
            APE.display.render();
            APE.display.createModals();
        });

        // Checks if URL changes and if APE Renderer needs to be enabled again
        var oldLocation = location.href;
        setInterval(function() {
            if(location.href != oldLocation) {
                console.log('URL Changed!');
                APERender();
                oldLocation = location.href
            }
        }, 1000); // check every second
    };

    APE.display.init();
    
})();