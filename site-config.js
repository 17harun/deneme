/**
 * Hilal Teknik - Dynamic Site Configuration & Sync Engine
 * Manages live contact details, social links, map location, and gallery items stored in localStorage
 */

(function () {
    const CONFIG_KEY = 'hilal_site_config_v1';
    const GALLERY_KEY = 'hilal_site_gallery_v1';

    // Default Site Configuration (Fallback & Initial Seed)
    const defaultConfig = {
        phonePrimaryRaw: '05376074817',
        phonePrimaryFormatted: '0537 607 48 17',
        phoneRaw: '05376074817',
        phoneFormatted: '0537 607 48 17',
        phoneCallCta: '7/24 Kesintisiz Acil Usta Çağır',
        whatsappRaw: '905376074817',
        whatsappFormatted: '0537 607 48 17',
        whatsappMessage: 'Merhaba Hilal Teknik, kombi arıza/bakım hakkında bilgi almak ve servis talep etmek istiyorum.',
        emailPrimary: 'osman_tari@hotmail.com',
        emailText: 'osman_',
        addressText: 'Paşaköşkü Mah. İsmet Paşa Cad. No:44, Battalgazi / Malatya',
        serviceAreas: 'Malatya Merkez, Battalgazi, Yeşilyurt ve Tüm İlçeler',
        workingHours: '7/24 Kesintisiz Hizmet',
        contactDescription: 'Malatya genelinde kombi arıza, bakım, onarım, petek temizliği ve acil teknik servis talepleriniz için 7/24 hizmetinizdeyiz.',
        instagramUrl: 'https://www.instagram.com/hilal_teknik_malatya',
        facebookUrl: 'https://www.facebook.com/hilal.teknik.tesisat.malatya',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3133.013589146199!2d38.3183457!3d38.3496355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x407636de55d54a2f%3A0xb35a842b109c910!2sPa%C5%9Fak%C3%B6%C5%9Fk%C3%BC%2C%20%C4%B0smet%20Pa%C5%9Fa%20Cd.%20No%3A44%2C%2044200%20Battalgazi%2FMalatya!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str',
        status: 'published'
    };

    // Default Seed Gallery Items (All Site Photos)
    // NOT: GitHub Pages'e henüz WebP push edilmemiş, JPG fallback kullanılıyor.
    // WebP dosyaları push edildikten sonra .jpg → .webp değiştirilebilir.
    const defaultGallery = [
        { id: 1, title: 'Vaillant Yoğuşmalı Kombi Montajı', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0041.jpg' },
        { id: 2, title: 'Sıhhi Tesisat ve Kombi Montajı', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0040.jpg' },
        { id: 3, title: 'Kombi Montaj Tamamlandı', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0025.jpg' },
        { id: 4, title: 'Kombi Kurulum Çalışması', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0024.jpg' },
        { id: 5, title: 'Kombi Tesisat Bağlantısı', category: 'tesisat', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0023.jpg' },
        { id: 6, title: 'Kombi Montaj ve Kontrol', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0021.jpg' },
        { id: 7, title: 'Viessmann Kombi Montajı', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0019.jpg' },
        { id: 8, title: 'Demirdöküm Kombi Kurulumu', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0017.jpg' },
        { id: 9, title: 'Baymak Kombi Montaj İşlemi', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0015.jpg' },
        { id: 10, title: 'E.C.A Kombi Montajı', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0014.jpg' },
        { id: 11, title: 'Buderus Kombi Kurulumu', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0011.jpg' },
        { id: 12, title: 'Bosch Yoğuşmalı Kombi Montajı', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0010.jpg' },
        { id: 13, title: 'Vaillant Kombi Montajı', category: 'montaj', url: 'RESIMLER/kombi_kurulum/IMG-20250812-WA0009.jpg' },
        { id: 14, title: 'Brülör Temizliği & Yanma Ayarı', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0043.jpg' },
        { id: 15, title: 'Kombi Yıllık Genel Bakım', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0042.jpg' },
        { id: 16, title: 'Tesisat Kaçak Onarımı', category: 'tesisat', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0039.jpg' },
        { id: 17, title: 'Petek Havalandırma ve Temizlik', category: 'petek', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0038.jpg' },
        { id: 18, title: 'Devirdaim Pompası Kontrolü', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0037.jpg' },
        { id: 19, title: 'Gaz Valfi Ayarı ve Testi', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0036.jpg' },
        { id: 20, title: 'Eşanjör Kireç Temizliği', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0035.jpg' },
        { id: 21, title: 'Genleşme Tankı Basınç Ayarı', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0034.jpg' },
        { id: 22, title: 'Kombi Fan Motoru Bakımı', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0033.jpg' },
        { id: 23, title: 'Doğalgaz Kaçak Testi', category: 'tesisat', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0032.jpg' },
        { id: 24, title: 'Petek Tesisat Yıkama', category: 'petek', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0031.jpg' },
        { id: 25, title: 'Kombi Filtre ve Eşanjör Temizliği', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0030.jpg' },
        { id: 26, title: 'Orijinal Yedek Parça Değişimi', category: 'yedekparca', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0029.jpg' },
        { id: 27, title: 'Kombi Kart & Elektronik Tamir', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0028.jpg' },
        { id: 28, title: 'Buderus Arıza Tespiti & Onarım', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0027.jpg' },
        { id: 29, title: 'Profesyonel Petek Temizliği', category: 'petek', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0026.jpg' },
        { id: 30, title: 'Vaillant Periyodik Bakım', category: 'bakim', url: 'RESIMLER/bakim_ariza/IMG-20250812-WA0022.jpg' }
    ];

    // Load Config (Synchronous Cache / Fallback)
    function getConfig() {
        try {
            const raw = localStorage.getItem(CONFIG_KEY);
            return raw ? Object.assign({}, defaultConfig, JSON.parse(raw)) : defaultConfig;
        } catch (e) {
            return defaultConfig;
        }
    }

    // Save Config to local cache
    function saveConfig(config) {
        try {
            const merged = Object.assign({}, getConfig(), config);
            // keep alias keys synced
            if (merged.phonePrimaryRaw) merged.phoneRaw = merged.phonePrimaryRaw;
            if (merged.phonePrimaryFormatted) merged.phoneFormatted = merged.phonePrimaryFormatted;
            if (merged.emailPrimary) merged.emailText = merged.emailPrimary;

            localStorage.setItem(CONFIG_KEY, JSON.stringify(merged));
            applyConfigToDOM(merged);
        } catch (e) {
            console.error('Save config cache error:', e);
        }
    }

    // Static configuration is applied directly from defaultConfig
    function syncConfigFromServer() {
        // Pure static mode: no backend API calls needed
    }

    // Load Gallery
    function getGallery() {
        try {
            const raw = localStorage.getItem(GALLERY_KEY);
            if (!raw) {
                saveGallery(defaultGallery);
                return defaultGallery;
            }
            const items = JSON.parse(raw);
            let updated = false;
            if (!Array.isArray(items) || items.length < defaultGallery.length) {
                // Seed with all photos if cached version is missing items
                const existingUrls = new Set(items.map(i => i.url));
                defaultGallery.forEach(defItem => {
                    if (!existingUrls.has(defItem.url)) {
                        items.push(defItem);
                        updated = true;
                    }
                });
            }
            items.forEach((item, idx) => {
                if (!item.url || item.url.includes('WhatsApp Image 2026')) {
                    item.url = defaultGallery[idx % defaultGallery.length].url;
                    updated = true;
                }
            });
            if (updated) saveGallery(items);
            return items;
        } catch (e) {
            return defaultGallery;
        }
    }

    // Save Gallery
    function saveGallery(items) {
        try {
            localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Save gallery error:', e);
        }
    }

    // Apply Loaded Configuration to Webpage Elements Globally (Zero-XSS Protection)
    function applyConfigToDOM(config) {
        if (!config) config = getConfig();

        const phonePrimRaw = config.phonePrimaryRaw || config.phoneRaw || '05376074817';
        const phonePrimFormatted = config.phonePrimaryFormatted || config.phoneFormatted || '0537 607 48 17';
        const phoneSecRaw = config.phoneSecondaryRaw || '';
        const phoneSecFormatted = config.phoneSecondaryFormatted || '';
        const whatsappNum = config.whatsappRaw || '905376074817';
        const emailPrim = config.emailPrimary || config.emailText || 'osman_tari@hotmail.com';
        const emailSec = config.emailSecondary || '';
        const address = config.addressText || '';
        const serviceAreas = config.serviceAreas || '';
        const hours = config.workingHours || '';
        const description = config.contactDescription || '';

        // 1. Social Media Links
        if (config.instagramUrl) {
            document.querySelectorAll('a[href*="instagram.com"]').forEach(el => {
                el.setAttribute('href', config.instagramUrl);
            });
        }
        if (config.facebookUrl) {
            document.querySelectorAll('a[href*="facebook.com"]').forEach(el => {
                el.setAttribute('href', config.facebookUrl);
            });
        }

        // 2. Primary Email Links & Displays
        document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
            const currentHref = el.getAttribute('href') || '';
            if (!currentHref.includes('harun.aln')) {
                el.setAttribute('href', 'mailto:' + emailPrim);
                if (el.textContent.includes('@')) {
                    el.textContent = emailPrim;
                }
            }
        });
        document.querySelectorAll('.cfg-email-display').forEach(el => {
            el.textContent = emailPrim;
        });
        document.querySelectorAll('.cfg-email-secondary').forEach(el => {
            el.textContent = emailSec;
        });

        // 3. Primary Phone Links & Formatted Displays
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
            el.setAttribute('href', 'tel:' + phonePrimRaw);
            const spanText = el.querySelector('span');
            if (spanText && (spanText.textContent.includes('053') || spanText.textContent.includes('05'))) {
                spanText.textContent = phonePrimFormatted;
            } else if (el.classList.contains('btn--secondary') || el.classList.contains('header-cta-btn')) {
                const sub = el.querySelector('.btn-subtext');
                if (sub) sub.textContent = phonePrimFormatted;
            }
        });

        // Phone call badges & spans
        document.querySelectorAll('.floating-btn--phone, .contact-phone-text, .cfg-phone-display').forEach(el => {
            const numSpan = el.querySelector('span, strong');
            if (numSpan) {
                numSpan.textContent = phonePrimFormatted;
            } else if (!el.children.length) {
                el.textContent = phonePrimFormatted;
            }
        });

        // 4. Secondary Phone Displays (if any)
        document.querySelectorAll('.cfg-phone-secondary-display').forEach(el => {
            el.textContent = phoneSecFormatted;
        });
        document.querySelectorAll('a[href*="secondary-phone"]').forEach(el => {
            if (phoneSecRaw) {
                el.setAttribute('href', 'tel:' + phoneSecRaw);
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        });

        // 5. WhatsApp Links
        document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(el => {
            const oldHref = el.getAttribute('href') || '';
            let textParam = '';
            if (oldHref.includes('text=')) {
                textParam = '?' + oldHref.split('?')[1];
            }
            el.setAttribute('href', 'https://wa.me/' + whatsappNum + textParam);
        });
        document.querySelectorAll('.cfg-whatsapp-display').forEach(el => {
            el.textContent = config.whatsappFormatted || phonePrimFormatted;
        });

        // 6. Address Displays
        document.querySelectorAll('.address-text, .cfg-address-display, .footer-col p:has(.fa-map-marker-alt)').forEach(el => {
            if (address) {
                const icon = el.querySelector('i');
                if (icon) {
                    el.textContent = ' ';
                    el.prepend(icon);
                    el.appendChild(document.createTextNode(' ' + address));
                } else {
                    el.textContent = address;
                }
            }
        });

        // 7. Service Areas
        document.querySelectorAll('.cfg-service-areas-display').forEach(el => {
            el.textContent = serviceAreas;
        });

        // 8. Working Hours
        document.querySelectorAll('.working-hours-display, .cfg-working-hours-display').forEach(el => {
            if (hours) el.textContent = hours;
        });

        // 9. Contact Description / Emergency Note
        document.querySelectorAll('.cfg-contact-desc-display').forEach(el => {
            if (description) el.textContent = description;
        });

        // 10. Map iFrames & Directions
        const activeMap = config.mapEmbedUrl || defaultConfig.mapEmbedUrl;
        document.querySelectorAll('iframe[src*="google.com/maps"], iframe.contact-map-iframe, #contactMapIframe').forEach(iframe => {
            if (activeMap && iframe.getAttribute('src') !== activeMap) {
                iframe.setAttribute('src', activeMap);
            }
        });

        // 11. Google Maps Directions Links
        const destQuery = encodeURIComponent(address || 'Paşaköşkü Mah. İsmet Paşa Cad. No:44 Battalgazi Malatya');
        const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${destQuery}`;
        document.querySelectorAll('.cfg-map-directions-link').forEach(el => {
            el.setAttribute('href', directionsLink);
        });

        // 12. Leaflet Interactive Map Coordinate Sync
        if (window.HilalMap && window.HilalMarker && config.mapEmbedUrl) {
            const pbM = config.mapEmbedUrl.match(/!2d([0-9.]+)!3d([0-9.]+)/);
            let nLat = null, nLng = null;
            if (pbM) {
                nLat = parseFloat(pbM[2]);
                nLng = parseFloat(pbM[1]);
            } else {
                const atM = config.mapEmbedUrl.match(/@([0-9.]+),([0-9.]+)/);
                if (atM) {
                    nLat = parseFloat(atM[1]);
                    nLng = parseFloat(atM[2]);
                } else {
                    const qM = config.mapEmbedUrl.match(/(?:q|ll)=([0-9.]+),([0-9.]+)/);
                    if (qM) {
                        nLat = parseFloat(qM[1]);
                        nLng = parseFloat(qM[2]);
                    }
                }
            }
            if (nLat && nLng && !isNaN(nLat) && !isNaN(nLng)) {
                window.HilalMap.setView([nLat, nLng], 16);
                window.HilalMarker.setLatLng([nLat, nLng]);
            }
        }
    }

    // Public API
    window.HilalConfig = {
        getConfig: getConfig,
        saveConfig: saveConfig,
        syncConfigFromServer: syncConfigFromServer,
        getGallery: getGallery,
        saveGallery: saveGallery,
        applyConfigToDOM: applyConfigToDOM,
        resetToDefaults: function () {
            localStorage.removeItem(CONFIG_KEY);
            localStorage.removeItem(GALLERY_KEY);
            applyConfigToDOM(defaultConfig);
            return { config: defaultConfig, gallery: defaultGallery };
        }
    };

    // ==================== UNIFIED HIGH-PERFORMANCE SCROLL & INTERACTION ENGINE ====================
    function initUnifiedScroll() {
        const siteHeader = document.getElementById('siteHeader') || document.querySelector('.site-header');
        const scrollToTopBtn = document.getElementById('scrollToTop');
        let scrollTimer = null;
        let isTicking = false;

        function updateOnScroll() {
            const y = window.pageYOffset || document.documentElement.scrollTop;

            // 1. Sticky Header
            if (siteHeader) {
                if (y > 30) {
                    siteHeader.classList.add('is-scrolled');
                } else {
                    siteHeader.classList.remove('is-scrolled');
                }
            }

            // 2. Scroll to Top Button
            if (scrollToTopBtn) {
                if (y > 300) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            }

            // 3. Mobile Scroll Optimizer Class
            if (!document.body.classList.contains('is-scrolling')) {
                document.body.classList.add('is-scrolling');
            }
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function () {
                document.body.classList.remove('is-scrolling');
            }, 300);

            isTicking = false;
        }

        window.addEventListener('scroll', function () {
            if (!isTicking) {
                window.requestAnimationFrame(updateOnScroll);
                isTicking = true;
            }
        }, { passive: true });

        // Initial check on load
        updateOnScroll();

        // Scroll to top click listener
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // Delegated smooth scrolling for all internal anchors
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (!href || href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 75;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    function applyTheme(theme) {
        const next = theme === 'light' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
            const on = btn.getAttribute('data-theme-value') === next;
            btn.classList.toggle('is-active', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function initThemeToggle() {
        let current = 'dark';
        try {
            const saved = localStorage.getItem('hilal_theme');
            if (saved === 'light' || saved === 'dark') current = saved;
        } catch (e) { /* ignore */ }
        applyTheme(current);

        document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const theme = btn.getAttribute('data-theme-value') === 'light' ? 'light' : 'dark';
                try { localStorage.setItem('hilal_theme', theme); } catch (e) { /* ignore */ }
                applyTheme(theme);
            });
        });
    }

    function initMobileCrescentMenu() {
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const headerContainer = document.querySelector('.header-container');
        if (!toggleBtn || !headerContainer) return;

        function openMenu() {
            toggleBtn.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            headerContainer.classList.add('is-open');
        }

        function closeMenu() {
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            headerContainer.classList.remove('is-open');
        }

        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (headerContainer.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener('click', function (e) {
            if (!headerContainer.contains(e.target) && headerContainer.classList.contains('is-open')) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && headerContainer.classList.contains('is-open')) {
                closeMenu();
            }
        });

        headerContainer.querySelectorAll('.desktop-nav .nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });
    }

    // ==================== FAREYE DUYARLI PREMİUM AMBİENT ARKA PLAN MOTORU ====================
    function initInteractiveBackground() {
        // Eğer sayfada arka plan elemanı yoksa otomatik oluştur
        let bgWrapper = document.getElementById('ambientBg');
        if (!bgWrapper) {
            const bgHtml = '<div class="ambient-interactive-bg" id="ambientBg" aria-hidden="true"><div class="ambient-bg-art"></div><div class="ambient-bg-glow"></div></div>';
            document.body.insertAdjacentHTML('afterbegin', bgHtml);
            bgWrapper = document.getElementById('ambientBg');
        }

        if (!bgWrapper) return;

        // Dokunmatik cihaz kontrolü: dokunmatik ekranda fare takibi KESİNLİKLE başlatılmaz
        const isTouch = window.matchMedia('(pointer: coarse)').matches ||
            window.matchMedia('(hover: none)').matches ||
            (window.innerWidth < 992);
        if (isTouch) return;

        // prefers-reduced-motion kontrolü
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let isTicking = false;

        function updatePosition() {
            // Yumuşak yaylanma / sönümleme (lerp)
            currentX += (targetX - currentX) * 0.06;
            currentY += (targetY - currentY) * 0.06;

            bgWrapper.style.setProperty('--bg-mouse-x', currentX.toFixed(4));
            bgWrapper.style.setProperty('--bg-mouse-y', currentY.toFixed(4));

            // Hareket durduğunda döngüyü uyut (0 CPU kullanımı)
            if (Math.abs(targetX - currentX) > 0.0004 || Math.abs(targetY - currentY) > 0.0004) {
                requestAnimationFrame(updatePosition);
            } else {
                isTicking = false;
            }
        }

        window.addEventListener('pointermove', function (e) {
            // Ekran merkezine göre normalize edilmiş koordinatlar (-1 ile +1 arası)
            targetX = (e.clientX / window.innerWidth) * 2 - 1;
            targetY = (e.clientY / window.innerHeight) * 2 - 1;

            if (!isTicking) {
                isTicking = true;
                requestAnimationFrame(updatePosition);
            }
        }, { passive: true });

        // Sekme arka plana geçtiğinde animasyonu dondur (Pil ve CPU tasarrufu)
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                isTicking = false;
            }
        });
    }

    // Eski panel / veritabanı önbelleğini temizle (saf statik mod)
    try {
        localStorage.removeItem('hilal_admin_gallery_items');
        localStorage.removeItem('hilal_site_gallery_v1');
        localStorage.removeItem('hilal_admin_logged');
        localStorage.removeItem('hilal_admin_session');
    } catch (e) { }

    // Evrensel Görsel Hata Yakalayıcı (WebP -> JPG/PNG otomatik geri dönüş)
    document.addEventListener('error', function (e) {
        if (e.target && e.target.tagName === 'IMG') {
            const img = e.target;
            if (img.dataset.fallbackTried) return;
            img.dataset.fallbackTried = 'true';
            // Amblem ve WebP görselleri için akıllı geri dönüş
            if (img.src.includes('logo-hilal-amblem.webp')) {
                img.src = img.src.replace('logo-hilal-amblem.webp', 'logo-hilal-amblem.png');
            } else if (img.src.includes('arka-plan-hilal-ambient.webp')) {
                img.src = img.src.replace('arka-plan-hilal-ambient.webp', 'arka-plan-hilal-ambient.jpg');
            } else if (img.src.endsWith('.webp')) {
                img.src = img.src.replace(/\.webp$/i, '.jpg');
            }
        }
    }, true);

    // Auto-run on page load
    function initSiteConfig() {
        applyConfigToDOM();
        initThemeToggle();
        initUnifiedScroll();
        initSmoothScroll();
        initMobileCrescentMenu();
        initInteractiveBackground();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSiteConfig);
    } else {
        initSiteConfig();
    }
})();
