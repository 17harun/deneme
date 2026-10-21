/**
 * Hilal Teknik - Client Analytics & Interaction Tracker (Static v2)
 * Pure static, zero server/DB dependency.
 * Dispatches events to:
 * 1. Google Analytics 4 (gtag)
 * 2. Optional privacy-focused external analytics (Umami, Plausible, Cloudflare, etc.)
 * 3. Client-side LocalStorage daily interaction cache
 */

(function () {
    'use strict';

    // Helper: Determine button location from DOM hierarchy
    function getButtonLocation(element) {
        if (!element) return 'genel';
        if (element.closest('.floating-contact-actions')) return 'floating';
        if (element.closest('.site-header') || element.closest('.header') || element.closest('.navbar') || element.closest('.desktop-nav') || element.closest('.mobile-drawer')) return 'header';
        if (element.closest('.site-footer') || element.closest('footer')) return 'footer';
        if (element.closest('.hero-section') || element.closest('.hero')) return 'hero';
        if (element.closest('.contact-section') || element.closest('.contact-card') || element.closest('.contact-info')) return 'contact_card';
        if (element.closest('.call-btn-container') || element.closest('.cta-banner') || element.closest('.service-actions')) return 'cta_action';
        return 'sayfa_ici';
    }

    // Unified external analytics dispatcher (GA4, Umami, Plausible)
    function dispatchExternalAnalytics(eventName, params) {
        const payload = params || {};

        // 1. Google Analytics 4
        if (typeof window.gtag === 'function') {
            try {
                window.gtag('event', eventName, payload);
            } catch (e) { }
        }

        // 2. Umami Analytics (if script loaded in future)
        if (window.umami && typeof window.umami.track === 'function') {
            try {
                window.umami.track(eventName, payload);
            } catch (e) { }
        }

        // 3. Plausible Analytics (if script loaded in future)
        if (typeof window.plausible === 'function') {
            try {
                window.plausible(eventName, { props: payload });
            } catch (e) { }
        }
    }

    // Main event tracking function
    function recordEvent(eventType, location) {
        const pathname = window.location.pathname || '/';
        const loc = location || 'sayfa_ici';

        // 1. Dispatch to external analytics
        if (eventType === 'click_phone') {
            dispatchExternalAnalytics('generate_lead', {
                method: 'phone',
                event_category: 'contact',
                event_label: 'Telefon: ' + loc,
                button_location: loc,
                page_path: pathname
            });
            dispatchExternalAnalytics('phone_call', {
                event_category: 'engagement',
                event_label: loc,
                page_path: pathname
            });
        } else if (eventType === 'click_whatsapp') {
            dispatchExternalAnalytics('generate_lead', {
                method: 'whatsapp',
                event_category: 'contact',
                event_label: 'WhatsApp: ' + loc,
                button_location: loc,
                page_path: pathname
            });
            dispatchExternalAnalytics('whatsapp_click', {
                event_category: 'engagement',
                event_label: loc,
                page_path: pathname
            });
        } else if (eventType === 'click_instagram' || eventType === 'click_facebook') {
            dispatchExternalAnalytics('social_visit', {
                event_category: 'social',
                event_label: eventType,
                platform: eventType.replace('click_', ''),
                button_location: loc,
                page_path: pathname
            });
        } else if (eventType === 'pageview') {
            dispatchExternalAnalytics('page_view', {
                page_path: pathname
            });
        }

        // 2. Client-side local daily history for offline/in-browser resilience
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            let history = JSON.parse(localStorage.getItem('hilal_analytics_daily_history') || '[]');
            if (Array.isArray(history)) {
                let todayRecord = history.find(h => h.date === todayStr);
                if (!todayRecord) {
                    todayRecord = {
                        date: todayStr,
                        sessions: 0,
                        pageviews: 0,
                        unique_visitors: 0,
                        phone_clicks: 0,
                        whatsapp_clicks: 0,
                        social_clicks: 0
                    };
                    history.push(todayRecord);
                }
                if (eventType === 'pageview') {
                    todayRecord.pageviews = (todayRecord.pageviews || 0) + 1;
                    if (!sessionStorage.getItem('hilal_session_counted')) {
                        todayRecord.sessions = (todayRecord.sessions || 0) + 1;
                        todayRecord.unique_visitors = (todayRecord.unique_visitors || 0) + 1;
                        sessionStorage.setItem('hilal_session_counted', '1');
                    }
                } else if (eventType === 'click_phone') {
                    todayRecord.phone_clicks = (todayRecord.phone_clicks || 0) + 1;
                } else if (eventType === 'click_whatsapp') {
                    todayRecord.whatsapp_clicks = (todayRecord.whatsapp_clicks || 0) + 1;
                } else if (eventType === 'click_instagram' || eventType === 'click_facebook') {
                    todayRecord.social_clicks = (todayRecord.social_clicks || 0) + 1;
                }
                localStorage.setItem('hilal_analytics_daily_history', JSON.stringify(history));
            }
        } catch (e) { }
    }

    // Interaction Click Listeners
    function initClickListeners() {
        document.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href') || '';
            const location = getButtonLocation(link);

            if (href.startsWith('tel:')) {
                recordEvent('click_phone', location);
            } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
                recordEvent('click_whatsapp', location);
            } else if (href.includes('instagram.com')) {
                recordEvent('click_instagram', location);
            } else if (href.includes('facebook.com')) {
                recordEvent('click_facebook', location);
            }
        }, { passive: true });
    }

    // Public API & External Hook
    window.HilalAnalytics = {
        trackEvent: function (type, pageName, location) {
            const eventType = (type === 'phone') ? 'click_phone' : (type === 'whatsapp' ? 'click_whatsapp' : 'pageview');
            recordEvent(eventType, location || 'manual');
        },
        trackExternalEvent: function (eventName, eventParams) {
            dispatchExternalAnalytics(eventName, eventParams);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            recordEvent('pageview', 'sayfa_ici');
            initClickListeners();
        });
    } else {
        recordEvent('pageview', 'sayfa_ici');
        initClickListeners();
    }
})();
