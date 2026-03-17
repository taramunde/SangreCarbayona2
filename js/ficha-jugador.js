/* ===================================
   FICHA JUGADOR - JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // TABS FUNCTIONALITY
    // ===================================
    const statsTabs = document.querySelectorAll('.stats-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (statsTabs.length > 0) {
        statsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Remove active class from all tabs
                statsTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all tab contents
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Show the selected tab content
                const selectedContent = document.getElementById(tabId);
                if (selectedContent) {
                    selectedContent.classList.add('active');
                }
            });
        });
    }
    
    // ===================================
    // PERFORMANCE BARS ANIMATION
    // ===================================
    const performanceBars = document.querySelectorAll('.performance-fill');
    
    if (performanceBars.length > 0) {
        const animatePerformanceBars = () => {
            performanceBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        };
        
        // Trigger animation when overview tab is visible
        const overviewTab = document.getElementById('overview');
        if (overviewTab) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animatePerformanceBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(overviewTab);
        }
    }
    
    // ===================================
    // GALLERY LIGHTBOX (Simple version)
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const caption = this.querySelector('.gallery-caption');
                
                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${img.src}" alt="${img.alt}">
                        ${caption ? `<p class="lightbox-caption">${caption.textContent}</p>` : ''}
                        <button class="lightbox-close"><i class="fas fa-times"></i></button>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                // Animate in
                setTimeout(() => lightbox.classList.add('active'), 10);
                
                // Close handlers
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox || e.target.closest('.lightbox-close')) {
                        lightbox.classList.remove('active');
                        setTimeout(() => {
                            document.body.removeChild(lightbox);
                            document.body.style.overflow = '';
                        }, 300);
                    }
                });
                
                // Close on Escape
                document.addEventListener('keydown', function closeOnEscape(e) {
                    if (e.key === 'Escape') {
                        lightbox.classList.remove('active');
                        setTimeout(() => {
                            document.body.removeChild(lightbox);
                            document.body.style.overflow = '';
                        }, 300);
                        document.removeEventListener('keydown', closeOnEscape);
                    }
                });
            });
        });
    }
    
    // ===================================
    // SEASON SELECT
    // ===================================
    const seasonSelect = document.getElementById('seasonSelect');
    
    if (seasonSelect) {
        seasonSelect.addEventListener('change', function() {
            // Here you would typically load different match data
            // For demo purposes, we'll just show a notification
            console.log('Season changed to:', this.value);
        });
    }
    
    // ===================================
    // LOAD MORE MATCHES
    // ===================================
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.add('fa-spin');
            
            // Simulate loading
            setTimeout(() => {
                icon.classList.remove('fa-spin');
                // In a real app, this would load more matches
            }, 1000);
        });
    }
    
    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    const animateOnScroll = (elements, className) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => observer.observe(el));
    };
    
    // Animate cards on scroll
    const cardsToAnimate = document.querySelectorAll('.performance-card, .personal-info-card, .goals-distribution-card, .disciplinary-card, .match-detail-card, .timeline-item, .gallery-item, .player-news-card, .related-player-card');
    
    cardsToAnimate.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    animateOnScroll(cardsToAnimate, 'animated');
    
    // Add animated class styles
    const style = document.createElement('style');
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});

// ===================================
// LIGHTBOX STYLES (Added dynamically)
// ===================================
const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
    .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lightbox.active {
        opacity: 1;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 85vh;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-caption {
        text-align: center;
        color: white;
        margin-top: 15px;
        font-weight: 600;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .lightbox-close:hover {
        transform: rotate(90deg);
        color: #c9a227;
    }
`;
document.head.appendChild(lightboxStyles);
