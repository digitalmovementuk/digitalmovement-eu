/* Climate Select, redesign prototype script.
   Progressive enhancement: pages work without it. */
(function () {
  'use strict';

  var root = document.documentElement;

  // Mobile navigation
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-nav]');
  if (toggle && panel) {
    var setOpen = function (open) {
      panel.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Enquiry forms: validate in the browser, then show a success state.
  // Prototype only: nothing is sent yet. Connect the form action to a
  // real handler before launch.
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstInvalid = null;

      form.querySelectorAll('[data-required]').forEach(function (field) {
        var input = field.querySelector('input, select, textarea');
        var valid = input.type === 'checkbox'
          ? input.checked
          : input.value.trim() !== '' && input.checkValidity();

        field.toggleAttribute('data-invalid', !valid);
        input.setAttribute('aria-invalid', String(!valid));
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      form.classList.add('is-sent');
      var message = form.querySelector('.form-success');
      if (message) message.focus();
    });
  });

  // Gallery filters
  var filters = document.querySelectorAll('[data-filter]');
  if (filters.length) {
    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        var category = button.getAttribute('data-filter');
        filters.forEach(function (other) {
          other.setAttribute('aria-pressed', String(other === button));
        });
        document.querySelectorAll('[data-category]').forEach(function (item) {
          item.hidden = category !== 'all' && item.getAttribute('data-category') !== category;
        });
      });
    });
  }

  // Reveal on scroll
  var revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealItems.length) {
    root.classList.add('js');
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(function (item) { observer.observe(item); });
  }
})();
