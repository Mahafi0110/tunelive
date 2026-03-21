// FAQ toggle
document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("click", () => {
        let answer = item.querySelector(".faq-answer");
        document.querySelectorAll(".faq-answer").forEach(a => {
            if (a !== answer) a.style.display = "none";
        });
        answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
});

// Sidebar + overlay
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const overlay = document.createElement('div');
overlay.classList.add('sidebar-overlay');
document.body.appendChild(overlay);

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Dropdown toggle on click
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const menu = this.nextElementSibling;
        const isVisible = menu.style.display === 'block';
        document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        menu.style.display = isVisible ? 'none' : 'block';
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});