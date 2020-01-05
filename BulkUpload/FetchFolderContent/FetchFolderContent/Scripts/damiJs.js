app.controller("DamiCtrl", function ($scope, $http) {
    
    
    getAllImage();
    function getAllImage() {
        $scope.path = "";
        $http.get("/Fetch/GetAllImage")
        .then(function (response) {
            $scope.path = response.data;
            
            for (var a in $scope.path) {
                var str = $scope.path[a].FilePath;
                var extension = str.substring(str.lastIndexOf(".") + 1, str.length);
                if (extension === "xls" || extension === "xlsx") {
                    $scope.path[a].flag = 1;
                    if ($scope.path[a].FileTag != null) {
                        $scope.path[a].tags = $scope.path[a].FileTag.split(',');
                    }
                }
                if (extension === "pdf") {
                    $scope.path[a].flag = 2;
                    if ($scope.path[a].FileTag != null) {
                        $scope.path[a].tags = $scope.path[a].FileTag.split(',');
                    }
                }
                if (extension === "docx" || extension === "doc") {
                    $scope.path[a].flag = 3;
                    if ($scope.path[a].FileTag != null) {
                        $scope.path[a].tags = $scope.path[a].FileTag.split(',');
                    }
                }
                if (extension === "jpg" || extension == "png") {
                    $scope.path[a].flag = 4;
                    if ($scope.path[a].FileTag != null) {
                        $scope.path[a].tags = $scope.path[a].FileTag.split(',');
                    }
                }
            }
            console.log($scope.path);
        })
    }
    $scope.uploadInDb = function () {
        $http.post("/Fetch/FetchFolder")
        .then(function (response) {
            getAllImage();
        })
    }

    $scope.PassAllInfo = function () {
       
        $http.post("/Fetch/UpdateRow", $scope.path)
        .then(function () {

        })
        console.log($scope.path);
    }
})