/*!
 * Item: Kitzu – Personal Portfolio Template
 * Custom JS – Animations, Section Hooks & Enhancements
 */
!function(n) {
  "use strict";

  n(document).ready(function () {

    /* ============================================================
       1. SECTION OPEN / CLOSE – animation class management
       When a nav link opens a lightbox, add .section-opened to the
       wrapper after the overlay animation completes (~700ms).
       CSS @keyframes on .section-opened children play staggered.
    ============================================================ */
    var openTimers = {};

    function triggerSectionOpen(sectionId) {
      var $section = n('#' + sectionId);
      if (!$section.length) return;

      // Remove class first to force animation replay on reopen
      $section.removeClass('section-opened');
      // Void layout to ensure browser registers the removal
      void $section[0].offsetWidth;

      if (openTimers[sectionId]) {
        clearTimeout(openTimers[sectionId]);
      }
      // Delay matches overlay animation (~1s) so children animate
      // in after the section is visible
      openTimers[sectionId] = setTimeout(function () {
        $section.addClass('section-opened');
      }, 700);
    }

    function triggerSectionClose(sectionId) {
      if (openTimers[sectionId]) {
        clearTimeout(openTimers[sectionId]);
        delete openTimers[sectionId];
      }
      n('#' + sectionId).removeClass('section-opened');
    }

    // Hook into nav link clicks
    n('.navbar .navbar-nav .nav-link[href^="#"]').on('click', function () {
      var targetId = n(this).attr('href').replace('#', '');
      // Close animations on all other sections
      n('.lightbox-wrapper').each(function () {
        if (this.id !== targetId) {
          triggerSectionClose(this.id);
        }
      });
      triggerSectionOpen(targetId);
    });

    // Hook into lightbox close buttons
    n(document).on('click', '[data-modal-close]', function () {
      var sectionId = n(this).closest('.lightbox-wrapper').attr('id');
      if (sectionId) triggerSectionClose(sectionId);
    });

    // Close on outside click (mirrors main.js mouseup handler)
    n(document).on('mouseup', function (e) {
      n('.lightbox-wrapper:visible').each(function () {
        var $wrapper = n(this);
        if (!$wrapper.is(e.target) && $wrapper.has(e.target).length === 0) {
          triggerSectionClose($wrapper.attr('id'));
        }
      });
    });

    /* ============================================================
       2. SKILL BARS – re-animate when Resume section re-opens
    ============================================================ */
    n('.navbar .navbar-nav .nav-link[href="#resume"]').on('click', function () {
      setTimeout(function () {
        n('#resume .skills-section .single-skill').each(function () {
          var pct = Math.min(100, Math.max(0, n(this).data('percentage')));
          var $bar = n(this).find('.progress-bar');
          $bar.css('width', '0%');
          setTimeout(function () {
            $bar.css('width', pct + '%');
          }, 200);
        });
      }, 900);
    });

    /* ============================================================
       3. NAVBAR – add .scrolled class for tinted background
          (body overflow:hidden so window scroll won't fire;
           listen to lightbox scroll instead)
    ============================================================ */
    n('.lightbox-wrapper').on('scroll', function () {
      if (n(this).scrollTop() > 50) {
        n('#navbar').addClass('scrolled');
      } else {
        n('#navbar').removeClass('scrolled');
      }
    });

    /* ============================================================
       4. SIMPLEBAR scroll events for navbar tint
    ============================================================ */
    // SimpleBar overrides scrolling; watch its content wrapper
    setTimeout(function () {
      n('.simplebar-content-wrapper').on('scroll', function () {
        if (n(this).scrollTop() > 60) {
          n('#navbar').addClass('scrolled');
        } else {
          n('#navbar').removeClass('scrolled');
        }
      });
    }, 1000);

    /* ============================================================
       5. LANGUAGE SWITCHER – EN / BN
    ============================================================ */
    var translations = {
      en: {
        nav: { about: 'About', resume: 'Resume', portfolio: 'Portfolio', blog: 'Blog', contact: 'Contact' },
        words: ['Developer', 'Designer', 'Freelancer']
      },
      bn: {
        nav: { about: 'সম্পর্কে', resume: 'জীবনবৃত্তান্ত', portfolio: 'পোর্টফোলিও', blog: 'ব্লগ', contact: 'যোগাযোগ' },
        words: ['ডেভেলপার', 'ডিজাইনার', 'ফ্রিল্যান্সার']
      }
    };

    function applyLang(lang) {
      var t = translations[lang];
      if (!t) return;

      // Update nav labels
      n('.navbar .navbar-nav .nav-link[href="#about"]').text(t.nav.about);
      n('.navbar .navbar-nav .nav-link[href="#resume"]').text(t.nav.resume);
      n('.navbar .navbar-nav .nav-link[href="#portfolio"]').text(t.nav.portfolio);
      n('.navbar .navbar-nav .nav-link[href="#blog"]').text(t.nav.blog);
      n('.navbar .navbar-nav .nav-link[href="#contact"]').text(t.nav.contact);

      // Update cd-words (animated typing words)
      n('.cd-words-wrapper b').each(function (i) {
        if (t.words[i] !== undefined) {
          n(this).text(t.words[i]);
        }
      });

      // Toggle active state on buttons
      n('.lang-btn').removeClass('lang-active');
      n('.lang-btn[data-lang="' + lang + '"]').addClass('lang-active');

      // Persist choice
      try { localStorage.setItem('portfolio-lang', lang); } catch (e) {}
    }

    // Apply saved language on load
    var savedLang = 'en';
    try { savedLang = localStorage.getItem('portfolio-lang') || 'en'; } catch (e) {}
    applyLang(savedLang);

    // Handle language button clicks
    n(document).on('click', '.lang-btn', function (e) {
      e.preventDefault();
      applyLang(n(this).data('lang'));
    });

  });

  n(window).on('load', function () {
    // Nothing extra needed – preloader handled by main.js
  });

}(jQuery);
