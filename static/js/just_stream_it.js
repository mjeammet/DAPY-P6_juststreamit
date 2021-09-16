const api_url = "http://localhost:8000/api/v1/titles/";
const url_dico = {
  'best_movies':  api_url + "?sort_by=-imdb_score",
  'cat1':  api_url + "?sort_by=-imdb_score&country=Cuba",
  "cat2":  api_url + "?genre=sci-fi&sort_by=-votes",
};
// get_best_movie();
for (carousel_id of Object.keys(url_dico)){
  updateCarousel(carousel_id, url_dico[carousel_id]);
}

// CAROUSEL-RELATED FUNCTIONS 

// connecting to the api
async function get_json_from_api(url) {
  let api_data = await fetch(url)
  let api_json = await api_data.json();
  return api_json;
}

// if (category_name == 'best_movies'){
  //       featured_img = document.getElementsByClassName('best_movie_img');
  //       console.log(featured_img);
  //       featured_img.src = api_data[0].image_url;
  //       console.log(api_data[0].image_url);
  //     }


// takes carousel box element and fills it with appropriate movie

async function updateCarousel(element_id, query_url){
  let json = await get_json_from_api(query_url);
  list_of_movies = json.results
  carousel = document.getElementById(`${element_id}`)
  element = carousel.querySelector(".carouselBox")
  // element.innerHTML = ""

  // update previous and next buttons' onclick behaviours
  // TODO : disable button if json.next == null
  let button_previous = carousel.querySelector(".switchLeft");
  button_previous.onclick = function() { updateCarousel(element_id, json.previous);  }; 

  let button_next = carousel.querySelector(".switchRight");
  button_next.onclick = function() { updateCarousel(element_id, json.next);  }; 

  // update cover boxes
  let box = document.createElement("div");
  box.className = "carouselBox";

  let index = 0;
  for (pic_index in list_of_movies){
      index ++;
      var cover_url = list_of_movies[pic_index].image_url;
      var movie_id = list_of_movies[pic_index].id;
      box.insertAdjacentHTML(
        "beforeend",
        `<img class="img-${index}" slider-img" src="${cover_url}" onclick="open_details(${movie_id});" />`
      )
  }
  element.replaceChild(box, element.childNodes[1])
}


// MODAL WINDOW-RELATED THINGIES
var master_container = document.querySelector('.master-container')

function open_details(movie_id) {
  // Create movie instance
  var movie = new Movie(movie_id)

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
    // /api/v1/title/${id}
  }
}