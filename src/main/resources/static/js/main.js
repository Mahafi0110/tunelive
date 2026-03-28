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
// form validation

    const emailInput = document.querySelector('input[name="email"]');
    const cardInput = document.querySelector('input[name="cardNumber"]');
    const nameInput = document.querySelector('input[name="name"]');
    const expiryInput = document.querySelector('input[name="expiry"]');
    const cvvInput = document.querySelector('input[name="cvv"]');
    const form = document.querySelector('form');
// ✅ Only run if payment form exists on this page
if (cardInput && cvvInput && expiryInput && nameInput && emailInput && form) {
    // ✅ Card number — numbers only, auto add space every 4 digits
    cardInput.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, ''); // remove non-digits
        value = value.match(/.{1,4}/g)?.join(' ') || value; // add space every 4
        this.value = value;
    });

    // ✅ CVV — numbers only, max 3 digits
    cvvInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 3);
    });

    // ✅ Expiry — auto format MM/YY, numbers only
    expiryInput.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        this.value = value;
    });

    // ✅ Name — alphabets only
    nameInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
    });

    // ✅ Form submit validation
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let valid = true;
        let errorMsg = '';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            valid = false;
            errorMsg += '❌ Please enter a valid email address.\n';
        }

        // Card number — must be 16 digits
        const cardDigits = cardInput.value.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardDigits)) {
            valid = false;
            errorMsg += '❌ Card number must be 16 digits.\n';
        }

        // Name — must not be empty
        if (nameInput.value.trim() === '') {
            valid = false;
            errorMsg += '❌ Card holder name is required.\n';
        }

        // Expiry — must be MM/YY format
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value.trim())) {
            valid = false;
            errorMsg += '❌ Expiry date must be in MM/YY format.\n';
        }

        // CVV — must be 3 digits
        if (!/^\d{3}$/.test(cvvInput.value.trim())) {
            valid = false;
            errorMsg += '❌ CVV must be 3 digits.\n';
        }

        if (!valid) {
            alert(errorMsg);
            return;
        }

        // ✅ All valid — submit form
        form.submit();
    });
}
// ===================== HEART / LIKE TOGGLE =====================
// ===================== HEART / LIKE TOGGLE =====================
document.querySelectorAll('.song-row .fa-heart').forEach(heart => {
    heart.style.cursor = 'pointer';
    heart.addEventListener('click', function (e) {
        e.stopPropagation();

        const row = this.closest('.song-row');
        const title = row.querySelectorAll('span')[1]?.textContent || 'Unknown';
        const artist = row.querySelectorAll('span')[2]?.textContent || 'Unknown';
        const duration = row.querySelectorAll('span')[3]?.textContent || '5:00';

        const song = {
            src: '/songs/song1.mp3',
            title: title,
            artist: artist,
            duration: duration,
            img: '/images/song0.png'
        };

        let liked = JSON.parse(localStorage.getItem('likedSongs') || '[]');

        const exists = liked.findIndex(s => s.title === title);

        if (exists === -1) {
            // ✅ Add to liked
            liked.push(song);
            this.classList.remove('fa-regular');
            this.classList.add('fa-solid');
            this.style.color = '#FF0067';
        } else {
            // ✅ Remove from liked
            liked.splice(exists, 1);
            this.classList.remove('fa-solid');
            this.classList.add('fa-regular');
            this.style.color = '';
        }

        localStorage.setItem('likedSongs', JSON.stringify(liked));
    });
});
// ===================== GEAR ICON =====================
document.querySelectorAll('.fa-gear').forEach(gear => {
    gear.style.cursor = 'pointer';
    gear.addEventListener('click', function (e) {
        e.stopPropagation();
        alert('Settings coming soon!');
    });
});

// ===================== ALBUM CARDS CLICKABLE =====================
document.querySelectorAll('.card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
        const songs = [
            { src: '/songs/song1.mp3', title: 'Latest Hindi Songs', artist: 'Various Artists', img: this.querySelector('img')?.src || '/images/song0.png' },
        ];
        playSong(songs[0].src, songs[0].title, songs[0].artist, songs[0].img);
    });
});

// ===================== PROFILE BUTTONS =====================
// Edit Profile
const editBtn = document.querySelector('.btn-group button:first-child');
if (editBtn && editBtn.textContent.trim() === 'Edit Profile') {
    editBtn.style.background = '#FF0067';
    editBtn.style.color = '#fff';
    editBtn.style.cursor = 'pointer';
    editBtn.addEventListener('click', function () {
        const name = prompt('Enter new name:');
        if (name && name.trim() !== '') {
            const nameEl = document.querySelector('.value');
            if (nameEl) nameEl.textContent = name;
            alert('✅ Profile updated!');
        }
    });
}

// Change Password
document.querySelectorAll('.btn-group button').forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.style.background = '#FF0067';
    btn.style.color = '#fff';

    if (btn.textContent.trim() === 'Change Password') {
        btn.addEventListener('click', function () {
            const oldPass = prompt('Enter current password:');
            if (!oldPass) return;
            const newPass = prompt('Enter new password:');
            if (!newPass) return;
            const confirmPass = prompt('Confirm new password:');
            if (newPass !== confirmPass) {
                alert('❌ Passwords do not match!');
                return;
            }
            alert('✅ Password changed successfully!');
        });
    }

    if (btn.textContent.trim() === 'Manage') {
        btn.addEventListener('click', function () {
            alert('Manage feature coming soon!');
        });
    }

    if (btn.textContent.trim() === 'Payment') {
        btn.addEventListener('click', function () {
            window.location.href = '/plans';
        });
    }

    if (btn.textContent.trim() === 'Add') {
        btn.addEventListener('click', function () {
            alert('Add device feature coming soon!');
        });
    }
});

// ===================== SETTINGS TOGGLES =====================
document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.style.cursor = 'pointer';
    let isOn = false;
    toggle.addEventListener('click', function () {
        isOn = !isOn;
        this.style.background = isOn ? '#FF0067' : '#ccc';
        this.style.transition = 'background 0.3s';
        this.style.setProperty('--pos', isOn ? '20px' : '1px');

        // Move the circle
        const after = document.createElement('style');
        after.textContent = '';
        if (isOn) {
            this.style.cssText += 'background:#FF0067;';
            this.querySelector
            // manually move toggle dot
            this.setAttribute('data-on', 'true');
        } else {
            this.style.cssText += 'background:#ccc;';
            this.setAttribute('data-on', 'false');
        }
    });
});

// ===================== SOCIAL ICONS =====================
document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', function () {
        if (this.classList.contains('fa-youtube')) window.open('https://youtube.com', '_blank');
        else if (this.classList.contains('fa-instagram')) window.open('https://instagram.com', '_blank');
        else if (this.classList.contains('fa-linkedin')) window.open('https://linkedin.com', '_blank');
        else if (this.classList.contains('fa-facebook')) window.open('https://facebook.com', '_blank');
    });
});

// ===================== PLAYLIST BUTTON =====================
const playlistBtn = document.querySelector('.playlist-btn');
if (playlistBtn) {
    playlistBtn.addEventListener('click', function () {
        alert('Playlist feature coming soon!');
    });
}
// ===================== MUSIC LANGUAGE SELECTION =====================
const updateBtn = document.querySelector('.update-btn');

if (updateBtn) {
    // ✅ Load saved languages on page load
    const savedLanguages = JSON.parse(localStorage.getItem('musicLanguages') || '[]');
    document.querySelectorAll('.language-list input[type="checkbox"]').forEach(checkbox => {
        if (savedLanguages.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    // ✅ Update navbar label with selected languages
    function updateLanguageLabel() {
        const saved = JSON.parse(localStorage.getItem('musicLanguages') || '[]');
        const toggle = document.querySelector('.language-dropdown .dropdown-toggle');
        if (!toggle) return;

        if (saved.length === 0) {
            toggle.innerHTML = 'Music Language <i class="fa-solid fa-chevron-down"></i>';
        } else if (saved.length <= 2) {
            toggle.innerHTML = saved.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')
                + ' <i class="fa-solid fa-chevron-down"></i>';
        } else {
            toggle.innerHTML = saved.length + ' Languages <i class="fa-solid fa-chevron-down"></i>';
        }
    }

    // ✅ Show label on load
    updateLanguageLabel();

    // ✅ Update button click
    updateBtn.addEventListener('click', function () {
        const selected = [];
        document.querySelectorAll('.language-list input[type="checkbox"]:checked').forEach(cb => {
            selected.push(cb.value);
        });

        if (selected.length === 0) {
            alert('⚠️ Please select at least one language!');
            return;
        }

        // ✅ Save to localStorage
        localStorage.setItem('musicLanguages', JSON.stringify(selected));

        // ✅ Update navbar label
        updateLanguageLabel();

        // ✅ Filter songs based on language (UI reflection)
        filterSongsByLanguage(selected);

        // ✅ Close dropdown
        document.querySelector('.language-menu').style.display = 'none';

        alert('✅ Music language updated to: ' + selected.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', '));
    });
}

// ✅ Filter songs UI based on selected languages
function filterSongsByLanguage(languages) {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return;

    cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const match = languages.some(lang => cardText.includes(lang));
        card.style.display = match ? 'block' : 'block'; // show all for now
        card.style.opacity = '1';
        card.style.border = '2px solid transparent';
    });

    // ✅ Highlight cards matching selected language
    cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const match = languages.some(lang => cardText.includes(lang));
        if (match) {
            card.style.border = '2px solid #FF0067';
            card.style.borderRadius = '12px';
        } else {
            card.style.border = '2px solid transparent';
            card.style.opacity = '0.5'; // dim non-matching
        }
    });
}