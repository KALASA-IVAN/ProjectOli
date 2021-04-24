function menuBar() {
  if (document.getElementById('menu').style.width != '0px') {
    document.getElementById('menu').style.width = '0px';
    document.getElementById('main').classList.remove('lg:ml-60');
  } else {
    document.getElementById('menu').style.width = '240px';
    document.getElementById('main').classList.add('lg:ml-60');
  }
}

function mobileMenu() {
  document.getElementById('menu').classList.add('mobile');
}
function closeMenu() {
  document.getElementById('menu').classList.remove('mobile');
}
