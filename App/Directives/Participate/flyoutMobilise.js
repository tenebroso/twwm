(function () {
	'use strict';

	angular
		.module('app')
		.filter('activityIcon', function () {
			return function (val) {
				switch (val) {
					case "1":
						return 'dn-icon-walk';
						break;
					case "2":
						return 'dn-icon-run';
						break;
					case "15":
					case "8":
					case "11":
					case "10":
					case "9":
						return 'dn-icon-evangelise';
						break;
					case "7":
						return 'dn-icon-other';
						break;
					default:
						return 'dn-icon-flame';
				}
				
			};
		})
		.directive('twwmMobilise', ['ActivityService', 'EvangelismService', function (ActivityService, EvangelismService) {
			return {
				templateUrl: "App/Templates/Participate/FlyoutContent/twwmMobilise.tpl.html",
				controllerAs: 'mobiliseVm',
				controller: function () {
					var mobiliseVm = this;

					mobiliseVm = {
						archives: [],
						getArchive: getArchive
					}

					mobiliseVm.getArchive();

					return mobiliseVm;

					function getArchive() {

						ActivityService.getActivities('0')
							.then(function (res) {
								angular.forEach(res.data.content, function (activity) {
									mobiliseVm.archives.push(activity);
								});
							})
							.catch(function (err) {
								console.log(err);
							});

						EvangelismService.getActivities('0')
							.then(function (res) {
								angular.forEach(res.data.content, function (activity) {
									mobiliseVm.archives.push(activity);
								});
							})
							.catch(function (err) {
								console.log(err);
							});
					}
				}
			};
		}]);
})();