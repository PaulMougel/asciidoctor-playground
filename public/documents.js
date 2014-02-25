angular.module('asciidoctorplayground', [])
.controller('DocumentListController', function ($scope, $http) {
	function reload() {
		console.log('reload');
		$http.get('/document')
		.success(function (data) {
			$scope.documents = data.documents;
		});
	}
	reload();

	$scope.upload = function (element) {
		var file = element.files[0];
		var formdata = new FormData();
		formdata.append("file", file);
		$http({
			method: 'POST',
			url: '/document/' + file.name,
			data: formdata,
			headers: { 'Content-Type': undefined },
			transformRequest: function(data) { return data; }
		}).finally(reload);
	};

	$scope.delete = function (doc) {
		$http.delete('/document/' + doc + '.adoc').finally(reload);
	};
});