var app = angular.module('itunes');

app.controller('mainCtrl', function($scope, itunesService){

  $scope.gridOptions = { 
      data: 'songData',
      height: '110px',
      sortInfo: {fields: ['Song', 'Artist', 'Collection', 'Type'], directions: ['asc']},
      columnDefs: [
        {field: 'Play', displayName: 'Play', width: '40px', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}"><img src="http://www.icty.org/x/image/Miscellaneous/play_icon30x30.png"></a></div>'},
        {field: 'Artist', displayName: 'Artist'},
        {field: 'Collection', displayName: 'Collection'},
        {field: 'AlbumArt', displayName: 'Album Art', width: '110px', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><img src="{{row.getProperty(col.field)}}"></div>'},
        {field: 'Type', displayName: 'Type'},
        {field: 'CollectionPrice', displayName: 'Collection Price'}
      ],
      filterOptions: $scope.filterBy
  };


$scope.updateOrderInfo = function(){
  $scope.gridOptions.sortInfo
}


// This getSongData function works with itunesService.getData or itunesService.getData2. The difference is which promise 
// I'm running off of. 
$scope.getSongData = function(){
  // This just sets my search type to all if nothing was selected in the drop down box. I don't want to send a search with 'undefined' in my url
  // to iTunes. This prevents that from happening. Read iTunes api documentation if you want to understand more.
  if(!$scope.search.type){
    $scope.search.type = 'all'
  };
  // Or itunesService.getData2($scope.search....)...
  itunesService.getData($scope.search.artist, $scope.search.type).then(function(response){
    // The data is contained in response. This function will only run if the promise is resolved.
    console.log('the promise was resolved');
    parseInfo(response.data.results);
    $scope.songData = parsedInfo;
    // $scope.artist = '';
    // console.log(parsedInfo);
    parsedInfo = [];
  }, function(err) {
    // The data is contained in err. This callback/function will only run if the promise was rejected
    console.log(err, 'The promise was rejected');
  });
};

// This getSongData function works with itunesService.getData3. This moves my data manipulation from the controller into my service, but is functionally
// the same as the function above. I've commented this function out, because I don't want both functions with the same name saved to the scope object.
// I could rename the function below, but then I would have to change my ng-clicks and/or ng-changes in the view. I'm too lazy to do that. 
// I included this for demonstration purposes.
// $scope.getSongData = function(){
//   if(!scope.search.type){
//     $scope.search.type = 'all'
//   };
//   itunesService.getData3($scope.search.artist, $scope.search.type).then(function(res){
//     $scope.songData = res;
//   }, function(err){
//     console.log(err);
//   });
// };

// This is the same logic I have in itunesService.getSongData3. I still have it here because I'm using itunesService.getSongData
var parsedInfo = [];

var parseInfo = function(data) {
  for(var i = 0; i < data.length; i++){
    var obj = {};
    obj.AlbumArt = data[i].artworkUrl100;
    obj.Artist = data[i].artistName;
    obj.Collection = data[i].collectionCensoredName;
    obj.CollectionPrice = data[i].collectionPrice;
    obj.Play = data[i].previewUrl;
    obj.Type = data[i].kind;
    parsedInfo.push(obj);
  };
};

});




