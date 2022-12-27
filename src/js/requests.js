
export const getMovieDataByName = (key) => {
	return fetch(`http://www.omdbapi.com/?apikey=929e2fc7&type=movie&s=${key}`)
		.then((response) => response.json())
};


export const getMovieInfo = (id) => {
   return fetch(`http://www.omdbapi.com/?apikey=929e2fc7&type=movie&i=${id}`)
		.then((response) => response.json())
}
