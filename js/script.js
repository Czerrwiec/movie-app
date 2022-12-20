
const getMovieData = () => {
	fetch('http://www.omdbapi.com/?apikey=929e2fc7&type=movie&s=The Lost City')
		.then((response) => response.json())
		.then((response) => console.log(response
            ))
		.catch((err) => console.error(err));
};


const getMovieById = () => {
    fetch('http://www.omdbapi.com/?apikey=929e2fc7&type=movie&i=tt13320622')
		.then((response) => response.json())
		.then((response) => console.log(response))
		.catch((err) => console.error(err));
}


const getMovieImg = () => {
	fetch('http://img.omdbapi.com/?apikey=929e2fc7&i=tt1877830')
		// .then((response) => response.json())
		.then((response) => (image.src = response.url));
	// .catch((err) => console.error(err));
};

getMovieData()
getMovieById()
