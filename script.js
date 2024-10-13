let mcuActors = [];

// Fetch MCU actors list from JSON file
fetch('mcu_actors.json')
    .then(response => response.json())
    .then(data => {
        mcuActors = data;
    });

async function checkMovie() {
    const title = document.getElementById('movieTitle').value;
    const apiKey = 58916bfcd983c91b3a757c03dd7352d3;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`);
    const data = await response.json();

    if (data.results.length > 0) {
        const movieId = data.results[0].id;
        const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
        const castData = await castResponse.json();
        const movieCast = castData.cast.map(actor => actor.name);
        const mcuActorsInMovie = movieCast.filter(actor => mcuActors.includes(actor));
        document.getElementById('result').innerHTML = `MCU Actors Found: ${mcuActorsInMovie.length}<br>${mcuActorsInMovie.join(', ')}`;
    } else {
        document.getElementById('result').innerText = 'Movie not found.';
    }
}
