const static_dir = "./static/audio/";
const json_file_audio = "./static/list_audio.json";
const audioElement = document.getElementById('player');
const playPauseButton = document.getElementById('player-toggle');
const nextButton = document.getElementById('player-toggle-next');
const shuffleButton = document.getElementById('player-toggle-shuffle');
const title_playing = document.getElementById('playing');

const jsmediatags = window.jsmediatags;

let songs = [];
let currentSongIndex = 0;

function togglePlayPause() {
    if (audioElement.paused) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
}

function fetchSongs() {
    fetch(json_file_audio)
        .then(response => response.json())
        .then(data => {
            songs = data;
            playSong();
        });
}

function playSong() {
    if (songs.length === 0) {
        console.error("No songs found in the JSON file");
        return;
    }
    const song = songs[currentSongIndex];
    audioElement.src = static_dir + song.filename;
    audioElement.load();
    togglePlayPause();
    title_playing.innerText = song.title;
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    playSong();
}

function shuffleSongs() {
    for (let i = songs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    currentSongIndex = 0;
    nextSong();
}

function displayArtwork(){
    jsmediatags.read(audioElement.src, {
        onSuccess: function(tag){
            const data =  tag.tags.picture.data;
            const format = tag.tags.picture.format;
            let base64String = '';

            for(let i =0; i<data.length; i++)
                base64String += String.fromCharCode(data[i]);

            document.body.style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
        }, onError: function(error){
            console.log(error);
        }
    });
}

fetchSongs();

nextButton.addEventListener('click', nextSong);
shuffleButton.addEventListener('click', shuffleSongs);
playPauseButton.addEventListener('click', togglePlayPause);

audioElement.addEventListener('play', () => {

});

audioElement.addEventListener('pause', () => {

});

audioElement.addEventListener('ended', () => {
    nextSong();
});

audioElement.addEventListener('loadedmetadata', displayArtwork);

