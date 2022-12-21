import { getMovieDataByName, getMovieInfo } from './requests.js';

class MovieApp {
	constructor() {
		this.elements = {};
		this.initApp();
	}

	initApp = () => {
		this.connectDOM();
		this.setupListeners();
	};

	connectDOM = () => {
		const elements = Array.from(document.querySelectorAll('[data-bind-js]'));

		for (const element of elements) {
			this.elements[element.classList[0].replace('-', '_')] = element;
		}
	};

	setupListeners = () => {
		this.elements.search_btn.addEventListener('click', this.searchForMovies);
		this.elements.search_input.addEventListener('keydown', this.searchForMovies)
	};

	searchForMovies = (input) => {
		if (event.type === 'click' || event.key === 'Enter') {
			input = this.elements.search_input.value;
			getMovieDataByName(input).then(data => this.renderCards(data));
		}
	};

	renderCards = (data) => {
		// console.log(data.Search);
		for (const item of data.Search) {
			this.createMovieCard(item)
		}
	}

	createMovieCard = (item) => {
		// console.log(item);

		let title = item.Title
		let poster = item.Poster

		if (title.length > 60) {
			title = item.Title.substring(0, 60) + '...'
		} else {
			title = item.Title
		}
		if (poster == "N/A") {
			poster = 'https://via.placeholder.com/210x295'
		} else {
			poster = item.Poster
		}


		const divCard = this.createDOMElem('div', 'movie-card');
		const heading = this.createDOMElem('h3', null, title)
		const paragraph = this.createDOMElem('p', null, item.Year)
		const icon = this.createDOMElem('i', 'fa-regular fa-heart')
		const shadow = this.createDOMElem('div', 'shadow')


		shadow.append(heading, paragraph)

		divCard.append(icon, shadow)
		divCard.dataset.id = item.imdbID
		divCard.style.backgroundImage = `url(${poster})`

		this.elements.title_box.innerHTML = ''
		this.elements.movie_box.append(divCard)

		divCard.addEventListener('click', this.openMovieSecondView)

	}

	createDOMElem = (tagName, className, textContent, src) => {
		const tag = document.createElement(tagName)
		tag.classList = className

		if (textContent) {
			tag.textContent = textContent
		}
		if (src) {
			tag.src = src
		}
		return tag
	}


	openMovieSecondView = (event) => {
		let movieId
		if (event.target.dataset.id) {
			movieId = event.target.dataset.id
		} else if (!event.target.dataset.id && !event.target.classList.contains('fa-heart')){
			movieId = event.target.closest('.movie-card').dataset.id;
		}

		getMovieInfo(movieId).then(info => {
			console.log(info.Ratings);

			// <div class="movie-details-box">
			// 	<img src="" alt="">
			// 	<div class="details">
			// 		<h2>title title title</h2>
			// 		<p>Lorem ipsum dolor sit.</p>
			// 		<p>Lorem ipsum dolor sit.</p>
			// 		<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt a delectus cum repudiandae. Dignissimos sapiente nemo vero quam voluptas aperiam?</p>
			// 		<i class="fa-solid fa-heart"></i>
			// 	</div>
			// </div>

			const detailsDiv = this.createDOMElem('div', "movie-details-box")
			const img = this.createDOMElem('img', null, null, info.Poster)
			const detailsText = this.createDOMElem('div', 'details')
			const title = this.createDOMElem('h2', null, info.Title)
			const year = this.createDOMElem('p', null, `Year: ${info.Year}`)
			const actors = this.createDOMElem('p', null, `Actors: ${info.Actors}`)
			const genres = this.createDOMElem('p', null, `Genres: ${info.Genre}`)
			const director = this.createDOMElem('p', null, `Director: ${info.Director}`)
			const runtime = this.createDOMElem('p', null, `Runtime: ${info.Runtime}`)
			const country = this.createDOMElem('p', null, `Country: ${info.Country}`)
			const infoText = this.createDOMElem('p', 'info-text', `${info.Plot}`)


			detailsText.append(title, year, actors, genres, director, runtime, country, infoText)
			detailsDiv.append(img, detailsText)

			detailsDiv.style.display = "flex"
			this.elements.movie_box.append(detailsDiv)



		})

	}

}

document.addEventListener('DOMContentLoaded', new MovieApp());
