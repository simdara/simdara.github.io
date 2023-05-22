
function drawCharts() {
    drawEPS();
    drawQrevenue();
    drawQmargin();
    drawQgrowth();
    drawArevenue();
    drawAMargin();
    drawAgrowth();
    //drawStock();
}

// -------------------EPS -------------------------------
var EPS_data =[
    [{label:'TTM', type: 'string'},{label:'EPS (KHR)', type: 'number'}],
    ['3Q21',2313.6],
    ['4Q21',2513.],
    ['1Q22',2497.9],
    ['2Q22',2810.6],
    ['3Q22',2900.3],
    ['4Q22',2873.]
    ];     
    
var EPS_option = {
    title:'EPS (ttm, KHR)',
    chartArea: {left:'10%','width': '85%', 'height': '70%'},
    series: {0: {color:'#5B9BD5'}},
    bar: {groupWidth: "50%"},
    vAxis:{format:'short'},
    legend: 'none'};

function drawEPS() {
        drawColumnChart(EPS_data, EPS_option,[1],"EPSChart_div")
}
//---------------------Quarterly revenue----------------------------------------------------
var Qrevenue_data = [
    [{label: 'Quarter', type:'string'},{label: 'Revenue', type:'number'},{label: 'Net profit', type:'number'}],
    ['4Q21',32.28,13.09],
    ['1Q22',36.30,13.66],
    ['2Q22',39.30,15.13],
    ['3Q22',40.34,17.84],
    ['4Q22',32.88,12.52],
    ];
var Qrevenue_option = {
        //title:"KHR'bn",
        chartArea: {left:'10%','width': '85%', 'height': '70%'},
        series: {0: {color:'#5B9BD5'}, 1: {color:'#0F70C0'}},
        bar: {groupWidth: "60%"},
        vAxis:{format:'short',
            viewWindow:{
                min:0,
                max:50}
            },
        legend: {position:'top'},
    };
function drawQrevenue() {
    drawColumnChart(Qrevenue_data,Qrevenue_option,[1,2],"Qrevenue_Chart_div")
}
//--------------------Quarterly margin --------------------------------
var Qmargin_data = [
    [{label: 'Quarter', type:'string'},{label: 'EBITDA margin', type:'number'},{label: 'Net margin', type:'number'}],
    ['4Q21',67.5,40.5],
    ['1Q22',60.7,37.6],
    ['2Q22',61.4,38.5],
    ['3Q22',68.4,44.2],
    ['4Q22',66.7,38.1],
];
var Qmargin_option = {
    series: {0: {color:'#FA6026'},1:{color:'#0F70C0'}},
    seriesType:'bars',
    //vAxis:{format:'percent'},
    chartArea: {left:'10%','width': '90%', 'height': '70%'},
    legend: {position:'top'},
    annotations: {

    }
};
function drawQmargin() {
    drawColumnChart(Qmargin_data,Qmargin_option,[1,2,3],"Qmargin_Chart_div")
}
//---------------------Quarterly growth----------------------------------------
var Qgrowth_data = [
    [{label: 'Quarter', type:'string'},{label: 'Revenue', type:'number'},{label: 'Net profit', type:'number'}],
    ['4Q21',20.2,46.0],
    ['1Q22',24.8,-2.2],
    ['2Q22',45.7,74.7],
    ['3Q22',9.3,11.6],
    ['4Q22',1.8,-4.3],
];
var Qgrowth_option = {
    series: {0: {color:'#5B9BD5'},1:{color:'#0F70C0'}},
    seriesType:'bars',
    vAxis:{viewWindow:{
        min:-5,
        max:90}
    },
    chartArea: {left:'10%','width': '90%', 'height': '70%'},
    legend: {position:'top'},
};

function drawQgrowth() {
    drawColumnChart(Qgrowth_data,Qgrowth_option,[1,2],"Qgrowth_Chart_div")
};
//------------------Annual -----------------------------------------
var Arevenue_data = [
[{label: 'Year', type:'string'},{label: 'Revenue', type:'number'},{label: 'Net profit', type:'number'}],
['2018',83.8,32.8],
['2019',110.2,46.8],
['2020',110.3,40.2],
['2021',125.2,51.7],
['2022',148.8,58.5]
];
var Arevenue_option = {
        //title:"KHR'bn",
        chartArea: {left:'10%','width': '85%', 'height': '70%'},
        series: {0: {color:'#5B9BD5'}, 1:{color:'#0F70C0'}},
        bar: {groupWidth: "60%"},
        vAxis:{format:'short', 
            viewWindow:{
            min:0,
            max:170}
        },
        legend: {position:'top'}
    };
function drawArevenue() {
    drawColumnChart(Arevenue_data,Arevenue_option,[1,2],"Arevenue_Chart_div")
}
//--------------------Annual margin --------------------------------
var AMargin_data = [
[{label: 'Year', type:'string'},{label: 'EBITDA margin', type:'number'},{label: 'Net margin', type:'number'}],
    ['2018',57.0,39.1],
    ['2019',69.6,42.5],
    ['2020',60.9,36.5],
    ['2021',65.6,41.3],
    ['2022',64.3,39.3],
];
var AMargin_option = {
    series: {0: {color:'#FA6026'},1:{color:'#0F70C0'}},
    seriesType:'bars',
    //vAxis:{format:'percent'},
    chartArea: {left:'10%','width': '90%', 'height': '70%'},
    legend: {position:'top'},
    annotations: {

    }
};
function drawAMargin() {
    drawColumnChart(AMargin_data,AMargin_option,[1,2],"AMargin_Chart_div")
}
//---------------------Annual growth----------------------------------------
var Agrowth_data = [
    [{label: 'Year', type:'string'},{label: 'Revenue', type:'number'},{label: 'Net profit', type:'number'}],
    ['2018',9.9,51.1],
    ['2019',31.4,42.8],
    ['2020',0.1,-14.1],
    ['2021',13.5,28.6],
    ['2022',18.8,13.2],
    ];
var Agrowth_option = {
    series: {0: {color:'#5B9BD5'},1:{color:'#0F70C0'}},
    seriesType:'bars',
    vAxis:{viewWindow:{
        min:-15,
        max:75}
    },
    chartArea: {left:'10%','width': '90%', 'height': '70%'},
    legend: {position:'top'},
};

function drawAgrowth() {
    drawColumnChart(Agrowth_data,Agrowth_option,[1,2],"Agrowth_Chart_div")
};
//----------------------------------------------------
// Draw daily stock price with data from good spread sheet

// create arrays index for dataview
var oneMonth = Array.from(Array(20).keys());
var sixMonths = Array.from(Array(120).keys());
var oneYear = Array.from(Array(240).keys());
var threeYears = Array.from(Array(720).keys());
// creat stockPrice line chart
var stockPrice;
// creat chart options
var options={
    //title:'PPAP daily closing',
    chartArea: {left:'10%','width': '80%', 'height': '80%'},
    seriesType:'line',
    series: {1: {type:'bars',targetAxisIndex:1}},
    hAxis:{
        format:'MMM-yy',
        textStyle:{color:'gray'},
        gridlines:{count:12,color:'none'}
    },
    vAxis:{
        textStyle:{color:'gray'},
        gridlines:{count:4},
        format:"short",
    },
    legend:'top',
};
// creat datatable variable
var data;
var dataView;
function drawStock() {
    var closing = new google.visualization.Query(
    'http://spreadsheets.google.com/tq?key=1ta6m6AiteGlSDEc5NMOy3TjybPfHOjYx0YujTgUx4Dk&gid=1663071415');

// Apply query language statement.
    closing.setQuery('SELECT A,B,D');

// Send the query with a callback function.
    closing.send(handleStockDataResponse);
};

function handleStockDataResponse(response) {
    if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
    }
    data = response.getDataTable();
    dataView = new google.visualization.DataView(data);
    dataView.setRows(sixMonths);
    stockPrice = new google.visualization.ComboChart(document.getElementById('DailyPrice_Chart_Div'));
    stockPrice.draw(dataView, options);
};
$(document).ready(function(){
    //
    $(".slidelink").click(function(){
        $(".slidelink").css({"color":"black","border-bottom":"2px solid silver","padding":"3px"});
        $(this).css({"color":"red","border-bottom":"3.5px solid red","padding":"2.5px"});
        //
        switch ($(this).attr('id')) {
            case 'onem':
                dataView.setRows(oneMonth);
                options.hAxis.format="dd-MMM-yy";
                stockPrice.draw(dataView,options);
                
                break;
            case 'sixm':
                dataView.setRows(sixMonths);
                options.hAxis.format="MMM-yy";
                stockPrice.draw(dataView,options);
                break;
            case 'oney':
                dataView.setRows(oneYear);
                options.hAxis.format="MMM-yy";
                stockPrice.draw(dataView,options);
                break;
            case 'threey':
                dataView.setRows(threeYears);
                options.hAxis.format="MMM-yy";
                stockPrice.draw(dataView,options);
                break;
            default:
                options.hAxis.format="MMM-yy";
                stockPrice.draw(data,options);
                break;
        }	
        
    })
});


//---------------------
function drawColumnChart(data,option,annotCols,docElemID) {
    // Draw column chart
    //data is array type
    // option is dictionary type
    // annotCols is an array of integer specifying col of annotation
    // docElemID is a string 
    var dataT = new google.visualization.arrayToDataTable(data,false);
    var container = document.getElementById(docElemID);
    var nCols = dataT.getNumberOfColumns()-1; // deduct column with index 0
    var view = new google.visualization.DataView(dataT);
    //
    var annot = setAnnotation(nCols,annotCols);
    view.setColumns(annot);
    //
    var chart = new google.visualization.ColumnChart(container);
    //
    chart.draw(view, option);
}

function drawPieChart(data,option,docElemID) {
    // Draw pie chart
    //data is array type
    // option is dictionary type
    // docElemID is a string 
    var dataT = new google.visualization.arrayToDataTable(data,false);
    var container = document.getElementById(docElemID);
    //
    var chart = new google.visualization.PieChart(container);
    //
    chart.draw(dataT, option);
}

function setAnnotation(numCols,annotCols) {
    // numCols from 1 (excluding first column with index 0)
    // annotCols is an array of integer specifying the col that need annotation
    
    var OutArr // output array
    OutArr =[0]
    for (let i=1; i<numCols+1; i++){
        OutArr.push(i);
        if (annotCols.includes(i)) {
            OutArr.push({
                calc:"stringify",
                sourceColumn:i,
                type:"string",
                role: "annotation"
            })
        }
    }
    return OutArr;
}

