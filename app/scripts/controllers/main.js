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


MainController.$inject= ['$scope', '$http', '$location', '$window', '$interval', 'toastr'];

function MainController($scope, $http, $location, $window, $interval, toastr, SweetAlert){
console.log('maincontroller');
    var vm= this;
    vm.gotoElement = function (eID){
        anchorSmoothScroll.scrollTo(eID);
    };

    vm.count=0;
    vm.correct= 0;
    vm.incorrect= 0;
    vm.score= 0;
    vm.worker;
    vm.introText= "Start Game"; 
    vm.resultStatus= "click 'Submit' to view!";
    vm.testSuccess= false;
    vm.inputs= {
        numbers: ['_', '_', '_', '_'],
        operators: []
    };
    vm.timer= null;

    vm.testOperators= ['', '', ''];
    vm.startGame= StartGame;
    vm.validate= Validate;
    vm.validationError= '';
    vm.timeLeft= 180;
    vm.triggerTimer= TriggerTimer;

    var operators = {
        '+': function(a, b) { return a + b },
        '-': function(a, b) { return a - b }
    };
    var op= ['+', '-'];

    // function TimerStart(){
    //     var decreaseCount= function(){
    //         vm.timeLeft--;
    //     };
    //     vm.timer= $interval(decreaseCount, 1000, 180);
    // }

    // function TimerStop(){
    //     $interval.cancel(vm.timer);
    //     alert('Time Out!');
    // }

    function StartGame() {

        let a,b,c,d; 
        vm.testOperators= ['', '', ''];
        vm.validationError= "";
        vm.introText= "Skip";

        if(vm.count == 0) vm.triggerTimer();

         a= Math.floor((Math.random() * 8)+1);
         b= Math.floor((Math.random() * 8)+1);
         c= Math.floor((Math.random() * 8)+1);
         d= Math.floor((Math.random() * 8)+1);

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

        vm.isCorrect= false;
        if(CheckResult(postObj).success == true){
            toastr.success("Correct! There goes your +2.");
            vm.isCorrect= true;
            vm.correct= vm.correct+1;
        }
        else {
            toastr.error("Sorry dear... -1 for you!");
            vm.incorrect= vm.incorrect+1;
        }

        vm.count= vm.count+1;
        if(vm.isCorrect) StartGame();
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
                if(priority[stack[stack.length-1]] >= priority[infixArr[i]]){
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

        for (var i = 0; i < vm.testOperators.length; i++) {
            if(vm.testOperators[i] == "") return{
                status: false,
                message: "No operation can be left empty."
            }
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


    function TriggerTimer(){ 
        vm.worker = new Worker('./worker.js');
        vm.worker.onmessage = function(e) {
            // console.log('timerResponse', e);

            if(e.data.isTimeOut){
                var score= 2*vm.correct - vm.incorrect;

                var text;

                if(score < 5) text= "You need to work upon your speed..";
                else if(5<=score<20) text= "Keep it up!";
                else text= "You're as fast as minato!";

                swal({
                  title: text,
                  text: "Your score is: "+score,
                  type: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'New Game'
                }).then(function () {
                  $window.location.href = '/';
                }, function(dismiss){
                    $window.location.href = '/';
                })
            }

            vm.timeLeft = e.data.time;
            $scope.$apply();
        };

        vm.worker.postMessage(vm.timeLeft);
    }

};