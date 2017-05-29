'use strict';

/**
 * @ngdoc function
 * @name 1729App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the 1729App
 */
angular.module('1729App')
  .controller('MainCtrl', MainController);


MainController.$inject= ['$scope', '$http', '$location', '$window', '$interval', '$timeout'];

function MainController($scope, $http, $location, $window, $interval, $timeout){
console.log('maincontroller');
    var vm= this;
    vm.gotoElement = function (eID){
        anchorSmoothScroll.scrollTo(eID);
    };

    vm.resultStatus= "click 'Check Result' to view!";
    vm.testSuccess= false;

    vm.inputs= {
        numbers: ['_', '_', '_', '_'],
        operators: []
    };

    vm.testOperators= [];
    vm.startGame= StartGame;
    vm.validate= Validate;
    vm.validationError= '';
    vm.counter= 30;
    // vm.startTimer= startTimer;
    // vm.stopTimer= StopTimer;


    var mytimeout = null;





    var operators = {
        '+': function(a, b) { return a + b },
        '-': function(a, b) { return a - b }
    };
    var op= ['+', '-'];

    // function StartGame(){};
    // function CheckResult(){};


    function StartGame() {
        // console.log('mainAPI');

        let a,b,c,d; 
        vm.testOperators= [];
        vm.validationError

         a= Math.floor((Math.random() * 9));
         b= Math.floor((Math.random() * 9));
         c= Math.floor((Math.random() * 9));
         d= Math.floor((Math.random() * 9));

        // console.log('a b c d', a, b, c, d);

        for(let i=0; i<totalOperations.length; ++i){
            for(let j=0; j<totalOperations.length; ++j){
                let obj= {
                    numbers: [a, b, c, d],
                    first: totalOperations[i],
                    second: totalOperations[j]
                };
                let solObj= {};
                solObj= one(obj); 
                if(solObj.data && solObj.data!="") {
                    vm.inputs= solObj.data; return;
                }
                else{
                    solObj= two(obj); 
                    if(solObj.data && solObj.data!="") {
                        vm.inputs= solObj.data; return;
                    }
                    else{
                        solObj= three(obj); 
                        if(solObj.data && solObj.data!=""){
                            vm.inputs= solObj.data; return;
                        }
                        else{};
                    }
                }
            }
        }
        StartGame();
    }

    function one(obj) {
        let newObj= {
            numbers: obj.numbers,
            operators: ['=', obj.first, obj.second]
        };
        if(CheckResult(newObj).success == true) {
            return {
                status: true,
                data: newObj
            };
        }
        else return {
            status: false
        };
    }

    function two(obj) {
        let newObj= {
            numbers: obj.numbers,
            operators: [obj.first, '=', obj.second]
        };
        if(CheckResult(newObj).success == true) {
            return {
                status: true,
                data: newObj
            };
        }
        else return {
            status: false
        };
    }

    function three(obj) {
        let newObj= {
            numbers: obj.numbers,
            operators: [obj.first, obj.second, '=']
        };
        if(CheckResult(newObj).success == true) {
            return {
                status: true,
                data: newObj
            };
        }
        else return {
            status: false
        };
    }

    function Validate(){

        var formValidation= isValidated();
        if(!formValidation.status){
            vm.validationError= formValidation.message;
            return;
        }


        vm.validationError= "";
        var postObj= {
            numbers: vm.inputs.numbers,
            operators: vm.testOperators
        }

        if(CheckResult(postObj).success == true){
            alert("woohooo! You're a champ.");
            vm.inputs.numbers= ['_', '_', '_', '_'];
            vm.testOperators= [];
        }
        else alert("no dear.. please try again.");

    }

    let totalOperations= ['+', '-', '*', '/'];
    let operatorFunctions = {
        '+': function(a, b) { return a + b },
        '-': function(a, b) { return a - b },
        '*': function(a, b) { return a * b },
        '/': function(a, b) { return a / b }
    };

    let priority= {
        '/': 4,
        '*': 3,
        '-': 2,
        '+': 1
    };


    function CheckResult(postObj){

        let numbers= postObj.numbers;
        let operations= postObj.operators;

        let infixArray= [];
        for(let i=0; i<operations.length; ++i){
            infixArray.push(numbers[i]);
            infixArray.push(operations[i]);
        }
        infixArray.push(numbers[numbers.length-1]);

        let infixArray1= [], infixArray2= [];

        let temp=0, cntr= 0;
        for(temp=0; infixArray[temp]!= '='; ++temp){
            infixArray1[cntr++]= infixArray[temp];
        }

        cntr= 0; temp++;
        for(; temp< infixArray.length; ++temp){
            infixArray2[cntr++]= infixArray[temp];
        }

        let postfixArr1= createPostfix(infixArray1);
        let postfixArr2= createPostfix(infixArray2);

        let num1= validatePostfix(postfixArr1);
        let num2= validatePostfix(postfixArr2);

        if(num1 == num2) {
            // console.log('num1 num2', num1, num2);
            return {success: true};
        }
        else {
            return {success: false}
        }
    }

    function createPostfix(infixArr) {
        let stack= [];
        let postfixArr= [];

        for(let i=0; i<infixArr.length; ++i){
            if(totalOperations.indexOf(infixArr[i]) == -1){
                //number
                postfixArr.push(infixArr[i]);
            }else if(stack.length==0){
                stack.push(infixArr[i]);
            }
            else{
                if(priority[stack[stack.length-1]] > priority[infixArr[i]]){
                    let x= stack.pop();
                    postfixArr.push(x);
                }
                stack.push(infixArr[i]);
            }
        }
        while(stack.length!=0) postfixArr.push(stack.pop());
        return postfixArr;
    }

    function validatePostfix(postfixArr) {
        let stack= [];
        for(let i=0; i<postfixArr.length; ++i){
            if(totalOperations.indexOf(postfixArr[i]) == -1){
                stack.push(postfixArr[i]);
            }
            else {
                let second= stack.pop(), first= stack.pop();
                stack.push(operatorFunctions[postfixArr[i]](first, second));
            }
        }

        let ans= stack.pop();
        return ans;
    }

    function isValidated(){

        if(vm.inputs.numbers[0] == '_') return{
            status: false,
            message: "Please press 'Start Game' first."
        }

        if(vm.testOperators.length < 3) return{
            status: false,
            message: "No operation can be left empty."
        }

        var countEqual= 0;
        vm.testOperators.forEach(function(val){
            if(val == "=") countEqual++;
        })

        if(countEqual!=1) return{
            status: false,
            message: "= has to be used exactly once."
        }

        return{
            status: true,
            message: ""
        }
    }

};