(function () {
	'use strict';

	angular
		.module('app')
		.directive('twwmReach', ['$http', 'twwmConfig', 'UserService', 'ProvidedContentService', 'ResponseService', function ($http, twwmConfig, UserService, ProvidedContentService, ResponseService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmReach.tpl.html",
				scope: false,
				controllerAs: 'reachVm',
				controller: function () {
					var reachVm = this;

					reachVm = {
						archives: [],
						getArchive: getArchive
					}

					reachVm.getArchive();

					return reachVm;

					function getArchive() {

						ProvidedContentService.getIndex('reach')
							.then(function (response) {

								$.each(response.data.content, function (i, v) {
									var postPublishDate = moment(v.publishDate, moment.ISO_8601);
									if (moment(new Date(), moment.ISO_8601).isAfter(postPublishDate)) {
										reachVm.archives.push(response.data.content[i])
									}
								});

								reachVm.archives = _.orderBy(reachVm.archives, 'publishDate', 'desc');

							})
							.catch(ResponseService.error);
					}

				}
			};
		}]);
})();