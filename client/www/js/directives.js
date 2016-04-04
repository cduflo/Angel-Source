angular.module('starter.services', [])
    .directive("dirInfoWindow", function () {
        var Template = "<div>hi!</div>";

        return {
            restrict: "A",
            replace: true,
            template: Template,
            scope: {
                value: "dirInfoWindow"
            }
        }
    })