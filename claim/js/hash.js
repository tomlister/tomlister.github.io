//hash.js
//for hashing digits
//-tl
function hashPin() {
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(localStorage.getItem('pin'));
  var hash = shaObj.getHash("HEX");
  return hash;
}

function hashNum(num) {
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(num);
  var hash = shaObj.getHash("HEX");
  return hash;
}
