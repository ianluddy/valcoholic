// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .controller('DrinkCtrl', function ($scope, $ionicModal) {

        $ionicModal.fromTemplateUrl('drink-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal
        })

        $scope.data = {
            "volume": 500,
            "quantity": 6,
            "strength": 6,
            "cost": 10,
            "unit": "ml",
            "drinks": [],
            "sliders": {
                "volume": {
                    "max": 1000,
                    "min": 1,
                    "step": 5
                },
                "cost": {
                    "max": 50,
                    "min": 0.1,
                    "step": 0.1
                },
                "strength": {
                    "max": 50,
                    "min": 0.1,
                    "step": 0.1
                },
                "quantity": {
                    "max": 50,
                    "min": 1,
                    "step": 1
                }
            }
        }

        $scope.addDrink = function () {
            $scope.modal.hide();
            $scope.refreshDrinks($scope.newDrink());
        };

        $scope.removeDrink = function (index) {
            $(".drink")[index].remove();
            $scope.data.drinks.splice(index, 1);
        }

        $scope.refreshDrinks = function (new_drink) {
            $scope.data.drinks.push(new_drink);
            $scope.data.drinks.sort(function (a, b) {
                return b.index - a.index
            });
        }

        $scope.newDrink = function () {
            var new_drink = {
                volume: $scope.data.volume,
                strength: parseFloat($scope.data.strength).toFixed(1),
                quantity: $scope.data.quantity,
                cost: parseFloat($scope.data.cost).toFixed(2),
                unit: $scope.data.unit
            }
            $scope.evaluateDrink(new_drink);
            return new_drink;
        }

        $scope.evaluateDrink = function (drink) {
            drink.mils = $scope.normaliseVolume(drink.unit, drink.volume, drink.quantity);
            var total_alc = (drink.mils / 100) * drink.strength;
            drink.alc = parseFloat(total_alc).toFixed(2);
            drink.index = parseFloat(total_alc / drink.cost).toFixed(2);
        }

        $scope.normaliseVolume = function (unit, volume, quantity) {
            switch (unit) {
                case "l":
                    return volume * 1000 * quantity;
                case "cl":
                    return volume * 10 * quantity;
                case "oz":
                    return volume * 28.4 * quantity;
                default:
                    return volume * quantity;
            }
        }

        $scope.setMl = function(){
            $scope.updateVolumeUnit(10, 1000, 10, 500, "ml");
        };

        $scope.setCl = function(){
            $scope.updateVolumeUnit(1, 200, 1, 100, "cl");
        };

        $scope.setOz = function(){
            $scope.updateVolumeUnit(1, 100, 1, 50, "oz")
        };

        $scope.setL = function(){
            $scope.updateVolumeUnit(0.1, 10, 0.1, 5, "l");
        };

        $scope.updateVolumeUnit = function (min, max, step, value, unit) {
            $scope.data.sliders.volume.max = max;
            $scope.data.sliders.volume.min = min;
            $scope.data.sliders.volume.step = step;
            $scope.data.volume = value;
            $scope.data.unit = unit;
            $scope.decrementVolume();
            $scope.incrementVolume();
        };

        $scope.incrementVolume = function () {
            $scope.data.volume = $scope.incrementUnit($scope.data.volume, $scope.data.sliders.volume.max, $scope.data.sliders.volume.step);
        };

        $scope.decrementVolume = function () {
            $scope.data.volume = $scope.decrementUnit($scope.data.volume, $scope.data.sliders.volume.min, $scope.data.sliders.volume.step);
        };

        $scope.incrementQuantity = function () {
            $scope.data.quantity = $scope.incrementUnit($scope.data.quantity, $scope.data.sliders.quantity.max, $scope.data.sliders.quantity.step);
        };

        $scope.decrementQuantity = function () {
            $scope.data.quantity = $scope.decrementUnit($scope.data.quantity, $scope.data.sliders.quantity.min, $scope.data.sliders.quantity.step);
        };

        $scope.incrementCost = function () {
            $scope.data.cost = $scope.incrementUnit($scope.data.cost, $scope.data.sliders.cost.max, $scope.data.sliders.cost.step);
        };

        $scope.decrementCost = function () {
            $scope.data.cost = $scope.decrementUnit($scope.data.cost, $scope.data.sliders.cost.min, $scope.data.sliders.cost.step);
        };

        $scope.incrementStrength = function () {
            $scope.data.strength = $scope.incrementUnit($scope.data.strength, $scope.data.sliders.strength.max, $scope.data.sliders.strength.step);
        };

        $scope.decrementStrength = function () {
            $scope.data.strength = $scope.decrementUnit($scope.data.strength, $scope.data.sliders.strength.min, $scope.data.sliders.strength.step);
        };

        $scope.incrementUnit = function (unit, max, step) {
            if (unit + step > max) {
                return $scope.round(max);
            } else {
                return $scope.round(unit + step);
            };
        };

        $scope.decrementUnit = function (unit, min, step) {
            if (unit - step < min) {
                return $scope.round(min);
            } else {
                return $scope.round(unit - step);
            };
        };

        $scope.round = function (value) {
            return Math.round(value * 10) / 10;
        };

        $scope.openDrinks = function () {
            $scope.modal.show()
        };

        $scope.closeDrinks = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        $scope.setMl();
    })

    .controller('AboutCtrl', function ($scope, $ionicModal) {

        $ionicModal.fromTemplateUrl('about-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal
        })

        $scope.openAbout = function () {
            $scope.modal.show()
        }

        $scope.closeAbout = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    })


