/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 78.8377847939244, "KoPercent": 21.162215206075604};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6782921158317481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16855295068714632, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-1"], "isController": false}, {"data": [1.0, 500, 1500, "-2"], "isController": false}, {"data": [1.0, 500, 1500, "-3"], "isController": false}, {"data": [1.0, 500, 1500, "-4"], "isController": false}, {"data": [1.0, 500, 1500, "-5"], "isController": false}, {"data": [0.9840801886792453, 500, 1500, "-6"], "isController": false}, {"data": [1.0, 500, 1500, "-7"], "isController": false}, {"data": [1.0, 500, 1500, "-8"], "isController": false}, {"data": [0.9881093935790726, 500, 1500, "-9"], "isController": false}, {"data": [0.0, 500, 1500, "-10"], "isController": false}, {"data": [0.0, 500, 1500, "-11"], "isController": false}, {"data": [0.9933008526187577, 500, 1500, "-12"], "isController": false}, {"data": [0.0, 500, 1500, "-13"], "isController": false}, {"data": [1.0, 500, 1500, "-14"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11719, 2480, 21.162215206075604, 131.39371960064838, 21, 21228, 66.0, 205.0, 219.0, 405.7999999999993, 257.62838550826586, 61.29456103120603, 120.90927054250572], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 2474, 1633, 66.00646725949879, 475.91673403395396, 95, 21465, 326.0, 726.0, 754.0, 1142.5, 54.216339410939696, 60.606219490982205, 119.5886084943132], "isController": true}, {"data": ["-1", 853, 0, 0.0, 90.73153575615478, 84, 174, 87.0, 99.20000000000005, 123.0, 160.22000000000025, 34.133653461384554, 8.100075967887156, 16.30015287364946], "isController": false}, {"data": ["-2", 841, 0, 0.0, 87.51843043995255, 84, 167, 86.0, 91.0, 93.0, 102.58000000000004, 34.573484069886945, 8.20444983299075, 16.5101891700925], "isController": false}, {"data": ["-3", 843, 0, 0.0, 66.64650059311987, 64, 95, 66.0, 69.60000000000002, 71.0, 77.0, 34.41940225379716, 7.764533125612445, 16.234932899007838], "isController": false}, {"data": ["-4", 848, 0, 0.0, 66.57783018867929, 63, 96, 66.0, 69.0, 71.0, 77.0, 34.465940497480084, 7.775031498943261, 16.256884043245], "isController": false}, {"data": ["-5", 841, 0, 0.0, 66.6099881093938, 63, 85, 66.0, 69.0, 72.0, 78.16000000000008, 34.59766332071746, 7.804746315513412, 16.319015023346225], "isController": false}, {"data": ["-6", 848, 0, 0.0, 232.87735849056625, 47, 12256, 199.0, 255.30000000000007, 399.54999999999995, 975.3599999999979, 32.56653481316487, 8.904911862974767, 14.883924113829256], "isController": false}, {"data": ["-7", 849, 0, 0.0, 66.58539458186114, 64, 102, 66.0, 69.0, 72.0, 78.5, 34.323832625833845, 7.742973961491813, 16.256893382352942], "isController": false}, {"data": ["-8", 851, 0, 0.0, 66.75088131609873, 64, 222, 66.0, 69.0, 72.0, 78.0, 34.31589983467075, 7.741184435360297, 16.253136152163393], "isController": false}, {"data": ["-9", 841, 0, 0.0, 175.19143876337694, 47, 12057, 201.0, 258.4000000000002, 379.39999999999986, 590.4800000000002, 26.653567014230028, 7.288084730453522, 12.181513049472317], "isController": false}, {"data": ["-10", 830, 830, 100.0, 212.27108433734932, 21, 21221, 29.0, 47.0, 58.0, 223.8299999999996, 18.633261494252874, 4.167008674007723, 8.80712750314296], "isController": false}, {"data": ["-11", 837, 837, 100.0, 214.11230585424133, 21, 21224, 28.0, 52.0, 102.09999999999445, 225.10000000000002, 18.79885005839547, 4.204039710324769, 8.756886208842422], "isController": false}, {"data": ["-12", 821, 0, 0.0, 168.67113276492097, 46, 12058, 200.0, 238.0, 299.0999999999998, 539.9399999999994, 32.65452231326068, 8.928970945032217, 14.92413715098242], "isController": false}, {"data": ["-13", 813, 813, 100.0, 242.5301353013529, 21, 21228, 28.0, 50.60000000000002, 69.2999999999995, 18130.220000000285, 18.947515614803766, 4.237286206826233, 8.789130778351357], "isController": false}, {"data": ["-14", 803, 0, 0.0, 88.34495641344965, 84, 174, 87.0, 92.0, 95.79999999999995, 108.96000000000004, 34.25475642010068, 8.128814267660609, 16.42488808815374], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2480, 100.0, 21.162215206075604], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11719, 2480, "400/Bad Request", 2480, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-10", 830, 830, "400/Bad Request", 830, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["-11", 837, 837, "400/Bad Request", 837, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["-13", 813, 813, "400/Bad Request", 813, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
