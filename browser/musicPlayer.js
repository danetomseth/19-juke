var jukeModule = angular.module('jukePlayer', []);
var albumPromise;
var promiseArr = [];

jukeModule.controller('MainCtrl', function($scope, $http) {
    $scope.albums;
    $scope.playerControls = {};
    $scope.playerControls.show = false;
    $scope.currentSong;
    $scope.songArray = [];
    $scope.songUrlArray = [];
    //$scope.playingSong.playing = true;

    albumPromise = $http.get('/api/albums')
        .then(function(albums) {
            return albums.data;
        });


});




jukeModule
    .controller('AlbumController', function($scope, $http, $rootScope) {

        
        

        albumPromise.then(function(albums) {
            $scope.albums = albums;
        }).then(function() {
            $scope.albums.map(function(album, index) {
                $http.get('/api/albums/' + album._id)
                    .then(function(fullAlbum) {
                        var albumFromServer = fullAlbum.data;
                        albumFromServer.imageUrl = '/api/albums/' + albumFromServer._id + '.image';
                        $scope.albums[index] = albumFromServer;
                        return $scope.albums[index];
                    }).then(function(singleAlbum) {
                        singleAlbum.songs.map(function(song, index) {
                            singleAlbum.songs[index].songUrl = '/api/songs/' + song._id + '.audio';
                            singleAlbum.songs[index].hideButton = false;
                        });
                    });
            });
        });

        $scope.playSong = function(song, direction) {
        	console.log($scope.albums);
        	$rootScope.$broadcast('showBar');
            $scope.playerControls.show = true;

        	var audio = document.createElement('audio');
        	if($scope.playingSong !== undefined) {

        		var currentUrl = $scope.playingSong.src;
        		$scope.playingSong.src = "";
        	}
        	if(song === 'change') {
        		console.log('changing song');

	        	$scope.albums.forEach(function(album){
	        		$scope.songArray = $scope.songArray.concat(album.songs);
	        	});

	        	console.log($scope.songArray)
	        	$scope.songArray.forEach(function(song){
	        		$scope.songUrlArray = $scope.songUrlArray.concat(song.songUrl);
	        	});
	        	var songSource = currentUrl.match(/(\/api.+)/g)[0];
	        	var songIndex = $scope.songUrlArray.indexOf(songSource);
	        	if (direction === 'forward') {
	        		audio.src = $scope.songUrlArray[songIndex + 1];
	        		$scope.currentSong = $scope.songArray[songIndex + 1]
	        	} else {
	         		audio.src = $scope.songUrlArray[songIndex - 1];
	         		$scope.currentSong = $scope.songArray[songIndex + 1]
	        	}
        		console.log('current song',$scope.currentSong);
        	}
        	else {
        		audio.src = song.songUrl;
        		$scope.currentSong = song;
        	}
        		audio.load();
            	audio.play();
        	

        	// $scope.playingSong.stop();
        	
            
            
            $scope.playerControls = song;
            

            $scope.playingSong = audio
            $scope.playingSong.playing = true;
            console.log($scope.playerControls.show)
            
            console.log($scope.currentSong);
        };

        $scope.pauseSong = function() {
        	if($scope.playingSong.playing) {
        		$scope.playingSong.pause();
        		$scope.playingSong.playing = false;
        	}
        	else {
        		$scope.playingSong.play();
        		$scope.playingSong.playing = true;
        	}
        	console.log('pausing');
        };




        $rootScope.$on('nextSong', function(event, data) {
        		$scope.playSong('change', data);
        	
        });







    });

jukeModule
.controller('PlayerController', function($scope, $rootScope) {
	$rootScope.changeSong = function(direction) {
		$rootScope.$broadcast('nextSong', direction);
	}

	$rootScope.$on('showBar', function() {
		$scope.barShow = true;
	});
})












