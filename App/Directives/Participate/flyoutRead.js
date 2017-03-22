(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmRead', ['$http', 'twwmConfig', 'UserService', 'ResponseService', 'ProvidedContentService', function ($http, twwmConfig, UserService, ResponseService, ProvidedContentService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmRead.tpl.html",
				scope: false,
				controllerAs:'readVm',
				controller: function(){
					var readVm = this;
					
					readVm = {
						archives: [],
						getArchive: getArchive
					}

					readVm.getArchive();

					return readVm;

					function getArchive() {

						ProvidedContentService.getIndex('read')
							.then(function (response) {

								$.each(response.data.content, function (i, v) {
									var postPublishDate = moment(v.publishDate, moment.ISO_8601);
									if (moment(new Date(), moment.ISO_8601).isAfter(postPublishDate)) {
										readVm.archives.push(response.data.content[i])
									}
								});

								readVm.archives = _.orderBy(readVm.archives, 'publishDate', 'desc');

							})
							.catch(ResponseService.error);
					}
				}
			};
		}]);
})();