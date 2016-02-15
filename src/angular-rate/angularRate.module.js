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
