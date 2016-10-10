//Firebase Config
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCVLxOfjJAWnURGzZeQxePbbC1yX_GVZMc",
  authDomain: "claim-1e7a8.firebaseapp.com",
  databaseURL: "https://claim-1e7a8.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "923622627127"
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  } else {
    window.location = "./auth.html";
  }
});

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}
//Claim Array
var claims = [
  { value: 'Payment Claim', data: 'Payment', inputs: [{css: 'name email', holder: 'Recipients Email', type: 'text'},{css: 'name', holder: 'Full name', type: 'text'},{css: 'name claimTitle', holder: 'Title', type: 'text'},{css: 'date', holder: 'Date', type: 'date'},{css: 'price', holder: 'Price', type: 'text', holder: "Claimed Amount: "},{css: 'price claimNum', holder: 'Claim Number', type: 'disabled', holder: "Claim Number: "},{css: 'reason', holder: 'What happened...', type: 'textarea'}] },
  { value: 'Bespoke', data: 'Bespoke' }
];
var claiml
function updateLength() {
  var userRef = firebase.database().ref('/'+localStorage.getItem('pin')+'/claims');
    userRef.on('value', function(snapshot) {
      claimsobj = snapshot.val();
      claiml = Object.keys(claimsobj).length;
  });
}
updateLength();
$(function(){
  var myApp = new Framework7();
  var $$ = Dom7;

  // setup autocomplete function pulling from claims[] array

  $('#autocomplete').autocomplete({
    lookup: claims,
    onSelect: function (suggestion) {
        genClaim(suggestion)
    }
  });

  //Gen a claim popup with correct feilds
  function genClaim(suggestion) {
    console.log(suggestion);
    // console.log(suggestion.inputs[0].type);
    var popupHTML = '<div class="popup"><div class="nav-bar"><h1 style="padding-left: 12px;" >'+suggestion.data+' claim.</h1></div><div class="input-div"></div><div class="centerr"><div onclick="genEmail()"class="mail-but"><i class="material-icons">email</i>  Mail</h1></div><div style="background-color: #e74c3c;"class="mail-but close-popup">Close</h1></div></div>'
    myApp.popup(popupHTML);
    for (var i = 0; i < suggestion.inputs.length; i++) {
    var css =  suggestion.inputs[i].css;
    var holder = suggestion.inputs[i].holder;
    var type = suggestion.inputs[i].type;
    var value = suggestion.inputs[i].value;
    if (type == 'textarea') {
        $('.input-div').append('<textarea id="base" placeholder="'+holder+'" type="'+type+'" class="'+css+'">')
        continue;
    } else if (type == 'disabled') {
      var cl = parseInt(claiml);
      var ncl = cl + 1 - 1;
      $('.input-div').append('<input id="base" value="'+ncl+'" placeholder="'+ncl+'" type="text" class="'+css+'" disabled>')
      continue;
    }
    if (value == undefined) {
      value = ""
    }
    $('.input-div').append('<input id="base" value="'+value+'" placeholder="'+holder+'" type="'+type+'" class="'+css+'">')
    }
  }

});

  //Mail
function genEmail(type) {
  var cl = parseInt(claiml);
  var ncl = cl;
  var name = $('.name').val()
  var date = $('.date').val()
  var claimNum = ncl;
  var price = $('.price').val()
  var reason = $('.reason').val()
  var email = $('.email').val()
  var title = $('.claimTitle').val()
  //window.location.href = "mailto:"+email+"?Subject=You%20have%20recived%20a%20new%20claim%20from%20"+name+"&body=Body-goes-here";
  var jsonobject = {};
  jsonobject["name"] = name;
  jsonobject["date"] = date;
  jsonobject["claimNum"] = claimNum;
  jsonobject["price"] = price;
  jsonobject["reason"] = reason;
  jsonobject["email"] = email;
  jsonobject["status"] = "pending";
  jsonobject["title"] = title;
  jsonobject["statusReason"] = "";
  jsonobject["hash"] = hashPin();
  var claimsRef = firebase.database().ref('/'+localStorage.getItem('pin')+'/claims/'+claimNum);
  claimsRef.set(jsonobject);
  updateLength();
  var trampolineRef = firebase.database().ref('/trampolines/'+randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
  trampolineRef.set(""+localStorage.getItem('pin')+"_"+claimNum+"");
}

function getHistory() {
  var userRef = firebase.database().ref('/'+localStorage.getItem('pin')+'/claims');
	userRef.on('value', function(snapshot) {
    $('.history-ul').empty();
    $('.history-ul').append('<hr>');
		var p = snapshot.val();
		for (var key in p) {
  		if (p.hasOwnProperty(key)) {
        if (p[key] == "filler") {
        } else if (p[key].status == "true") {
            $('.history-ul').append('<li><h3><div class="circle"></div>#'+key+' '+p[key].title+' <span style="color: grey;">'+p[key].date+'</span></h3><p>To '+p[key].name+' <span style="color: grey;">'+p[key].email+'</span></p><hr></li>')
        } else if (p[key].status == "false") {
            $('.history-ul').append('<li><h3><div class="circle-bad"></div>#'+key+' '+p[key].title+' <span style="color: grey;">'+p[key].date+'</span></h3><p>To '+p[key].name+' <span style="color: grey;">'+p[key].email+'</span></p><p>Reason: '+p[key].statusReason+'</p><hr></li>')
        } else if (p[key].status == "pending") {
            $('.history-ul').append('<li><h3><div class="circle-pend"></div>#'+key+' '+p[key].title+' <span style="color: grey;">'+p[key].date+'</span></h3><p>To '+p[key].name+' <span style="color: grey;">'+p[key].email+'</span></p><hr></li>')
        }
  		}
    }
  });
}

function autoFill() {
$('.name').val('Henry Confos')
$('.date').val('2016-10-18')
$('.claimNum').val('4')
$('.price').val('$3000')
$('.reason').val('Expensive to cover moving of crane to other side of site.')
$('.email').val('hcon456@gmail.com')
}
getHistory();
