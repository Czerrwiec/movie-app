import { getMovieDataByName, getMovieInfo } from './requests.js';

class MovieApp {
	constructor() {
		this.elements = {};
		this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
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
		this.elements.search_input.addEventListener(
			'keydown',
			this.searchForMovies
		)
		this.elements.movie_box.addEventListener('click', this.addToFavorites);
		this.elements.fav_btn.addEventListener('click', this.renderFavorites);

	};

	searchForMovies = (input) => {
		if (event.type === 'click' || event.key === 'Enter') {
			input = this.elements.search_input.value;
			this.elements.movie_box.innerHTML = '';
			getMovieDataByName(input).then((data) => this.renderCards(data));
			this.elements.search_input.value = '';
		}
	};

	renderCards = (data) => {
		for (const item of data.Search) {
			this.createMovieCard(item);
		}
	};

	addToFavorites = (e) => {
		let id

		if (e.target.dataset.id !== undefined) {
			id = e.target.dataset.id
		} else {
			try {
				id = e.target.closest('.movie-card').dataset.id
			} catch (e) {
				id = null
			}
		}

		if (e.target.classList.contains('fa-regular')) {
			e.target.classList.remove('fa-regular');
			e.target.classList.add('fa-solid');
			e.target.style.display = 'block';
			this.favorites.push(id);
		} else if (e.target.classList.contains('fa-solid')) {
			e.target.classList.remove('fa-solid');
			e.target.classList.add('fa-regular');
			e.target.style.display = '';
			for (let i = 0; i < this.favorites.length; i++) {
				if (this.favorites[i] === id) {
					this.favorites.splice(i, 1);
				}
			}
		}
		localStorage.setItem('favorites', JSON.stringify(this.favorites));
	};

	renderFavorites = (id) => {
		this.elements.movie_box.innerHTML = '';
		id = this.favorites;

		id.forEach((item) => {
			getMovieInfo(item).then((info) => {
				this.createMovieCard(info);
			});
		});
	};

	createMovieCard = (item) => {
		let title = item.Title;
		let poster = item.Poster;
		let iconClass = 'fa-regular fa-heart';

		if (this.favorites.includes(item.imdbID)) iconClass = 'fa-solid fa-heart';
		if (title.length > 60) title = item.Title.substring(0, 60) + '...';
		if (poster == 'N/A') poster = 'https://via.placeholder.com/210x295';

		const divCard = this.createDOMElem('div', 'movie-card');
		const heading = this.createDOMElem('h3', null, title);
		const paragraph = this.createDOMElem('p', null, item.Year);
		const icon = this.createDOMElem('i', iconClass);
		const shadow = this.createDOMElem('div', 'shadow');

		if (icon.classList.contains('fa-solid')) icon.style.display = 'block';

		shadow.append(heading, paragraph);
		divCard.append(icon, shadow);
		divCard.dataset.id = item.imdbID;
		divCard.style.backgroundImage = `url(${poster})`;

		this.elements.title_box.innerHTML = '';
		this.elements.movie_box.append(divCard);

		divCard.addEventListener('click', this.openMovieSecondView);
	};

	createDOMElem = (tagName, className, textContent, src) => {
		const tag = document.createElement(tagName);
		tag.classList = className;

		if (textContent) {
			tag.textContent = textContent;
		}
		if (src) {
			tag.src = src;
		}
		return tag;
	};

	openMovieSecondView = (event) => {
		let movieId;

		if (event.target.dataset.id) {
			movieId = event.target.dataset.id;
		} else if (
			!event.target.dataset.id &&
			!event.target.classList.contains('fa-heart')
		) {
			movieId = event.target.closest('.movie-card').dataset.id;
		}

		getMovieInfo(movieId).then((info) => {
			let imdbRating;
			let rtRating;
			let metaRating;
			let posterImage = info.Poster;
			let iconClass = 'fa-regular fa-heart';

			if (this.favorites.includes(info.imdbID)) iconClass = 'fa-solid fa-heart';

			try {
				imdbRating = info.Ratings[0].Value;
			} catch (e) {
				imdbRating = 'no rating';
			}
			try {
				rtRating = info.Ratings[1].Value;
			} catch (e) {
				rtRating = 'no rating';
			}
			try {
				metaRating = info.Ratings[2].Value;
			} catch (e) {
				metaRating = 'no rating';
			}

			if (posterImage == 'N/A')
				posterImage = 'https://via.placeholder.com/350x550';

			const detailsDiv = this.createDOMElem('div', 'movie-details-box');
			const img = this.createDOMElem('img', 'poster', null, posterImage);
			const detailsText = this.createDOMElem('div', 'details');
			const title = this.createDOMElem('h2', null, info.Title);
			const year = this.createDOMElem('p', null, `Year: ${info.Year}`);
			const actors = this.createDOMElem('p', null, `Actors: ${info.Actors}`);
			const genres = this.createDOMElem('p', null, `Genres: ${info.Genre}`);
			const director = this.createDOMElem(
				'p',
				null,
				`Director: ${info.Director}`
			);
			const runtime = this.createDOMElem('p', null, `Runtime: ${info.Runtime}`);
			const country = this.createDOMElem('p', null, `Country: ${info.Country}`);
			const infoText = this.createDOMElem('p', 'info-text', `${info.Plot}`);
			const ratingDetailsDiv = this.createDOMElem('div', 'rating-details');
			const closeBtn = this.createDOMElem('button', 'details-btn', 'close');
			const icon = this.createDOMElem('i', iconClass);

			const ratingBoxDivOne = this.createDOMElem('div', 'rating-box');
			const ratingImgOne = this.createDOMElem('img', null, null, '/dist/img/imdb2.png');
			const ratingParagraphOne = this.createDOMElem('p', 'rating', imdbRating);

			const ratingBoxDivTwo = this.createDOMElem('div', 'rating-box');
			const ratingImgTwo = this.createDOMElem('img', null, null, '/dist/img/RTlogo.png');
			const ratingParagraphTwo = this.createDOMElem('p', 'rating', rtRating);

			const ratingBoxDivThree = this.createDOMElem('div', 'rating-box');
			const ratingImgThree = this.createDOMElem('img', null, null, '/dist/img/metacriticLogo.png');
			const ratingParagraphThree = this.createDOMElem('p', 'rating', metaRating);
			

			ratingBoxDivOne.append(ratingImgOne, ratingParagraphOne);
			ratingBoxDivTwo.append(ratingImgTwo, ratingParagraphTwo);
			ratingBoxDivThree.append(ratingImgThree, ratingParagraphThree);

			ratingDetailsDiv.append(
				ratingBoxDivOne,
				ratingBoxDivTwo,
				ratingBoxDivThree
			);

			detailsText.append(
				title,
				year,
				actors,
				genres,
				director,
				runtime,
				country,
				infoText,
				ratingDetailsDiv,
				closeBtn,
				icon
			);
			detailsDiv.append(img, detailsText);

			detailsDiv.style.display = 'flex';
			icon.dataset.id = info.imdbID
			this.elements.movie_box.append(detailsDiv);
			this.elements.overlay.style.display = 'block';
			document.body.style.overflow = 'hidden';

			const viewCloseBtn = document.querySelector('.details-btn');
			viewCloseBtn.addEventListener('click', () => {
				this.elements.movie_box.removeChild(this.elements.movie_box.lastChild);
				this.elements.overlay.style.display = 'none';
				document.body.style.overflow = '';
			});
			document.querySelector('.fa-heart').addEventListener('click', this.addToFavorites)
		})
	};
}

document.addEventListener('DOMContentLoaded', new MovieApp());
