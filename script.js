let mcuActors = [];

// Fetch MCU actors list from JSON file
fetch('mcu_actors.json')
    .then(response => response.json())
    .then(data => {
        mcuActors = data;
        console.log('MCU actors loaded:', mcuActors); // Confirm data load
    })
    .catch(error => console.error('Error loading MCU actors JSON:', error));

// Function to check movie for MCU actors with partial matching and links to TMDb profiles
async function checkMovie() {
    const inputTitle = document.getElementById('movieTitle').value.toLowerCase();
    const apiKey = '58916bfcd983c91b3a757c03dd7352d3';  // Your TMDb API key
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${inputTitle}`);
    
    if (!response.ok) {
        console.error("Error fetching movie data from TMDb:", response.status);
        document.getElementById('result').innerText = 'Error fetching movie data.';
        return;
    }
    
    const data = await response.json();

    if (data.results.length > 0) {
        const bestMatch = data.results[0]; // Just take the first result for simplicity

        const movieId = bestMatch.id;
        const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
        const castData = await castResponse.json();

        const mcuActorsInMovie = castData.cast
            .filter(actor => mcuActors.some(mcuActor => mcuActor.name === actor.name))
            .map(actor => {
                const mcuActorData = mcuActors.find(mcuActor => mcuActor.name === actor.name);
                const moviesList = mcuActorData.movies.join(', ');
                return `<a href="https://www.themoviedb.org/person/${actor.id}" target="_blank">${actor.name}</a> - MCU Movies: ${moviesList}`;
            });

        document.getElementById('result').innerHTML = `MCU Score: ${mcuActorsInMovie.length}<br>${mcuActorsInMovie.join('<br>')}`;
    } else {
        document.getElementById('result').innerText = 'No matching movie found.';
    }
}
