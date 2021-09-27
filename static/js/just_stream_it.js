const movies_per_page = 7;
const api_url = "http://localhost:8000/api/v1/titles/";
const page_size = '&page_size=7';
const url_dico = [
  {id: 'best_movies', url: api_url + "?sort_by=-imdb_score" + page_size},
  {id: 'cat1', url: api_url + "?sort_by=-imdb_score&country=Cuba" + page_size},
  {id: "cat2", url: api_url + "?genre=horror&sort_by=-votes" + page_size},
  {id: "cat3", url: api_url + "?imdb_score_min=8&sort_by=votes" + page_size}
];
init_page();

/**
 * Initialize page data
 * @param None
 * @return None
 */
async function init_page(){
  for (carousel of url_dico){
    let carousel_id = carousel["id"]
    let endpoint = carousel["url"]
    let json = await get_json_from_api(endpoint);
    // TODO: Create carousel here. Add titles and nav_anchors to url_dico
    update_carousel(carousel_id, json);

    if (carousel_id == "best_movies"){
      let best_movie_id = json.results[0].id
      let best_movie_json = await get_json_from_api(api_url + best_movie_id)
      update_best_movie(best_movie_json)
    }
  }
}

// CAROUSEL-RELATED FUNCTIONS 

// connecting to the api
async function get_json_from_api(url) {
  let api_data = await fetch(url)
  let json = await api_data.json()
  return json;
}

function update_best_movie(best_movie_json){
  let featured_box = document.getElementById('featuredMovie')
  // featured_box.setAttribute("background-image", `url(${best_movie_json.image_url})`);

  let title = featured_box.childNodes[1].childNodes[1];
  title.innerHTML = best_movie_json.title
  let play_button = title.nextElementSibling;
  play_button.onclick = function() { open_details(best_movie_json.id); }
  
  let featured_cover = featured_box.childNodes[3];
  // console.log(featured_cover);
  featured_cover.src = best_movie_json.image_url;
}

/**
 * Update content of a carousel box element
 * @param {String} carousel_id id of an carousel element
 * @param {json} json json file
 * @return None
 */
function update_carousel(carousel_id, json){
  carousel = document.getElementById(`${carousel_id}`)
  list_of_movies = json.results
  
  let button_previous = carousel.querySelector(".switchLeft");
  if (json.previous != null){
    button_previous.style.visibility = "visible";
    get_json_from_api(json.previous).then(json_previous => {
      button_previous.onclick = function() { update_carousel(carousel_id, json_previous);  }; 
    })
  } else {
    button_previous.style.visibility = "hidden";
  }

  let button_next = carousel.querySelector(".switchRight");
  if (json.next != null){
    button_next.style.visibility = "visible";
    get_json_from_api(json.next).then(json_next => {
      button_next.onclick = function() { update_carousel(carousel_id, json_next);  }; 
    })
  } else {
    button_next.style.visibility = "hidden";
  }

  // update cover boxes  
  let cover_box = carousel.querySelector(".carouselBox");
  cover_box.innerHTML = "";

  let index = 0;
  for (pic_index in list_of_movies){
      index ++;
      let movie = list_of_movies[pic_index]
      let movie_id = movie.id;
      let cover; 
      if (movie.image_url != null){
        cover = movie.image_url;
      } else {
        cover = "./static/img/default_cover.jpg";
      }
      let title = movie.title;
      cover_box.insertAdjacentHTML(
        "beforeend",
        `<img class="img-${index}" slider-img" src="${cover}" alt="${title}" onclick="open_details(${movie_id});" />`
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
  cover.src = movie.cover_url
  cover.alt = movie.title
  modal_content.appendChild(cover)

  let info_block = document.createElement('p');

  let title = document.createElement('h1');
  title.innerText = `${movie.title}`
  info_block.appendChild(title)
  
  let primary_infos = document.createElement("h2")
  primary_infos.innerText = `${movie.year} - ${movie.rated} - ${movie.duration/60>>0}h${movie.duration % 60}min`;
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
  table.innerHTML += `<tr><th>Date de sortie</th><td>${movie.date_published}</td></tr>`
  table.innerHTML += `<tr><th>Pays d'origine</th><td>${movie.countries}</td></tr>`
  table.innerHTML += `<tr><th>Box office</th><td>${movie.box_office}</td></tr>`  
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
    if (movie_details.worldwide_gross_income != null){
      this.box_office = movie_details.worldwide_gross_income;
    } else {
      this.box_office = "Not Available";
    }
    this.cover_url = movie_details.image_url
  }
}