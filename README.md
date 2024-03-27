# movie-tv-tracker

A movie tracker with user authentication and enrypted passwords, and posting to mongodb with mongoose to keep track of a users favorites list.

# Used

Used the TMDB api to genete the list of movies with search, and Stored the Movie ID in an array attatched to my user, called favorites. I then use the Movie ID taken from that specific users favorites and does an API call for each movie in the array to regenerate the data such as description and title. Used JSW for and Bcrypt for user authentication and tracking across the site for different views.

# Instructions

Start the server for client, then start the server for the server then connect to http://localhost:5173/. Either register, or sign in, and after search for movies and add or remove from your favorites list fromm the favorites page that gets rendered from the navbar.

# Limitations

Local host only
