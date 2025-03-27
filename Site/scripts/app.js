// Mobil menü toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Navbar scroll efekti
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        header.style.background = 'rgba(10, 10, 20, 0.98)';
        header.style.padding = '10px 0';
    } else {
        header.style.background = 'rgba(10, 10, 20, 0.9)';
        header.style.padding = '15px 0';
    }
    
    // Bölümleri vurgula
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const id = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${id}"]`).classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${id}"]`).classList.remove('active');
        }
    });
});
// Lazy loading
const lazyLoad = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => observer.observe(img));
};
// Form gönderimi
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mesajınız başarıyla gönderildi!');
        contactForm.reset();
    });
}

document.addEventListener('DOMContentLoaded', lazyLoad);

// Proje kart animasyonları
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    projectObserver.observe(card);
});
// Navbar linkleri için yumuşak kaydırma
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Mobil menüyü kapat
        if (document.querySelector('.nav-links').classList.contains('active')) {
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.mobile-menu-btn').innerHTML = '<i class="fas fa-bars"></i>';
        }
        
        // Hedef bölümü bul
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Yumuşak kaydırma
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Navbar yüksekliği kadar üst boşluk
                behavior: 'smooth'
            });
            
            // URL'de hash güncelleme (isteğe bağlı)
            history.pushState(null, null, targetId);
        }
    });
});
// Navbar linkleri için yumuşak kaydırma
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mobil menüyü kapat
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.querySelector('.mobile-menu-btn').innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // Hedef bölümü bul
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Yumuşak kaydırma
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // URL'de hash güncelleme
                history.pushState(null, null, targetId);
                
                // Aktif linki güncelle
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Scroll sırasında aktif linki güncelle
    window.addEventListener('scroll', updateActiveLink);
    
    // Sayfa yüklendiğinde hash kontrolü
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}

// Aktif linki güncelleme fonksiyonu
function updateActiveLink() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', setupSmoothScrolling);