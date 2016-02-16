(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('angularRate.config', [])
    .value('angularRate.config', {
      debug: true
    });

  // Modules
  angular.module('angularRate.directives', []);
  angular.module('angularRate',
    [
      'angularRate.config',
      'angularRate.directives'
    ]);

})(angular);

(function (angular) {
  angular
    .module('angularRate.directives')
    .directive('rate', function () {
      function _buildStars(scope, stars) {
        scope.stars = [];

        for (var i = 0; i < 5; i++) {
          if ((i + 1) <= Math.floor(stars)) {
            scope.stars.push('full');
          } else {
            scope.stars.push((stars % 1 > 0 && i === Math.floor(stars)) ? 'half' : 'empty');
          }
        }
      }

      return {
        restrict: 'E',
        templateUrl: 'template/rate/rate.html',
        require: 'ngModel',
        scope: true,
        link: function (scope, element, attrs, ngModelCtrl) {
          scope.readonly = attrs.readonly || false;

          scope.emptyIcon = attrs.iconEmpty || 'fa-star-o';
          scope.fullIcon = attrs.iconFull || 'fa-star';
          scope.halfIcon = attrs.iconHalf || 'fa-star-half-o';
          scope.iconBase = attrs.iconBase || 'fa';
          scope.otherClass = attrs.otherClass || '';

          ngModelCtrl.$render = function () {
            _buildStars(scope, ngModelCtrl.$modelValue || 0);
          };

          scope.select = function (value) {
            if (scope.readonly) {
              return false;
            }

            ngModelCtrl.$setViewValue(value);
            scope.restoreStars();
          };

          scope.starHover = function ($index) {
            if (scope.readonly) {
              return false;
            }

            for (var i = 0; i < scope.stars.length; i++) {
              scope.stars[ i ] = (i <= $index) ? 'full' : 'empty';
            }
          };

          scope.restoreStars = function () {
            _buildStars(scope, ngModelCtrl.$viewValue);
          };
        }
      };
    });
})(angular);

angular.module("angularRate").run(["$templateCache", function($templateCache) {$templateCache.put("template/rate/rate.html","<div id=\"rates\" ng-class=\"{ readonly : readonly }\"><span class=\"stars\" ng-repeat=\"star in stars track by $index\" ng-click=\"select($index + 1)\" ng-mouseenter=\"starHover($index)\" ng-mouseleave=\"restoreStars()\"><i class=\"fa\" ng-class=\"{ \'{{ fullIcon }}\' : star === \'full\', \'{{ halfIcon }}\': star === \'half\', \'{{ emptyIcon }}\' : star === \'empty\', \'{{ otherClass }}\': true }\"></i></span></div>");}]);