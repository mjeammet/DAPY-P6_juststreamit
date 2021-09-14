
const sliders = document.querySelector(".carouselBox");
// alert(sliders.innerHTML)
var scrollPerClick = 172;
var ImagePadding = 20;

get_api();
// console.log(data);
// showMovieData();

// CAROUSEL-RELATED FUNCTIONS 
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
    // alert(scrollAmount + " ->" + (scrollAmount + scrollPerClick) + " sur " + sliders.scrollWidth);
    sliders.scrollTo({
      top: 0,
      left: (scrollAmount += scrollPerClick),
      behavior: "smooth"
    });
  }
}


// DATA RELATED PART

// takes carousel box element and fills it with appropriate 
function fillCarousel(element_id, list_of_movies){
  element = document.querySelector(`#${element_id}`).querySelector('.carousel').querySelector(".carouselBox")

  let index = 0;

  for (pic_index in list_of_movies){
      index ++;
      element.insertAdjacentHTML(
        "beforeend",
        `<img class="img-${index}" slider-img" src="${list_of_movies[pic_index].image_url}" />`
      )
  }

  // scrollPerClick = document.querySelector(".img-1").offsetWidth + ImagePadding;
  // alert(scrollPerClick)
}

// API
async function get_api() {
  ids = ["best_movies", "cat1", "cat2"];

  api_url = "http://localhost:8000/api/v1/titles/" 
  uri = [api_url + "?sort_by=-imdb_score", 
        api_url + "?sort_by=-imdb_score&country=Cuba",
        api_url + "?genre=sci-fi&sort_by=-votes"];



  for (index in ids){
    api_url = uri[index];
    // console.log(uri[index])
    var test = await fetch(api_url);
    var data = await test.json();
    var api_data = data.results;
  
    fillCarousel(ids[index], api_data);
  }
}

