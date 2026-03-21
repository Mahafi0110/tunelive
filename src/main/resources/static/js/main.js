document.addEventListener('DOMContentLoaded', function () {

    // ===================== SIDEBAR + HAMBURGER =====================
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const menu = document.querySelector('.menu');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.classList.add('sidebar-overlay');
    document.body.appendChild(overlay);

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            // toggle sidebar
            if (sidebar) {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            }
            // toggle menu links
            if (menu) {
                menu.classList.toggle('active');
            }
        });
    }

    // Close sidebar + menu when overlay clicked
    overlay.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('active');
        if (menu) menu.classList.remove('active');
        overlay.classList.remove('active');
        document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
    });

    // ===================== DROPDOWN =====================
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const dropMenu = this.nextElementSibling;
            const isVisible = dropMenu.style.display === 'block';
            document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
            dropMenu.style.display = isVisible ? 'none' : 'block';
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        }
    });

    // ===================== FAQ TOGGLE =====================
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            if (!answer) return;
            document.querySelectorAll('.faq-answer').forEach(a => {
                if (a !== answer) a.style.display = 'none';
            });
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });

    // ===================== AUDIO PLAYER =====================
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const progress = document.getElementById('progress');
    const volume = document.getElementById('volume');
    const current = document.getElementById('current');
    const duration = document.getElementById('duration');

    function formatTime(time) {
        if (isNaN(time)) return '0:00';
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        return min + ':' + (sec < 10 ? '0' + sec : sec);
    }

    if (audio && playBtn) {

        // Play / Pause
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.classList.replace('fa-play', 'fa-pause');
            } else {
                audio.pause();
                playBtn.classList.replace('fa-pause', 'fa-play');
            }
        });

        // Update progress bar
        audio.addEventListener('timeupdate', () => {
            if (progress) {
                progress.value = (audio.currentTime / audio.duration) * 100;
            }
            if (current) current.textContent = formatTime(audio.currentTime);
            if (duration) duration.textContent = formatTime(audio.duration);
        });

        // Seek
        if (progress) {
            progress.addEventListener('input', () => {
                audio.currentTime = (progress.value / 100) * audio.duration;
            });
        }

        // Volume
        if (volume) {
            volume.addEventListener('input', () => {
                audio.volume = volume.value;
            });
        }
    }

});

// play songs
// ===================== AUDIO PLAYER =====================
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const volumeBtn = document.getElementById('volume');
const current = document.getElementById('current');
const duration = document.getElementById('duration');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerImg = document.getElementById('player-img');

const songs = [
    { src: '/songs/song1.mp3', title: 'Majili',     artist: 'Various Artists', img: '/images/song0.png' },
    { src: '/songs/song2.mp3', title: 'Barbad',     artist: 'Various Artists', img: '/images/song1.jpg' },
    { src: '/songs/song3.mp3', title: 'Tum Ho Tum', artist: 'Various Artists', img: '/images/song2.jpg' },
    { src: '/songs/song1.mp3', title: 'Dhun',       artist: 'Various Artists', img: '/images/song3.jpg' },
];

let currentIndex = 0;
let isPlaying = false;

function formatTime(time) {
    if (isNaN(time)) return '0:00';
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return min + ':' + (sec < 10 ? '0' + sec : sec);
}

function updatePlayBtn(playing) {
    if (!playBtn) return;
    if (playing) {
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
    } else {
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
    }
}

function playSong(src, title, artist, img) {
    if (!audio) return;

    const idx = songs.findIndex(s => s.src === src && s.title === title);
    if (idx !== -1) currentIndex = idx;

    audio.src = src;
    audio.load();
    audio.play().then(() => {
        isPlaying = true;
        updatePlayBtn(true);
    }).catch(err => {
        console.error('Play error:', err);
    });

    if (playerTitle) playerTitle.textContent = title;
    if (playerArtist) playerArtist.textContent = artist;
    if (playerImg) playerImg.src = img;
}

// Make playSong global so onclick in HTML works
window.playSong = playSong;

if (audio && playBtn) {

    // Play / Pause toggle
    playBtn.addEventListener('click', () => {
        if (!audio.src || audio.src === window.location.href) {
            // no song loaded yet — load first song
            playSong(songs[0].src, songs[0].title, songs[0].artist, songs[0].img);
            return;
        }

        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            updatePlayBtn(false);
        } else {
            audio.play();
            isPlaying = true;
            updatePlayBtn(true);
        }
    });

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + songs.length) % songs.length;
            const s = songs[currentIndex];
            playSong(s.src, s.title, s.artist, s.img);
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % songs.length;
            const s = songs[currentIndex];
            playSong(s.src, s.title, s.artist, s.img);
        });
    }

    // Auto play next when song ends
    audio.addEventListener('ended', () => {
        currentIndex = (currentIndex + 1) % songs.length;
        const s = songs[currentIndex];
        playSong(s.src, s.title, s.artist, s.img);
    });

    // Update progress bar
    audio.addEventListener('timeupdate', () => {
        if (progress && audio.duration) {
            progress.value = (audio.currentTime / audio.duration) * 100;
        }
        if (current) current.textContent = formatTime(audio.currentTime);
        if (duration) duration.textContent = formatTime(audio.duration);
    });

    // Seek
    if (progress) {
        progress.addEventListener('input', () => {
            audio.currentTime = (progress.value / 100) * audio.duration;
        });
    }

    // Volume
    if (volumeBtn) {
        volumeBtn.addEventListener('input', () => {
            audio.volume = volumeBtn.value;
        });
    }
}