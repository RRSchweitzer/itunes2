var app = angular.module('itunes');

app.service('itunesService', function($http, $q){
  //This service is what will do the 'heavy lifting' and get our data from the iTunes API.
  //Also not that we're using a 'service' and not a 'factory' so all your method you want to call in your controller need to be on 'this'.

  //Write a method that accepts an artist's name as the parameter, then makes a 'JSONP' http request to a url that looks like this
  //https://itunes.apple.com/search?term=' + artist + '&callback=JSON_CALLBACK'
  //Note that in the above line, artist is the parameter being passed in. 
  //You can return the http request or you can make your own promise in order to manipulate the data before you resolve it.


// This function returns $http's promise to the controller, where this function was invoked. The .then in the controller is waiting
// for http's promise to resolve or reject. It will run the first callback if http resolves the promise, which means the request was good.
// It will run the second callback in the .then if the promise was rejected, or the http request was bad.
this.getData = function(artist, type){
	return $http({
		method: 'JSONP',
		url: 'https://itunes.apple.com/search?term=' + artist + '&media=' + type + '&callback=JSON_CALLBACK'
	});
};

// This function returns the promise I built instead of the http request. I can control when my promise resolves or rejects.
// This will tell the .then in the controller which callback to run. If I resolve my promise, then I'm telling the .then to run the first callback.
// If I reject my promise, then I'm telling the .then in controller to run the second callback. I can also pass whatever information back to the .then
// through my deferred.resolve or deferred.reject. Although I'm returning my own promise, and not the http promise, to the controller where this function was
// invoked, I can still run off of http's promise. That's why I have a .then after my http request. The .then here is waiting for http's promise to resolve or reject.
// So, if the http's promise resolves (the request was good and it worked), then I'm going to say my promise is good and I will resolve it. So, I run
// deferred.resolve in the first .then callback. I'm essentially saying I'll keep my promise if http keeps its promise. If http rejects its promise,
// then I'm going to reject my promise as well.
this.getData2 = function(artist, type){
  var deferred = $q.defer();
    $http({
      method: 'JSONP',
      url: 'https://itunes.apple.com/search?term=' + artist + '&media=' + type + '&callback=JSON_CALLBACK'
    }).then(function(res){
      deferred.resolve(res);
    }, function(err){
      deferred.reject(err);
    });
  return deferred.promise;
};


// Just like above, I constructed my own promises. I'm calling .then on my http request. If the request is good, it is going to run the first callback.
// If the request is good, that means I received usable data. I include all of my data manipulation logic within that first callback. I then resolve the 
// promise I created. deferred.resolve tells the .then in the controller to run the first callback. I can also pass whatever data I want through my deferred.resolve or
// deferred.reject. In my deferred.resolve below, I'm passing in my songArray. That array is my data after I've manipulated it to what I want it to look like.
// Whatever I pass into deferred.resolve() will pass into the controller. Thus, by passing songArray in my deferred.resolve as I have below, it will spit out in .then
// in the controller.
// Example:
// This is in my service where I created my promise.
// deferred.resolve('it worked');
// deferred.reject('poop')
// This is my .then in the controller where this function was invoked.
// .then(function(res){
//   console.log(res);
// }, function(err){
//   console.log(err);
// })
// This will print 'it worked' in the console if my promise resolves, or 'poop' if it rejects.

this.getData3 = function(artist, type){
  var deferred = $q.defer();
    $http({
      method: 'JSONP',
      url: 'https://itunes.apple.com/search?term=' + artist + '&media=' + type + '&callback=JSON_CALLBACK'
    }).then(function(res){
      var data = res.data.results;
      var songArray = [];
      for(var i = 0; i < data.length; i++){
        var songObject = {
          AlbumArt: data[i].artworkUrl100,
          Artist: data[i].artistName,
          Collection: data[i].collectionCensoredName,
          Play: data[i].previewUrl,
          Type: data[i].kind
        };
        songArray.push(obj);
      }
      deferred.resolve(songArray);
    }, function(err){
      deferred.reject(err);
    });
  return deferred.promise;
};

});