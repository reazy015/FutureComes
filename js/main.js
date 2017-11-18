var prevBtn = document.querySelector('.slider__prev-btn');
var nexBtn = document.querySelector('.slider__next-btn');
var slides = document.querySelectorAll('.slider-list__item');
var index = 0;
var count = slides.length;

prevBtn.addEventListener('click', function(){
  slides[index].classList.toggle('slider-list__item--active');
  index--;
  if ( index < 0 ) {
    index = count - 1;
  }

  slides[index].classList.toggle('slider-list__item--active');
});

nextBtn.addEventListener('click', function(){
  slides[index].classList.toggle('slider-list__item--active');
  index++;
  if ( index > count -1 ) {
    index = 0;
  }

  slides[index].classList.toggle('silder-item__item--active');
});
