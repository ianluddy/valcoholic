// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('DrinkCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('drink-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.data = {
    "volume": 500,
    "quantity": 6,
    "strength": 6,
    "cost": 10,
    "unit": "ml"
  }

  $scope.drinks = [];
  $scope.drinks_added = false;

  $scope.volume_slider_max = 1000;
  $scope.volume_slider_min = 1;
  $scope.volume_slider_step = 5;

  $scope.addDrink = function() {
    $scope.modal.hide();
    $scope.drinks_added = true;
    $scope.refreshDrinks($scope.newDrink());
  };

  $scope.removeDrink = function(index) {
    $(".drink")[index].remove();
    $scope.drinks.splice(index, 1);
  }

  $scope.refreshDrinks = function(new_drink){
      $scope.drinks.push(new_drink);
      $scope.drinks.sort(function(a,b){return b.index-a.index});
  }

  $scope.newDrink = function(){
    var new_drink = {
        volume: $scope.data.volume,
        strength: parseFloat($scope.data.strength).toFixed(1),
        quantity: $scope.data.quantity,
        cost: parseFloat($scope.data.cost).toFixed(2),
        unit: $scope.data.unit,
    }
    $scope.evaluateDrink(new_drink);
    return new_drink;
  }

  $scope.evaluateDrink = function(drink){
      drink.mils = $scope.normaliseVolume(drink.unit, drink.volume, drink.quantity);
      var total_alc = (drink.mils/100) * drink.strength;
      drink.alc = parseFloat(total_alc).toFixed(2);
      drink.index = parseFloat(total_alc/drink.cost).toFixed(2);
  }

  $scope.normaliseVolume = function(unit, volume, quantity){
      switch(unit){
          case "l":
            return volume*1000*quantity;
          case "cl":
            return volume*10*quantity;
          case "oz":
            return volume*28.4*quantity;
          default:
            return volume*quantity;
      }
  }

  $scope.changeUnit = function(unit) {
      $scope.data.unit = unit;
      switch(unit){
          case "l":
            return $scope.updateUnit(0.1, 10, 0.1, 5);
          case "cl":
            return $scope.updateUnit(1, 200, 1, 100);
          case "oz":
            return $scope.updateUnit(1, 100, 1, 50);
          default:
            return $scope.updateUnit(10, 1000, 10, 500);
      }
  }

  $scope.updateUnit = function(min, max, step, value) {
    $scope.volume_slider_max = max;
    $scope.volume_slider_min = min;
    $scope.volume_slider_step = step;
    $scope.data.volume = value;
  }

  $scope.openDrinks = function() {
    $scope.modal.show()
  }

  $scope.closeDrinks = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.changeUnit("ml");
})

.controller('AboutCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('about-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openAbout = function() {
    $scope.modal.show()
  }

  $scope.closeAbout = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})


