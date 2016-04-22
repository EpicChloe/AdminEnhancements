# AdminEnhancements
Ring Admin Enhancements

Change Log:

v0.9.16

Added temp conversion for Kelvin and hide warning if temperature is absurd

Hide defualt buttons again!

Hide app firmware version by defualt in report summary to make reports one line again

Fixed Go button

v0.9.15

Updated key external

v0.9.14

Label Snooze Profiles

v0.9.12

Hiding default report buttons

v0.9.10

Changed url based device detection for new urls in Admin Panel

v0.9.9

Added Temperature & Battery Graph

Removed i2c error from Stick Up Cam summaries

Cleaned up Reports Menu

New Information Dump Interface for QA

v0.9.8.2

Enabled Temperature Warnings on Stick Up Cams

Added extra data for QA console dump

Added Multilevel menu support

i2c errors now pulse

v0.9.8.1

Disabled APE on Chimes

Disabled Temperature Warning on Stick Up Cams until temperature reading in Report Summary is in a valid format

Go Button should now open a new tab/window

v0.9.8

Changed APE interface elements to purple to distinguish from standard elements

Added temperature to event summary table

Added temperature to info dump function

v0.9.6

Fixed issue with time difference calculation

Fixed issue with highcharts update

v0.9.5

Added Battery Timeline

Added Startup Timeline

Added Startup hover button

Updated Font Awesome to 4.5

v0.9.3

Corrected conflict with Chime Firmware Audios

Added visjs for timeline

Fully clears innerHTML of #APEcontainer before drawing a new graph or timeline

Added timeline of reports with label of time since last report

v0.9.2

Corrected RSSI Graph Flow

Fixed color coding on Chime Reports

v0.9.1

Cleaned up some custom css

Summary Table now has a border-radius

Took over event coloring

Added toggle button for Color Legend

Added Color Legend above reports table

Product field now states "Ring Video Doorbell" instead of "Doorbell"

Made sub-headers in General Details easier to read

v0.9

Re-corrected graph flow

Removed hardware version from Report Summary

App firmware version now shows by default

Added battery information to data dump (Nolan)

Condensed report buttons into one dropdown

Reports now generate within the Reports Resume div

v0.8.9

Added moment.js lib to page

Added ac_power status icon next to event date

Added Triggering Zone to embeded context

Corrected graph flow

Disabled click events on Stream Report

v0.8.6

Clicking on a point in a chart, now highlights the event in the reports resume

v0.8.4

Added dump button to output JSON of all Summary Button data. (For Nolan)

v0.8.2

APE Button should no longer appear multiple times on the main page

v0.8.1

Fixed double APE Button

v0.8.0 - Chris to the rescue again edition

Removed default report buttons

Added default report buttons to Toggle button

Corrected Symbols under events to be correct - Unable to correct Setup History

Added APE Button to navbar

v0.7.7

Global Disable APE

v0.7.5

Removed fix for Spree Link. Hyperlink is now generated correctly

Removed null value displays in APE Summary tooltips

Disabled color coding for reports as it should now be default

Added button to toggle between the default and APE Summary Buttons (APE will be default ON)

v0.7.1

Fixed display of Report buttons

v0.7

Added symbols to color swatches for colorblind assist

Added Stream Report to show Average End Stream, End Stream, and Start Stream.

v0.6.9

Added i2c_error reading and parsing

v0.6.6

Added ability to download graphs.

v0.6.5

Added RSSI Variance Graph.

v0.6.1

Fixed issue with double buttons appearing.

v0.6

Buttons and Spree Link should work more reliably.

Added fixes for AJAX calls that updates the page.

Added basic comments to code and changed some structure for readability.

v0.5

Generate Battery Report button now works.

v0.4.5

Summary button now works.

Fixed some css issues.

v0.4.1

Changed placeholder to button. Not functional at the moment.

v0.4

Converted to using jNode checks. Should only be checking the node that was changed instead of the entire document.

v0.3.2

Fixed MSP Error not highlighting when blank

v0.3.1

Fixed MSP Errors not highlighting

v0.3

Added update URL

v0.2

Added Low Battery Warning (<15%)

Changed Update Method to look for Ajax changes instead of Pulse Method

