require('./header.less'); // example of including component's styles
const template = require('./header.hbs');

const header = document.getElementsByClassName('header')[0];
const logo = document.getElementsByClassName('logo')[0];

window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset || document.documentElement.scrollTop;
  if (scrolled > 50) {
    header.classList.add('fixed-header');
    logo.classList.remove('display-none')
  }
  if (scrolled <= 50) {
    header.classList.remove('fixed-header');
    logo.classList.add('display-none');
  }
});