$.ajaxSetup({ timeout: 4000 });
var ip = "getsomerestserver.herokuapp.com";
var id = "";
function pushconsole(input) {
  /*$(".console").text($(".console").text()+input+"\n");
  var textarea = document.getElementById('console');
  textarea.scrollTop = textarea.scrollHeight;*/
  console.log(input);
}
function connect() {
  $.get( "http://"+ip+"/api/connect/?rand="+Date.now(), function( data ) {
    if (data.type == "id") {
      console.log(data.type);
      id = data.value;
      pushconsole("Token: " + data.value);
      poll();
    }
  });
}
function poll() {
  function timeout() {
    setTimeout(function () {
      $.post( "http://"+ip+"/api/poll/?rand="+Date.now(), {"id":id}, function( data ) {
        for (i = 0; i < data.length; i++) {
          if (data[i].type == "chat") {
            pushconsole(data[i].value)
          }
        }
      });
        timeout();
    }, 1000);
  }
  timeout();
}
function sendchat(text) {
  $.post( "http://"+ip+"/api/data/?rand="+Date.now(), {"id":id,"type":"chat","value":text}, function( data ) {
  });
}
connect();
