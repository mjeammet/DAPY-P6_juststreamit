const api_url = "http://localhost:8000/api/v1/titles/";
const url_dico = {
  'best_movies':  api_url + "?sort_by=-imdb_score",
  'cat1':  api_url + "?sort_by=-imdb_score&country=Cuba",
  "cat2":  api_url + "?genre=horror&sort_by=-votes",
  "cat3": api_url + "?imdb_score_min=8&sort_by=votes"
};
// init_data();

get_best_movie();
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

async function get_best_movie() {
  let json = await get_json_from_api(api_url + "?sort_by=-imdb_score");
  selected_movie = json.results[0]

  let featured_box = document.getElementById('featuredMovie')
  let title = featured_box.childNodes[1].childNodes[1];
  title.innerHTML = selected_movie.title
  let play_button = title.nextElementSibling;
  play_button.onclick = function() { open_details(selected_movie.id); }
  let featured_cover = featured_box.childNodes[3];
  // console.log(featured_cover);
  featured_cover.src = selected_movie.image_url;
}

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
  var movie = new Movie(movie_details)

  // Get the modal
  var modal = document.getElementById("myModal");

  // and fill it with movie infos
  let modal_content = document.querySelector(`.modal-content`);
  modal_content.innerHTML = ""

  let cover = document.createElement('img');
  cover.className = "modal_cover";
  cover.src = movie_details.image_url
  modal_content.appendChild(cover)

  let info_block = document.createElement('p');

  let title = document.createElement('h1');
  title.innerText = `${movie.title} (${movie.id})`
  info_block.appendChild(title)
  
  let primary_infos = document.createElement("h2")
  primary_infos.innerText = `${movie.year} - ${movie.rated} - ${movie.duration/60>>0}h${movie.duration % 60}`;
  info_block.appendChild(primary_infos)
  
  // tag box 
  let tag_box = document.createElement('ul');  
  tag_box.className = 'tag_box';
  tag_box.innerHTML += `<li style="background-color: ${movie.score_color}">${movie.imdb_score}/10</li>`;
  tag_box.innerHTML += `<li style="background-color: lightgray">${movie.votes} votes</li>`;
  for (genre of movie.genres){
    tag_box.innerHTML += `<li>${genre}</li>`
  }  
  info_block.appendChild(tag_box)

  info_block.innerHTML += `<p>${movie.description}</p>`

  // Technical info table
  let table = document.createElement("table");
  table.innerHTML += `<tr><th>Réalisation</th><td>${movie.directors}</td></tr>`
  table.innerHTML += `<tr><th>Pays d'origine</th><td>${movie.countries}</td></tr>`
  table.innerHTML += `<tr><th>Date de sortie</th><td>${movie.date_published}</td></tr>`
  table.innerHTML += `<tr><th rowspan=100>Featuring</th><td>${movie.actors}</td></tr>`
  info_block.appendChild(table);

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
    this.title = movie_details.original_title;
    this.year = movie_details.year;
    if (movie_details.rated == 'Not rated or unkown rating'){
      this.rated = "Tous publics" // maybe just say it's unknown ?
    } else {
      this.rated = `Rated ${movie_details.rated}`
    }
    this.duration = movie_details.duration;
    this.genres = movie_details.genres;
    if (movie_details.long_description != "No long description provided"){
      this.description = movie_details.long_description;
    } else {
      this.description = movie_details.description;
    }
    this.directors = movie_details.directors;
    this.countries = movie_details.countries;
    this.date_published = movie_details.date_published;
    this.imdb_score = movie_details.imdb_score;
    if (this.imdb_score > 7) {
      this.score_color = "lightgreen";
    } else if (this.imdb_score > 4) {
      this.score_color = 'lightgoldenrodyellow';
    } else {
      this.score_color = 'lightpink';
    }
    this.votes = movie_details.votes;
    this.actors = movie_details.actors;
  }
}