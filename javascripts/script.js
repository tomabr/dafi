var app = angular.module( 'myApp', [] );

app.filter('selectedColor', function () {
  return function (items, param) {

  
     if(param === undefined)
        return items;

     var arr=[];
     arr.length =0;
     angular.forEach(param, function(value, key){
      if(value === true){
        arr[key]=value;
        arr.length +=1;
      }
    });

     if(arr.length === 0)
      return items;
    

    var filters=[];
    angular.forEach(items, function(value){

      
        if(arr[value.color]===true)
          filters.push(value);

    });
  

    return filters;
  };
});



angular.module( "myApp" ).service('Model', [function() {
    var models = {};

    function load(modelPath) {
      if (models[modelPath] == undefined) {
        models[modelPath] = {};


        jQuery.ajax({
          url: '/dafi/javascripts/' + modelPath + '.model.json',
          dataType: 'json',
          async: false,
          success: function(data) {
            models[modelPath] = data;
          },
          error: function() {
            console.log('Failed to load ' + modelPath + ' model.');
          }
        });

      }
      return models[modelPath];
    }

    return {
      load: load
    };
  }]);

angular.module( "myApp" ).directive( 'pro', ["Model" , function( Model ) {
  return {
    restrict: 'A',
    controller: function( $scope, $timeout ) {

    
      var products = Model.load('products');
      $scope.products = Object.keys(products).map(function(k) { return products[k] });
     
      $scope.clear = function(){
        $scope.model={};
      }

      $scope.showButton = function(){

        if($scope.model === undefined) return false;

        var len = Object.keys($scope.model).length;

        if(len === 0 ) {
            return false
        }else if (len === 1){

           if($scope.model.hasOwnProperty("color") === true){
              var i=0;
                angular.forEach($scope.model.color, function(value){
                if(value===true)
                  i++;
              });
              if(i===0) return false;
           }     

        }
         return true;
      }
      

      var bucket = {amount:0, price:0};
    
      bucket.addProduct = function(product){
        bucket.price = parseFloat(bucket.price);
        var p = parseFloat(product.price,10);
        p=Math.round(p*Math.pow(10,2))/Math.pow(10,2);
        bucket.price = bucket.price + p;
        bucket.price = Math.round(bucket.price*Math.pow(10,2))/Math.pow(10,2);
        bucket.price = bucket.price.toFixed(2);
        bucket.amount += 1;
      }

        $scope.alerts = [];

       $scope.addAlert = function(name) {
            $scope.alerts.push({name: name});            
            $timeout(function() {$scope.alerts.shift()}, 5000);
        };

        
      
      $scope.bucket = bucket;



    },
  }
}]);