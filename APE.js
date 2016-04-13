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

    APE.helper.deviceType = function() {
        if(window.location.href.indexOf("doorbot") > -1) {
            deviceType = 'ring';
        }

        if(window.location.href.indexOf("cam") > -1) {
            deviceType = 'cam';
        }

        if(window.location.href.indexOf("chime") > -1) {
            deviceType = 'chime';
        }
    };
    
})();