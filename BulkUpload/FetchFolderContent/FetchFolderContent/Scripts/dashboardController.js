//app.directive('myEnter', function () {
//    return function (scope, element, attrs) {
//        element.bind("keydown keypress", function (event) {
//            if (event.which === 13) {
//                scope.$apply(function () {
//                    scope.$eval(attrs.myEnter);
//                });

//                event.preventDefault();
//            }
//        });
//    };
//});



app.controller("dashboardController", function ($scope, $http, $window) {

    notification();
    globalToggle();
    $scope.advSearchLayoutFlag = "";

    $scope.fileRelaventFileFlag = "";
    $scope.searchFlag = "";
    function globalToggle() {
        if (sessionStorage.toggle != null) {
            $scope.showFolder = JSON.parse(sessionStorage.toggle);
            if ($scope.showFolder === false) {
                $scope.toggleBetweenFolderAndNavigation = false;
               
            } else {
                $scope.toggleBetweenFolderAndNavigation = true;
            }
            
        } else {
            $scope.showFolder = false;
            $scope.toggleBetweenFolderAndNavigation = false;
            if ($scope.toggleBetweenFolderAndNavigation === true) {
                $scope.showFolder = true;
                sessionStorage.toggle = JSON.stringify($scope.showFolder);

            }
            if ($scope.toggleBetweenFolderAndNavigation === false) {
                $scope.showFolder = false;
                sessionStorage.toggle = JSON.stringify($scope.showFolder);

            }
        }
    }
    $scope.allNotificationList = null;
    $scope.unSeenNotificationList = null;
    $scope.declineNotificationList = null;
    function notification() {
        $http.get("/Notification/GetAllNotification")
        .then(function (response) {
            $scope.allNotificationList = response.data.all;
            $scope.unSeenNotificationList = response.data.unSeen;
            $scope.declineNotificationList = response.data.decline;
            $scope.unseenDeclineNotificationList = response.data.declineUnseen;

            if ($scope.allNotificationList != null && $scope.unseenDeclineNotificationList != null) {
                $scope.unSeenNotificationValue = $scope.unSeenNotificationList.length + $scope.unseenDeclineNotificationList.length;
            }
            if ($scope.allNotificationList == null && $scope.unseenDeclineNotificationList != null) {
                $scope.unSeenNotificationValue = $scope.unseenDeclineNotificationList.length;
            }
            if ($scope.allNotificationList != null && $scope.unseenDeclineNotificationList == null) {
                $scope.unSeenNotificationValue = $scope.unSeenNotificationList.length;
            }
            console.log($scope.allNotificationList);
            console.log($scope.declineNotificationList);
           
        })
    }

    //$scope.showFolder = false;
    $scope.toggle = function () {
       
        console.log($scope.toggleBetweenFolderAndNavigation);
       
        if ($scope.toggleBetweenFolderAndNavigation === true) {
            
                
            
            $scope.showFolder = true;
            sessionStorage.toggle = JSON.stringify($scope.showFolder);

        }
        if ($scope.toggleBetweenFolderAndNavigation === false) {
            
            
            $scope.showFolder = false;
            sessionStorage.toggle = JSON.stringify($scope.showFolder);
           
        }
    }

    $scope.relaventFileList = null;
    $scope.flag = 0;
    $scope.findRelaventFile = function (folderId) {
        $window.history.pushState(null, null, '/');
        
        $http.get("/Dashboard/getRelaventFile?folderId="+folderId).
            then(function (response) {
                $scope.searchFileList = null;
                $scope.relaventFileList = response.data;
                $scope.advSearchLayoutFlag = 0;
                $scope.fileRelaventFileFlag = 1;
                $scope.searchFlag = 0;
                $scope.parentFolderListAdvSearch = null;
                
                for (var a in $scope.relaventFileList) {
                   
                    var str = $scope.relaventFileList[a].FileName;
                    var extension = str.substring(str.lastIndexOf(".") + 1, str.length);
                 
                    if (extension === "xls" || extension === "xlsx") {
                        $scope.relaventFileList[a].flag = 1;
                    }
                    if (extension === "pdf") {
                        $scope.relaventFileList[a].flag = 2;
                    }
                    if (extension === "docx" || extension === "doc") {
                        $scope.relaventFileList[a].flag = 3;
                    }
                }
              
            });
    }
    var fileId = "";
    $scope.commentList = null;
    $scope.fileIdPass = function (fID) {
        
        fileId = fID;
        $http.get("/Dashboard/getCommnetList?FileId=" + fID)
            .then(function(response) {
                $scope.commentList = response.data;
               
                $("#myModal").animate({ scrollTop: 500 }, "slow");
            });
    }
    $scope.commentsSave = function (c) {
        var m = {
            Comment: c,
            FileId: fileId
        }
        
        $http.post("/Dashboard/CommentSave",m)
            .then(function(response) {
                if (response.data === true) {
                    alertify.alert('', commentMsg, function () {
                        $('#Comment').val('');
                        $('#myModal').modal('hide');
                        
                    });
                }
            });
    }
 
    $scope.searchFileList = null;
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    $scope.searchResult = function (fileName,searchby) {
        $http.get("/Dashboard/SearchResult?filename=" + fileName+"&searchBy="+searchby)
            .then(function (response) {
                $scope.parentFolderListAdvSearch = null;
                $scope.relaventFileList = null;
                $scope.searchFileList = response.data;
                $scope.advSearchLayoutFlag = 0;
                $scope.fileRelaventFileFlag = 0;
                $scope.searchFlag = 1;
                for (var a in $scope.searchFileList) {

                    var str = $scope.searchFileList[a].FileName;
                    var folderPath = $scope.searchFileList[a].FilePath;
                    var extension = str.substring(str.lastIndexOf(".") + 1, str.length);
                    var path = folderPath.split("DigiArchivingFiles")[1];
                    var path1 = path.substring(path.indexOf("\\") + 1, path.length);
                    var path2 = path.substring(path.lastIndexOf("\\") + 1, path.length);
                    var value = path1.length - path2.length;
                    var path3 = path.substring(path.indexOf("\\") + 0, value);
                    console.log(value);
                    //$scope.searchFileList[a].FilePath = path3.replaceAll("\\", "-->");
                    $scope.searchFileList[a].FilePath = path3;
                    $scope.searchFileList[a].FilePathWithRoot = folderPath;
                    if (extension === "xls" || extension === "xlsx") {
                        $scope.searchFileList[a].flag = 1;
                    }
                    if (extension === "pdf") {
                        $scope.searchFileList[a].flag = 2;
                    }
                    if (extension === "docx" || extension === "doc") {
                        $scope.searchFileList[a].flag = 3;
                    }
                }
                
            });
    }


    $scope.parentFolderListAdvSearch = null;
   
    $scope.AdvFolderSearchPanel = function () {
        $http.get("/Dashboard/AdvFolderSearchPanel")
        .then(function (response) {
            $scope.parentFolderListAdvSearch = response.data;
            $scope.FolderDropDownText = "Select Folder";
            $scope.FolderDropDownChild1Text = "Select Folder";
            $scope.FolderDropDownChild2Text = "Select Folder";
            $scope.FolderDropDownChild3Text = "Select Folder";
            $scope.FolderDropDownChild4Text = "Select Folder";
            $scope.advSearchLayoutFlag = 1;
          
            $scope.fileRelaventFileFlag = 0;
            $scope.searchFlag = 0;
            $scope.relaventFileList = null;
            $scope.searchFileList = null;
          
            
        })
    }
    
    $scope.Child1 = function (id) {
        $scope.FirstLevelChild = null;
        
        $scope.SecondLevelChild = null;
        $scope.ThirdLevelChild = null;
        $scope.FourthLevelChild = null;
        $scope.FolderDropDownChild1Text = "Select Folder";
        $scope.FolderDropDownChild2Text = "Select Folder";
        $scope.FolderDropDownChild3Text = "Select Folder";
        $scope.FolderDropDownChild4Text = "Select Folder";
        $http.get("/Dashboard/GetChild1?parentid=" + id)
        .then(function (response) {
            if (response.data == "") {
              
               
                $scope.FolderDropDownChild1Text = "No Folder is Available";
                $scope.FolderDropDownChild2Text = "No Folder is Available";
                $scope.FolderDropDownChild3Text = "No Folder is Available";
                $scope.FolderDropDownChild4Text = "No Folder is Available";
            } else {
                $scope.FolderDropDownChild1Text = "Select Folder";
                $scope.FirstLevelChild = response.data;
            }
        })
    }
    
    $scope.Child2 = function (id) {
        $scope.SecondLevelChild = null;
        $http.get("/Dashboard/GetChild2?parentid=" + id)
        .then(function (response) {
            if (response.data == "") {
                
               
                $scope.FolderDropDownChild2Text = "No Folder is Available";
                $scope.FolderDropDownChild3Text = "No Folder is Available";
                $scope.FolderDropDownChild4Text = "No Folder is Available";

            }
            else {
                $scope.FolderDropDownChild2Text = "Select Folder";
                $scope.SecondLevelChild = response.data;
            }
           
            

        })
    }

    $scope.Child3 = function (id) {
        $scope.ThirdLevelChild = null;
        $http.get("/Dashboard/GetChild3?parentid=" + id)
        .then(function (response) {
            if (response.data == "") {
              
             
                $scope.FolderDropDownChild3Text = "No Folder is Available";
                $scope.FolderDropDownChild4Text = "No Folder is Available";

            }
            else {
                $scope.FolderDropDownChild3Text = "Select Folder";
                $scope.ThirdLevelChild = response.data;
            }



        })
    }

    $scope.Child4 = function (id) {
        $scope.FourthLevelChild = null;
        $http.get("/Dashboard/GetChild4?parentid=" + id)
        .then(function (response) {
            if (response.data == "") {
              
                $scope.FolderDropDownChild4Text = "No Folder is Available";

            }
            else {
                $scope.FolderDropDownChild4Text = "Select Folder";
                $scope.FourthLevelChild = response.data;
            }



        })
    }

  
    $scope.SearchedFolderNames = null;
    $scope.PreviousFolderId = "";
    $scope.AdvSearch = function (m) {
        if (m.c4 == null) {
            if (m.c3 == null) {
                if (m.c2 == null) {
                    if (m.c1 == null) {
                        $scope.PreviousFolderId = m.parentId;
                    }
                    else {
                        $scope.PreviousFolderId = m.parentId;
                    }
                   
                }
                else {
                    $scope.PreviousFolderId = m.c1;
                }
            }
            else {
                $scope.PreviousFolderId = m.c2;
            }
        }
        else {
            $scope.PreviousFolderId = m.c3;
        }
        
        $http.post("/Dashboard/AdvancedSearch",m)
        .then(function (response) {
            $scope.SearchedFolderNames = response.data;
          
            var string1 = $scope.SearchedFolderNames.PhysicalPath.substring($scope.SearchedFolderNames.PhysicalPath.indexOf('\\') + 1);
            var string2 = string1.substring(string1.indexOf('\\') + 1);
            $scope.PhysicalPath = string2.replaceAll('\\','>>');
            $('#searchResultModal').modal('show');
            $scope.flag = 1;
            $scope.root = 1;
            console.log($scope.SearchedFolderNames);
            for (var a in $scope.SearchedFolderNames.fileNameAndId) {
                var str = $scope.SearchedFolderNames.fileNameAndId[a].FileName;;
               
                var extension = str.substring(str.lastIndexOf(".") + 1, str.length);
                if (extension === "xls" || extension === "xlsx") {
                    $scope.SearchedFolderNames.fileNameAndId[a].flag = 1;
                }
                if (extension === "pdf") {
                    $scope.SearchedFolderNames.fileNameAndId[a].flag = 2;
                }
                if (extension === "docx" || extension === "doc") {
                    $scope.SearchedFolderNames.fileNameAndId[a].flag = 3;
                }
            }
        })
    }

    $scope.FindRelaventThingsUnderParent = function (folderId) {
       
        $scope.SearchedFolderNames = null;
        $scope.RelaventFile = null;
        
        
        $('#searchResultModal').modal({show:false});
        $http.get("/Dashboard/RelaventUnderParent?FolderId=" + folderId)
        .then(function (response) {
            $scope.SearchedFolderNames = response.data.searchRelaventFolder;
            $scope.PreviousFolderId = response.data.pId;
           
            $scope.RelaventFile = response.data.searchRelaventFile;

            for (var a in $scope.RelaventFile) {
                var str = $scope.RelaventFile[a].FileName;
                
                var extension = str.substring(str.lastIndexOf(".") + 1, str.length);
                if (extension === "xls" || extension === "xlsx") {
                    $scope.RelaventFile[a].flag = 1;
                }
                if (extension === "pdf") {
                    $scope.RelaventFile[a].flag = 2;
                }
                if (extension === "docx" || extension === "doc") {
                    $scope.RelaventFile[a].flag = 3;
                }
            }
            
            if ($scope.SearchedFolderNames == false ) {
                $('#searchResultModal').modal('show');
                $scope.ErrorMsg = "No Folder Available";
                $scope.flag = 3;
                $scope.root = 0;
            }
            
            $scope.ErrorMsg = "No Folder Available";
            if ($scope.SearchedFolderNames[0].FolderPhysicalPath) {
                var string1 = $scope.SearchedFolderNames[0].FolderPhysicalPath.substring($scope.SearchedFolderNames[0].FolderPhysicalPath.indexOf('\\') + 1);
            var string2 = string1.substring(string1.indexOf('\\') + 1);
            var abc=string1.lastIndexOf('\\')[0];
            console.log(string1 + " " + abc);
            $scope.PhysicalPath = string2.replaceAll('\\', '>>');
            $('#searchResultModal').modal('show');
            $scope.flag = 2;
            $scope.root = 0;
            }
            if ($scope.PreviousFolderId == 0) {
                $scope.root = 1;
            }
            
        })
    }
    $scope.CloseModal = function () {
        $('#searchResultModal').modal('hide');
    }

});

