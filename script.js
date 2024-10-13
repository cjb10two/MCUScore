let mcuActors = [];

// Fetch MCU actors list from JSON file
fetch('mcu_actors.json')
    .then(response => response.json())
    .then(data => {
        mcuActors = data;
        console.log('MCU actors loaded:', mcuActors); // Confirm data load
    });

// Function to check movie for MCU actors with partial matching
async function checkMovie() {
    const title = document.getElementById('movieTitle').value.toLowerCase();
    const apiKey = '58916bfcd983c91b3a757c03dd7352d3';
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`);
    const data = await response.json();

    if (data.results.length > 0) {
        // Find the closest match based on title, allowing partial matches
        const bestMatch = data.results.find(movie => movie.title.toLowerCase().includes(title));

        if (bestMatch) {
            const movieId = bestMatch.id;
            const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
            const castData = await castResponse.json();
            
            const movieCast = castData.cast.map(actor => actor.name);
            const mcuActorsInMovie = movieCast.filter(actor => mcuActors.includes(actor));
            
            document.getElementById('result').innerHTML = `MCU Actors Found: ${mcuActorsInMovie.length}<br>${mcuActorsInMovie.join(', ')}`;
        } else {
            document.getElementById('result').innerText = 'No matching movie found.';
        }
    } else {
        document.getElementById('result').innerText = 'No results found.';
    }
}
