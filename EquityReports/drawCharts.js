
//--------------------------------------------------------
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
  hAxis:{format:'MMM-yy',textStyle:{color:'gray'},gridlines:{count:12,color:'none'}},
  vAxis:{textStyle:{color:'gray'},gridlines:{count:4},format:"short"},
  legend:'top',
};
// creat datatable variable
var data;
var dataView;
function drawStock() {
  var closing = new google.visualization.Query(
  'http://spreadsheets.google.com/tq?key=1ta6m6AiteGlSDEc5NMOy3TjybPfHOjYx0YujTgUx4Dk&gid=1663071415');

// Apply query language statement.
  closing.setQuery(StockDataOnGSpread);

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
    $(this).css({"color":"red","border-bottom":"3px solid red","padding":"3px"});
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

function drawLineChart(data,option,annotCols,docElemID) {
  // Draw line chart
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
  var chart = new google.visualization.LineChart(container);
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

