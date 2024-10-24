let mcuActors = [];

// Fetch MCU actors list with their movies from JSON file
fetch('mcu_actors.json')
    .then(response => response.json())
    .then(data => {
        mcuActors = data;
        console.log('MCU actors loaded:', mcuActors); // Confirm data load
    })
    .catch(error => console.error("Error loading MCU actors JSON:", error));

// Function to check movie for MCU actors with partial matching and links to TMDb profiles
async function checkMovie() {
    const inputTitle = document.getElementById('movieTitle').value.toLowerCase();
    const apiKey = '58916bfcd983c91b3a757c03dd7352d3';
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${inputTitle}`);
    
    if (!response.ok) {
        console.error("Error fetching movie data from TMDb:", response.status);
        document.getElementById('score').innerText = 'MCU Score: 0';
        document.getElementById('actorNames').innerText = 'No results found.';
        return;
    }
    
    const data = await response.json();
    console.log("Movie search results:", data);

    if (data.results.length > 0) {
        const bestMatch = data.results.find(movie => movie.title.toLowerCase().includes(inputTitle));
        
        if (bestMatch) {
            console.log("Best match found:", bestMatch);
            const movieId = bestMatch.id;
            const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
            const castData = await castResponse.json();
            console.log("Cast data:", castData);

            const mcuActorsInMovie = castData.cast
                .filter(actor => mcuActors.some(mcuActor => mcuActor.name === actor.name))
                .map(actor => {
                    const mcuActorData = mcuActors.find(mcuActor => mcuActor.name === actor.name);
                    const moviesList = mcuActorData.movies.join(', ');
                    return `<a href="https://www.themoviedb.org/person/${actor.id}" target="_blank">${actor.name}</a> - MCU Movies: ${moviesList}`;
                });

            // Update the scoreboard and actor names
            document.getElementById('score').innerHTML = `MCU Score: ${mcuActorsInMovie.length}`;

            if (mcuActorsInMovie.length > 0) {
                document.getElementById('actorNames').innerHTML = mcuActorsInMovie.join('<br>');
            } else {
                document.getElementById('actorNames').innerHTML = 'No MCU actors found in this movie.';
            }
        } else {
            document.getElementById('score').innerText = 'MCU Score: 0';
            document.getElementById('actorNames').innerText = 'No matching movie found.';
        }
    } else {
        document.getElementById('score').innerText = 'MCU Score: 0';
        document.getElementById('actorNames').innerText = 'No results found.';
    }
}
