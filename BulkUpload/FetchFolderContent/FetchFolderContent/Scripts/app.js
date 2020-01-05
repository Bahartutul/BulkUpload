var app = angular.module("DigitalArchivingApp", ['ngTagsInput']);
app.filter("dateTimeFilter", function () {
    return function (item) {
        if (item != null) {
            return new Date(parseInt(item.substr(6)));
        }
        return "";
    };
});

