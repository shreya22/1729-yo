self.onmessage = function(e) {
  var time = e.data;

  var timer = setInterval(toDo, 1000);


  function toDo() {

    time = time - 1;
    if(time == -1) clearInterval(timer);
    postMessage({
      time: time,
      isTimeOut: (time==-1)?true:false
    });
  }



}