/**
 * Portfolio Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // ── Safety net: ensure desktop navbar is always visible ──────────────
    // Root cause: Tailwind v3 generates `.collapse { visibility: collapse }`
    // which conflicts with Bootstrap's `.collapse` class. We fix via:
    // 1. preflight:false in tailwind.config (index.html)
    // 2. High-specificity CSS in style.css
    // 3. This JS inline-style backstop (inline > any stylesheet)
    const navbarCollapseEl = document.getElementById('navbarNav');
    if (navbarCollapseEl) {
        const applyDesktopNav = () => {
            if (window.innerWidth >= 992) {
                navbarCollapseEl.style.display = 'flex';
                navbarCollapseEl.style.flexBasis = 'auto';
                navbarCollapseEl.style.flexGrow = '1';
                navbarCollapseEl.style.visibility = 'visible';
            } else {
                // Let Bootstrap handle it on mobile (remove inline override)
                navbarCollapseEl.style.display = '';
                navbarCollapseEl.style.visibility = 'visible';
            }
        };
        applyDesktopNav();                            // run on load
        window.addEventListener('resize', applyDesktopNav); // run on resize
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target); // Standard one-time animation
            }
        });
    }, observerOptions);

    // Observe all sections with 'section-hidden' class
    document.querySelectorAll('.section-hidden').forEach(section => {
        observer.observe(section);
    });

    // Close mobile navbar on link click
    const navLinks = document.querySelectorAll('.nav-item .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Only use Bootstrap Collapse JS on mobile (< 992px) to avoid
    // collapsing the navbar on desktop screens.
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                try {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse)
                        || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                } catch (e) {
                    console.warn('Bootstrap collapse hide failed:', e);
                }
            }
        });
    });

    // Form Submission Handler (Prevent default to act as placeholder)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic animation/feedback
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin text-sm me-2"></i> Sending...';
            btn.disabled = true;

            // Simulate network request
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check text-sm me-2"></i> Sent Successfully!';
                btn.classList.add('btn-success');
                btn.classList.remove('btn-primary');
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-primary');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Active Nav Link updating on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-primary'); // Using primary color class for active
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('text-primary');
            }
        });
    });

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    // Initialize icon state
    if (document.documentElement.classList.contains('dark')) {
        lightIcon.classList.remove('hidden');
    } else {
        darkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', () => {
        // Toggle icons
        darkIcon.classList.toggle('hidden');
        lightIcon.classList.toggle('hidden');

        // Toggle theme and update localStorage
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Progress Bar Animations
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute('aria-valuenow') + '%';
                entry.target.style.width = targetWidth;
                observer.unobserve(entry.target);
            }
        });
    }, progressObserverOptions);

    progressBars.forEach(bar => {
        // Reset width to 0 for initial state before observation
        bar.style.width = '0%';
        progressObserver.observe(bar);
    });
});
