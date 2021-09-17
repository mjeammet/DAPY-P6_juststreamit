const api_url = "http://localhost:8000/api/v1/titles/";
const url_dico = {
  'best_movies':  api_url + "?sort_by=-imdb_score",
  'cat1':  api_url + "?sort_by=-imdb_score&country=Cuba",
  "cat2":  api_url + "?genre=horror&sort_by=-votes",
  "cat3": api_url + "?genre=sci-fi&sort_by=-date_published"
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
  

  // update previous and next buttons' onclick behaviours
  // TODO : disable button if json.next == null
  let button_previous = carousel.querySelector(".switchLeft");
  button_previous.onclick = function() { updateCarousel(element_id, json.previous);  }; 

  let button_next = carousel.querySelector(".switchRight");
  button_next.onclick = function() { updateCarousel(element_id, json.next);  }; 

  // update cover boxes  
  let cover_box = carousel.querySelector(".carouselBox");
  cover_box.innerHTML = "";

  let index = 0;
  for (pic_index in list_of_movies){
      index ++;
      var cover_url = list_of_movies[pic_index].image_url;
      var movie_id = list_of_movies[pic_index].id;
      cover_box.insertAdjacentHTML(
        "beforeend",
        `<img class="img-${index}" slider-img" src="${cover_url}" onclick="open_details(${movie_id});" />`
      )
  }
}


// MODAL WINDOW-RELATED THINGIES
var master_container = document.querySelector('.master-container')

async function open_details(movie_id) {    
  // Get movie infos
  let movie_details = await get_json_from_api(api_url + movie_id)
    .then((details) => {
      return details
    })

  // Create movie instance
  // var movie = new Movie(movie_details)

  // Get the modal
  var modal = document.getElementById("myModal");

  // and fill it with movie infos
  let modal_content = document.querySelector(`.modal-content`);
  modal_content.innerHTML = ""

  let cover = document.createElement('img');
  cover.src = movie_details.image_url
  modal_content.appendChild(cover)

  let info_block = document.createElement('p');

  let title = document.createElement('h1');
  title.innerText = `${movie_details.original_title} (${movie_details.id})`
  info_block.appendChild(title)
  
  let primary_infos = document.createElement("h2")
  if (movie_details.rated == 'Not rated or unkown rating'){
    rated = "Tous publics" // maybe just say it's unknown ?
  } else {
    rated = `Rated ${movie_details.rated}`
  }
  primary_infos.innerText = `${movie_details.year} - ${rated} - ${movie_details.duration/60>>0}h${movie_details.duration % 60}`;
  info_block.appendChild(primary_infos)

  let genre_box = document.createElement('ul');
  genre_box.className = 'genre_box';
  for (genre of movie_details.genres){    
    let genre_tag = document.createElement('li');    
    genre_tag.innerText = genre;
    genre_box.appendChild(genre_tag);
  }
  info_block.appendChild(genre_box)

  let modal_description = document.createElement('p');
  if (movie_details.long_description != "No long description provided"){
    modal_description.innerText = movie_details.long_description
  } else {
    modal_description.innerText = movie_details.description
  }
  info_block.insertAdjacentElement("beforeend", modal_description)


  modal_content.appendChild(info_block)

  // Add the <span> element that closes the modal
  var span = document.createElement('span')
  span.className = 'close'
  span.innerHTML = '&times;'
  modal_content.appendChild(span)

  // console.log(modal_content)
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
  constructor(movie_details){
    this.id = movie_details.id;
    this.title = movie_details.title;
    // /api/v1/title/${id}
  }
}