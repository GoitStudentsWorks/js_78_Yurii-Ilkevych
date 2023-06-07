import axios from 'axios';
import { refsList } from '../list-movie-block/list-movie-block';
import { createMarkup } from '../list-movie-block/list-movie-block';
import { renderMarkup } from '../list-movie-block/list-movie-block';
import { createPagination } from '../pagination-block/pagination-block';
const refs = {
    searchStringBlockForm: document.querySelector('.search-string-block-form'),
};

const API_KEY_V = '48b2bba5f96af80717b061a99685cb65';
let value = '';
let page = 1;

const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OGIyYmJhNWY5NmFmODA3MTdiMDYxYTk5Njg1Y2I2NSIsInN1YiI6IjY0NzlhNDgyY2Y0YjhiMDBlMmQ0ZmIwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RiB7cy2sepUia0enSXt_-ZtvZFAJrXAbSEnOnpP1tyo'
    }
};

document.addEventListener('DOMContentLoaded', onLoadTrends);

export async function onLoadTrends() {
    try {
        const resp = await fetchTrends(page);
        const genres = await genreFetch(page);

        if (resp.length === 0) {
            refsList.listMovieBlockOops.textContent = 'Sorry, we did not find any movies.'
        }
        addDisplayNone();
        const markup = createMarkup(resp.data.results, genres);


        createPagination(resp.data.total_pages, resp.data.page, "fetchTrends")
        renderMarkup(markup);
    } catch (error ) {
        console.log(error);
    }
}



refs.searchStringBlockForm.addEventListener('submit', onSearchSubmit);

  function onSearchSubmit(e) {
    e.preventDefault();
    value = e.target[0].value.trim();
    onClearInput();

    refsList.listMovieBlockList.innerHTML = '';

    if(value === '') {
        refsList.listMovieBlockOops.textContent = 'You have not entered search text.';   
    } 
    callFetchFilmByValue()
};

export async function callFetchFilmByValue(){
    try {
        const genres = await genreFetch(page);
        const resp = await fetchFilmByValue(value, page);

        if (resp.data.results.length === 0) {
            removeDisplayNone();
        } else if (resp.data.results.length >= 1)
        addDisplayNone();
        const markup = createMarkup(resp.data.results, genres);

        createPagination(resp.data.total_pages, resp.data.page, "fetchFilmByValue")
        renderMarkup(markup);
    } catch (error) {
        console.log(error);
    }
}



async function fetchTrends(page) {
    const response = await axios.get(
        `https://api.themoviedb.org/3/trending/all/week?language=en-US&api_key=${API_KEY_V}&page=${page}`,
    options
    );
    return response;
    
}

export async function genreFetch(page) {
    const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${API_KEY_V}&page=${page}`,
    options
    );
    const genres = response.data.genres;
    return genres;
}




async function fetchFilmByValue(value, page) {
    const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${value}&include_adult=true&language=en-US&page=${page}&api_key=${API_KEY_V}`,
    options
    );
    return response;
}



function onClearInput() {
    refs.searchStringBlockForm.reset();
    page = 1
};

function removeDisplayNone() {
    refsList.listMovieBlockOops.classList.remove('display-none');
};

function addDisplayNone() {
    refsList.listMovieBlockOops.classList.add('display-none');
};


export function countPage(newPage){
page = newPage
}
