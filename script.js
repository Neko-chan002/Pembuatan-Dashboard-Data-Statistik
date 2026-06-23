// ==========================================
// 1. PRELOADER INITIALIZATION & PROGRESS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const appContainer = document.getElementById("app-container");
    const progressBar = document.getElementById("loader-progress-bar");
    const statusText = document.getElementById("loader-status");
    
    // Lucide Icons Initialization
    lucide.createIcons();

    // Set Live Date
    updateLiveDate();

    // Fake Loading Progress simulation for premium feel
    let progress = 0;
    const loadSteps = [
        { limit: 20, text: "Menginisialisasi modul 3D..." },
        { limit: 45, text: "Menghubungkan visualisasi data..." },
        { limit: 70, text: "Memuat struktur glassmorphism..." },
        { limit: 90, text: "Mengoptimalkan transisi halaman..." },
        { limit: 100, text: "Sistem Analisis Siap!" }
    ];

    let currentStep = 0;

    const progressInterval = setInterval(() => {
        if (progress < 100) {
            progress += Math.floor(Math.random() * 8) + 2; // Random increments
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            
            // Check status text update
            if (currentStep < loadSteps.length && progress >= loadSteps[currentStep].limit) {
                statusText.textContent = loadSteps[currentStep].text;
                currentStep++;
            }
        } else {
            clearInterval(progressInterval);
            
            // Fade out preloader
            setTimeout(() => {
                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";
                appContainer.classList.remove("hidden");
                if (window.innerWidth <= 768) {
                    appContainer.classList.add("sidebar-collapsed");
                }
            }, 500);
        }
    }, 80);
});

// ==========================================
// 2. LIVE DATE (Bahasa Indonesia)
// ==========================================
function updateLiveDate() {
    const dateDisplay = document.getElementById("date-display");
    if (!dateDisplay) return;

    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const now = new Date();
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    dateDisplay.textContent = `${dayName}, ${date} ${monthName} ${year}`;
}

// ==========================================
// 3. TAB / NAVIGATION CONTROLLER
// ==========================================
const navItems = document.querySelectorAll(".nav-item");
const pageSections = document.querySelectorAll(".page-section");
const currentPageTitle = document.getElementById("current-page-title");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const targetId = item.getAttribute("data-target");
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove("active"));
        // Add active class to clicked nav item
        item.classList.add("active");
        
        // Close sidebar if open on mobile
        if (window.innerWidth <= 768) {
            const appContainer = document.getElementById("app-container");
            if (appContainer) {
                appContainer.classList.add("sidebar-collapsed");
            }
            const sidebarOverlay = document.getElementById("sidebar-overlay");
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove("active");
            }
        }

        // Switch to target page
        switchPage(targetId);
    });
});

function switchPage(targetId) {
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // Get active section
    const activeSection = document.querySelector(".page-section.active");
    
    if (activeSection === targetSection) return;

    // Set page title top bar
    let pageTitle = "Profil Utama";
    if (targetId === "page-db1") pageTitle = "Dashboard Tahun 2021";
    else if (targetId === "page-db2") pageTitle = "Dashboard Tahun 2022";
    else if (targetId === "page-db3") pageTitle = "Dashboard Tahun 2023";
    else if (targetId === "page-db4") pageTitle = "Dashboard Tahun 2024";
    else if (targetId === "page-db5") pageTitle = "Dashboard Tahun 2025";
    
    currentPageTitle.textContent = pageTitle;

    // Handle transition out of active section
    if (activeSection) {
        activeSection.style.opacity = "0";
        activeSection.style.transform = "translate3d(0, -20px, 0) scale(0.98)";
        
        setTimeout(() => {
            activeSection.classList.remove("active");
            
            // Set up target section entering
            targetSection.classList.add("active");
            // Force reflow
            targetSection.offsetHeight;
            
            targetSection.style.opacity = "1";
            targetSection.style.transform = "translate3d(0, 0, 0) scale(1)";
        }, 300);
    } else {
        targetSection.classList.add("active");
        targetSection.offsetHeight;
        targetSection.style.opacity = "1";
        targetSection.style.transform = "translate3d(0, 0, 0) scale(1)";
    }

    // Scroll main content to top
    document.querySelector(".main-content").scrollTop = 0;

    // Synchronize active nav item button if page is changed via in-page buttons
    navItems.forEach(nav => {
        if (nav.getAttribute("data-target") === targetId) {
            nav.classList.add("active");
        } else {
            nav.classList.remove("active");
        }
    });
}

// ==========================================
// 4. INTERACTIVE 3D TILT EFFECT
// ==========================================
const profileCardWrapper = document.getElementById("profile-card-3d-wrapper");
const profileCard = document.querySelector(".profile-card-3d");

if (profileCardWrapper && profileCard) {
    profileCardWrapper.addEventListener("mousemove", (e) => {
        const rect = profileCardWrapper.getBoundingClientRect();
        
        // Mouse coordinate relative to the card wrapper
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate center of card wrapper
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Limit max rotation to 15 degrees
        const maxRotation = 15;
        const rotateX = ((centerY - y) / centerY) * maxRotation;
        const rotateY = ((x - centerX) / centerX) * maxRotation;
        
        profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileCardWrapper.addEventListener("mouseleave", () => {
        // Smoothly return card to original state
        profileCard.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        profileCard.style.transform = "rotateX(0deg) rotateY(0deg)";
        
        // Remove transitions style after animation finishes so future mouse movements are snappy
        setTimeout(() => {
            profileCard.style.transition = "";
        }, 500);
    });
}

// 3D Tilt effect for mini stats cards (Subtle tilt - 8 degrees max)
const miniStats = document.querySelectorAll(".interactive-3d-mini");
miniStats.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxRotation = 8;
        const rotateX = ((centerY - y) / centerY) * maxRotation;
        const rotateY = ((x - centerX) / centerX) * maxRotation;
        
        card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.4s ease";
        card.style.transform = "perspective(500px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
        setTimeout(() => {
            card.style.transition = "";
        }, 400);
    });
});

// ==========================================
// 5. IFRAME CONTROLLER & LOCAL LOADERS
// ==========================================
const iframes = document.querySelectorAll(".looker-iframe");

iframes.forEach(iframe => {
    // Hide iframe initially (opacity 0 set via CSS is ready)
    iframe.style.opacity = "0";

    iframe.addEventListener("load", () => {
        const wrapper = iframe.parentElement;
        const loader = wrapper.querySelector(".iframe-loader");
        
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
                iframe.style.opacity = "1";
            }, 600);
        } else {
            iframe.style.opacity = "1";
        }
    });
});

// Reload Iframe Action
const reloadBtns = document.querySelectorAll(".reload-iframe");
reloadBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const iframeId = btn.getAttribute("data-iframe-id");
        const iframe = document.getElementById(iframeId);
        if (!iframe) return;

        const wrapper = iframe.parentElement;
        const loader = wrapper.querySelector(".iframe-loader");

        // Show loading spinner again
        if (loader) {
            loader.style.display = "flex";
            loader.style.opacity = "1";
        }
        iframe.style.opacity = "0";

        // Reset src to trigger reload
        const currentSrc = iframe.src;
        iframe.src = "";
        iframe.src = currentSrc;
        
        // Animate button
        const icon = btn.querySelector("i");
        icon.style.transform = "rotate(360deg)";
        icon.style.transition = "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
        setTimeout(() => {
            icon.style.transition = "none";
            icon.style.transform = "rotate(0deg)";
        }, 800);
    });
});

// ==========================================
// 6. FULLSCREEN MODE HANDLER
// ==========================================
const fullscreenBtns = document.querySelectorAll(".fullscreen-btn");
fullscreenBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const dbContainer = btn.closest(".dashboard-container");
        if (!dbContainer) return;

        dbContainer.classList.toggle("fullscreen");
        
        // Change Icon based on status
        const icon = btn.querySelector("i");
        if (dbContainer.classList.contains("fullscreen")) {
            icon.setAttribute("data-lucide", "minimize");
            // Change body scrollbar to hide overflow
            document.body.style.overflow = "hidden";
        } else {
            icon.setAttribute("data-lucide", "maximize");
            document.body.style.overflow = "";
        }
        lucide.createIcons(); // Redraw icons
    });
});

// Press ESC to exit fullscreen
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const fullscreenDbs = document.querySelectorAll(".dashboard-container.fullscreen");
        fullscreenDbs.forEach(db => {
            db.classList.remove("fullscreen");
            document.body.style.overflow = "";
            const btn = db.querySelector(".fullscreen-btn i");
            if (btn) {
                btn.setAttribute("data-lucide", "maximize");
            }
        });
        lucide.createIcons();
    }
});

// ==========================================
// 7. THEME SWITCHER CONTROLLER (Anti-Monoton)
// ==========================================
const themeBtns = document.querySelectorAll(".theme-btn");
const htmlTag = document.documentElement;

// Read theme from localStorage or default to 'ocean'
const savedTheme = localStorage.getItem("jabar-tour-theme") || "ocean";
setTheme(savedTheme);

themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const themeName = btn.getAttribute("data-theme");
        setTheme(themeName);
    });
});

function setTheme(themeName) {
    // Set theme attribute to HTML tag
    htmlTag.setAttribute("data-theme", themeName);
    
    // Save to localStorage
    localStorage.setItem("jabar-tour-theme", themeName);
    
    // Update active state in theme buttons
    themeBtns.forEach(btn => {
        if (btn.getAttribute("data-theme") === themeName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Animate theme transition effect (dynamic change backdrop-glows)
    const glow = document.querySelector(".preloader-backdrop-glow");
    if (glow) {
        glow.style.background = `var(--accent-primary)`;
    }
}

// ==========================================
// 8. SIDEBAR TOGGLE & BACKDROP OVERLAY
// ==========================================
const sidebar = document.querySelector(".sidebar");
const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const appContainer = document.getElementById("app-container");

if (sidebar) {
    // Toggle sidebar function
    const toggleSidebar = () => {
        if (appContainer) {
            appContainer.classList.toggle("sidebar-collapsed");
            
            // Handle overlay on mobile
            if (window.innerWidth <= 768 && sidebarOverlay) {
                if (appContainer.classList.contains("sidebar-collapsed")) {
                    sidebarOverlay.classList.remove("active");
                } else {
                    sidebarOverlay.classList.add("active");
                }
            }
        }
    };

    // Bind event listener to toggle button
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Function to close sidebar
    const closeSidebar = () => {
        if (appContainer) {
            appContainer.classList.add("sidebar-collapsed");
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }
    };

    // Close on backdrop overlay click
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    // Close on clicking outside sidebar area (mobile only)
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 && appContainer && !appContainer.classList.contains("sidebar-collapsed")) {
            if (!sidebar.contains(e.target) && e.target !== sidebarToggleBtn) {
                closeSidebar();
            }
        }
    });
}

// ==========================================
// 9. COLLAPSIBLE ACCORDION MENU (Dashboard Analisis)
// ==========================================
const dashboardToggle = document.getElementById("dashboard-toggle");
const dashboardMenu = document.getElementById("dashboard-menu");

if (dashboardToggle && dashboardMenu) {
    dashboardToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        dashboardToggle.classList.toggle("collapsed");
        dashboardMenu.classList.toggle("collapsed");
    });
}
