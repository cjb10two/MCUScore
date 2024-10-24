let mcuActors = [];

// Fetch MCU actors list from JSON file
fetch('mcu_actors.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        mcuActors = data;
        console.log('MCU actors loaded:', mcuActors);  // Log the loaded MCU actors data
    })
    .catch(error => {
        console.error('Error loading MCU actors JSON:', error);
        document.getElementById('result').innerText = 'Error loading MCU actors data.';
    });

// Function to check movie for MCU actors with partial matching and links to TMDb profiles
async function checkMovie() {
    const inputTitle = document.getElementById('movieTitle').value.toLowerCase();
    const apiKey = '58916bfcd983c91b3a757c03dd7352d3';  // Your TMDb API key

    // Fetch movie data from TMDb
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${inputTitle}`);
        if (!response.ok) {
            throw new Error(`Error fetching movie data from TMDb: ${response.status}`);
        }

        const data = await response.json();
        console.log("Movie search results:", data);  // Log the movie search results

        if (data.results.length > 0) {
            const bestMatch = data.results[0];  // Just take the first result for simplicity
            console.log("Best match movie:", bestMatch);  // Log the best match movie

            // Fetch cast data for the best match movie
            const movieId = bestMatch.id;
            const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
            const castData = await castResponse.json();
            console.log("Cast data:", castData);  // Log the cast data

            // Find MCU actors in the movie
            const mcuActorsInMovie = castData.cast
                .filter(actor => mcuActors.some(mcuActor => mcuActor.name === actor.name))
                .map(actor => {
                    const mcuActorData = mcuActors.find(mcuActor => mcuActor.name === actor.name);
                    const moviesList = mcuActorData ? mcuActorData.movies.join(', ') : '';
                    return `<a href="https://www.themoviedb.org/person/${actor.id}" target="_blank">${actor.name}</a> - MCU Movies: ${moviesList}`;
                });

            console.log("MCU Actors in the movie:", mcuActorsInMovie);  // Log the matched MCU actors

            // Update the result on the page
            document.getElementById('result').innerHTML = `MCU Score: ${mcuActorsInMovie.length}<br>${mcuActorsInMovie.join('<br>')}`;
        } else {
            document.getElementById('result').innerText = 'No matching movie found.';
        }
    } catch (error) {
        console.error("Error during movie lookup:", error);
        document.getElementById('result').innerText = 'Error fetching movie or cast data.';
    }
}
