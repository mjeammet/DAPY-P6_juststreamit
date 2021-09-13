
const sliders = document.querySelector(".carouselBox");
// alert(sliders.innerHTML)
var scrollPerClick = 172;
var ImagePadding = 20;

showMovieData();

// SCROLLING PART 
var scrollAmount = 0;

function sliderScrollLeft() {
  sliders.scrollTo({
    top: 0, 
    left: (scrollAmount -= scrollPerClick),
    behavior: "smooth"
  });

  if (scrollAmount <  0) {
    scrollAmount = 0;
  }
}

function sliderScrollRight() {  
  if (scrollAmount <= sliders.scrollWidth - sliders.clientWidth){
    alert(scrollAmount + " ->" + (scrollAmount + scrollPerClick) + " sur " + sliders.scrollWidth);
    sliders.scrollTo({
      top: 0,
      left: (scrollAmount += scrollPerClick),
      behavior: "smooth"
    });
  }
}


function showMovieData(){
  // Loading elements
  // Here insert API elements
  ids = ["best_movies", "cat1"];
  pics = ["test_images/contact.jpg", "test_images/Enemy.jpg", "img/jsi_logo.png"];

  for (id of ids){
    element = document.querySelector(`#${id}`).querySelector('.carousel').querySelector(".carouselBox")
    fillElementMovies(element, pics)
  }  
}

// takes carousel box element and fills it with appropriate 
function fillElementMovies(element, pics){  
  let index = 0;

  for (pic_index in pics){
    for (let re = 0; re < 3; re++){
      index ++;
      element.insertAdjacentHTML(
        "beforeend",
        `<img class="img-${index}" slider-img" src="./static/${pics[pic_index]}" />`
      )
    }
  }

  // scrollPerClick = document.querySelector(".img-1").offsetWidth + ImagePadding;
  // alert(scrollPerClick)
}
