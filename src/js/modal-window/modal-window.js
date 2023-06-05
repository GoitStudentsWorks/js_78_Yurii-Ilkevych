// ------------------Закриття та відкриття модалки---------------

const refs = {
  openModalBtn: document.querySelector('[data-modal-open-test]'),
  closeModalBtn: document.querySelector('[data-modal-close-test]'),
  modal: document.querySelector('[data-modal-test]'),
  backdrop: document.querySelector('.overlay'),
  modalWindow: document.querySelector('.pop-modal'),
};

refs.openModalBtn.addEventListener('click', () => {
  openModal();
});
refs.closeModalBtn.addEventListener('click', closeModal);
refs.backdrop.addEventListener('click', closeModal);
refs.modal.addEventListener('click', stopPropagation);
refs.modalWindow.addEventListener('click', stopPropagation);

export function openModal() {
  refs.modal.classList.remove('is-hidden');
  document.addEventListener('keydown', handleKeyPress);
  document.documentElement.style.overflow = 'hidden';
}

function closeModal() {
  refs.modal.classList.add('is-hidden');
  document.removeEventListener('keydown', handleKeyPress);
  document.documentElement.style.overflow = '';
}

function handleKeyPress(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

function stopPropagation(event) {
  event.stopPropagation();
}

// -------------------------API----------------------------
import axios from 'axios';

const movieID = 20;
const URL_KOV = `https://api.themoviedb.org/3/movie/${movieID}`;
const API_KEY_KOV = 'c8c2a74c43d87203307f2db942752251';
const imgBlock = document.querySelector('.container-all');
const movieBlock = document.querySelector('.container-item');

const addToLibraryButton = document.querySelector('.modal-add-btn');
const removeToLibraryButton = document.querySelector('.modal-remove-btn');

axios
  .get(`${URL_KOV}?api_key=${API_KEY_KOV}`)
  .then(response => {
    const movieData = response.data;
    const posterPath = movieData.poster_path;
    const movieTitle = movieData.title;
    const rating = Number(movieData.vote_average.toFixed(1));
    const votes = movieData.vote_count.toString().slice(0, 4);
    const popularity = Number(movieData.popularity.toFixed(1));
    const gerne = movieData.genres.map(genre => genre.name).join(' ');
    const overview = movieData.overview;

    const getImg = `<div class="container-img">
      <img class="img-pop-modal" src="https://image.tmdb.org/t/p/w500/${posterPath}" alt="film" />
    </div>`;

    imgBlock.insertAdjacentHTML('afterbegin', getImg);

    const getMovie = `<h2 class="name-film-pop-modal">${movieTitle}</h2>
      <div class="vote-votes-pop-modal-container">
        <p class="vote-votes-pop-modal-text">Vote / Votes</p>
        <div class="vote-data-container-pop-modal">
          <span class="vote-data-pop-modal">${rating}</span>
        </div>
        <div class="devider-data-pop-modal">/</div>
        <div class="votes-data-container-pop-modal">
          <span class="votes-data-pop-modal">${votes}</span>
        </div>
      </div>
      <div class="popularity-pop-modal-container">
        <p class="popularity-pop-modal-text">Popularity</p>
        <div class="popularity-data-pop-modal">${popularity}</div>
      </div>
      <div class="gerne-pop-modal-container">
        <p class="gerne-pop-modal-text">Genre</p>
        <div class="gerne-data-pop-modal">${gerne}</div>
      </div>
      <h2 class="about-pop-modal-text">About</h2>
      <div class="about-pop-modal-description">
        ${overview}
      </div>`;

    movieBlock.insertAdjacentHTML('afterbegin', getMovie);

    // -------------------------LOCAL STORAGE-----------------
    const movieObject = {
      movieID,
      posterPath,
      movieTitle,
      rating,
      votes,
      popularity,
      gerne,
      overview,
    };

    const existingMovies = JSON.parse(localStorage.getItem('movies')) || [];

    const movieIndex = existingMovies.findIndex(
      movie => movie.movieID === movieID
    );
    if (movieIndex > -1) {
      existingMovies.splice(movieIndex, 1);
    }

    addToLibraryButton.addEventListener('click', function () {
      const existingMovies = JSON.parse(localStorage.getItem('movies')) || [];
      const movieIndex = existingMovies.findIndex(
        movie => movie.movieID === movieID
      );

      if (movieIndex === -1) {
        existingMovies.push(movieObject);
        localStorage.setItem('movies', JSON.stringify(existingMovies));
        toggleButtons();
      }
    });

    removeToLibraryButton.addEventListener('click', function () {
      const existingMovies = JSON.parse(localStorage.getItem('movies')) || [];
      const updatedMovies = existingMovies.filter(
        movie => movie.movieID !== movieID
      );
      localStorage.setItem('movies', JSON.stringify(updatedMovies));
      toggleButtons();
    });
    toggleButtons();
  })
  .catch(error => {
    console.error(error);
  });

// -------------------------Заміна кнопки-----------------
function toggleButtons() {
  const existingMovies = JSON.parse(localStorage.getItem('movies')) || [];
  const movieIndex = existingMovies.findIndex(
    movie => movie.movieID === movieID
  );

  if (movieIndex > -1) {
    addToLibraryButton.style.display = 'none';
    removeToLibraryButton.style.display = 'block';
  } else {
    addToLibraryButton.style.display = 'block';
    removeToLibraryButton.style.display = 'none';
  }
}
