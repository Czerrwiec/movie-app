
export const getMovieDataByName = (key) => {
	return fetch(`http://www.omdbapi.com/?apikey=929e2fc7&type=movie&s=${key}`)
		.then((response) => response.json())
};


export const getMovieInfo = (id) => {
   return fetch(`http://www.omdbapi.com/?apikey=929e2fc7&type=movie&i=${id}`)
		.then((response) => response.json())
}


// const getMovieImg = () => {
// 	return fetch('http://img.omdbapi.com/?apikey=929e2fc7&i=tt1772240')
// 		// .then((response) => response.json())
// 		.then((response) => (image.src = response.url));
// 	// .catch((err) => console.error(err));
// };
