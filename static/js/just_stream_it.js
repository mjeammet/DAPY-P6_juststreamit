function test(){
  alert("The javascript file has been correctly loaded.");
}

const sliders = document.querySelector(".carouselBox");
// alert(sliders.innerHTML)
var scrollPerClick = 400;
var ImagePadding = 20;

showMovieData();

// SCROLLING PART 
var scrollAmount = 0;

function sliderScrollLeft() {
  // alert(scrollPerClick, " to the left");
  // sliders.scrollLeft -= 400;
  sliders.scrollTo({
    top: 0, 
    left: (scrollAmount -= scrollPerClick),
    behavior: "smooth"
  });

  // if (scrollAmount <  0) {
  //   scrollAmount = 0;
  // }
}

function sliderScrollRight() {
  // alert("Going " + scrollPerClick + " to the right.");
  sliders.scrollTo({
    top: 0,
    left: (scrollAmount += scrollPerClick),
    behavior: "smooth"
  });
  // if (scrollAmount <= sliders.scrollWidth - sliders.clientWidth){
  //   sliders.scrollTo({
  //     top: 0,
  //     left: (scrollAmount += scrollPerClick),
  //     behaviour: "smooth"
  //   });
  // }
}

function showMovieData(){
  // Loading elements
  // Here insert API elements
  pics = ["test_images/contact.jpg", "test_images/Enemy.jpg", "img/jsi_logo.png"]
  let index = 0;

  for (pic_index in pics){
    for (let re = 0; re < 2; re++){
      index ++;
      sliders.insertAdjacentHTML(
        "beforeend",
        `<img class="img-${index}" slider-img" src="./static/${pics[pic_index]}" />`
      )
    }  
  }

  scrollPerClick = document.querySelector(".img-1").clientWidth + ImagePadding;
}
