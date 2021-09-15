
// const sliders = document.querySelector(".carouselBox");
// alert(sliders.innerHTML)
var scrollPerClick = 172;
var ImagePadding = 20;

get_data();
// console.log(data);
// showMovieData();

// CAROUSEL-RELATED FUNCTIONS 
var scrollAmount = 0; // make a scrollAmount for each carousle

function sliderScrollLeft(element) {
  carousel = element.nextElementSibling;
  carousel.scrollTo({
    top: 0, 
    left: (scrollAmount -= scrollPerClick),
    behavior: "smooth"
  });

  if (scrollAmount <  0) {
    scrollAmount = 0;
  }
}

function sliderScrollRight(element) {
  carousel = element.previousElementSibling;
  if (scrollAmount <= carousel.scrollWidth - carousel.clientWidth){
    // alert(scrollAmount + " ->" + (scrollAmount + scrollPerClick) + " sur " + sliders.scrollWidth);
    carousel.scrollTo({
      top: 0,
      left: (scrollAmount += scrollPerClick),
      behavior: "smooth"
    });
  }
}

// DATA RELATED PART
// takes carousel box element and fills it with appropriate 
async function get_data() {
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

function fillCarousel(element_id, list_of_movies){
  element = document.getElementById(`${element_id}`).querySelector('.carousel').querySelector(".carouselBox")

  let index = 0;

  for (pic_index in list_of_movies){
    for (let i = 0; i < 2; i++){
      index ++;
      var cover_url = list_of_movies[pic_index].image_url;
      var movie_id = list_of_movies[pic_index].id;
      element.insertAdjacentHTML(
        "beforeend",
        `<img class="img-${index}" slider-img" src="${cover_url}" onclick="open_details(${movie_id});" />`
      )
    }
  }
  // scrollPerClick = document.querySelector(".img-1").offsetWidth + ImagePadding;
  // alert(scrollPerClick)  
}

var master_container = document.querySelector('.master-container')

function open_details(movie_id) {
  // Create movie instance
  var movie = new Movie(movie_id)
  console.log(movie.id)

  // Get the modal
  var modal = document.getElementById("myModal");

  // and fill it with movie infos
  var modal_content = document.querySelector(`.modal-content`);
  modal_content.innerHTML = `<p style='color:blue'>${movie.id}</p>`;  

  // Add the <span> element that closes the modal
  var span = document.createElement('span')
  span.className = 'close'
  span.innerHTML = '&times;'
  modal_content.appendChild(span)

  console.log(modal_content)
  modal.appendChild(modal_content);

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  } 
  
  modal.style.display = "block";
}

class Movie {
  constructor(id){
    this.id = id;
  }
}
