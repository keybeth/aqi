describe('aqi', function () {
  'use strict';
 
  var $rootScope, $state;
 
  beforeEach(module('app'));
  beforeEach(module('app/aqi/aqi.view.html'));
 
  beforeEach(inject(function (_$rootScope_, _$state_) {
    $rootScope = _$rootScope_;
    $state = _$state_;
  }));
 
  describe('aqi tests', function () {
    it('should test routes', function () {
      $state.go('app');
      $state.transition.then(function () {
        expect($state.current.name).to.equal('app');
      });
      $rootScope.$digest();
    });
  });
});