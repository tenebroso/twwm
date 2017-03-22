(function () {
	'use strict';

	angular
        .module('app')
        .factory('MediaService', MediaService);

	MediaService.$inject = ['$rootScope', '$http', 'twwmConfig', 'localStorageService', 'Upload'];
	function MediaService($rootScope, $http, twwmConfig, localStorageService, Upload) {

		var MediaService = {
			convert: convert,
			createObj: createObj,
			resize:resize,
			uploadMedia: uploadMedia
		}

		return MediaService;

		function Photo(lat, lng, file, fileName, tags){
			this.campaignId = twwmConfig.campaignId;
			this.fileName = fileName == 'undefined' ? 'twwmImage' : fileName;
			this.identity = {
				contentClass:'',
				contentId:''
			}
			this.latitude = lat;
			this.longitude = lng;
			this.rawImageData = file;
			this.tags = tags == 'undefined' ? '' : tags;
		}

		function convert(file) {
			return Upload.base64DataUrl(file);
		}

		function resize(file, options) {
			return Upload.resize(file, options);
		}

		function createObj(base64String, fileName, tags) {
			var mediaObj = new Photo(0, 0, base64String, fileName, tags);
			return mediaObj;
		}

		function uploadMedia(mediaObj) {
			return Upload.http({
				url: twwmConfig.contentEndpoint + '/photos',
				data: JSON.stringify(mediaObj),
				processData: false,
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + localStorageService.get('access_token'),
					'content-type': 'application/json;charset=UTF-8',
					'cache-control': 'no-cache'
				}
			});
		}
	}

})();