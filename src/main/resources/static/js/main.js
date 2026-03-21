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