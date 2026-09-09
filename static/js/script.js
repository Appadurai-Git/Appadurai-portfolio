document.getElementById('year').textContent = new Date().getFullYear();

/* mobile nav toggle */
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    var open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '58px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = '#141B29';
    nav.style.padding = '16px 24px';
    nav.style.borderBottom = '1px solid #253044';
    toggle.setAttribute('aria-expanded', String(!open));
  });
})();

/* hero console typing effect */
(function () {
  var target = document.getElementById('consoleCode');
  if (!target) return;

  var lines = [
    'SELECT category, tool FROM skills',
    'WHERE stack = \'backend\' OR stack = \'data\';',
    '',
    '-- category   | tool',
    'backend       | Python, Django, REST',
    'database      | MySQL, SQLite',
    'data_analysis | Power BI, Pandas, NumPy',
    'tools         | Git, Postman, VS Code',
    '',
    '4 categories returned.'
  ];
  var full = lines.join('\n');
  var i = 0;
  var speed = 14;

  function typeNext() {
    if (i <= full.length) {
      target.textContent = full.slice(0, i);
      i += 1;
      var jitter = Math.random() < 0.06 ? 90 : 0;
      setTimeout(typeNext, speed + jitter);
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.textContent = full;
  } else {
    typeNext();
  }
})();

/* contact form */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');
  var fields = ['name', 'email', 'message'];

  function clearErrors() {
    fields.forEach(function (f) {
      document.getElementById(f + 'Error').textContent = '';
    });
    status.textContent = '';
    status.classList.remove('is-error');
  }

  function validateClient() {
    var ok = true;
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (name.length < 2) {
      document.getElementById('nameError').textContent = 'Enter your full name.';
      ok = false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      document.getElementById('emailError').textContent = 'Enter a valid email address.';
      ok = false;
    }
    if (message.length < 10) {
      document.getElementById('messageError').textContent = 'Message should be at least 10 characters.';
      ok = false;
    }
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    if (!validateClient()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
      })
    })
      .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
      .then(function (result) {
        if (result.status === 200 && result.data.ok) {
          status.textContent = result.data.message;
          status.classList.remove('is-error');
          form.reset();
        } else {
          var errs = result.data.errors || {};
          Object.keys(errs).forEach(function (k) {
            var el = document.getElementById(k + 'Error');
            if (el) el.textContent = errs[k];
          });
          status.textContent = 'Please fix the errors above.';
          status.classList.add('is-error');
        }
      })
      .catch(function () {
        status.textContent = 'Could not send right now — email me directly instead.';
        status.classList.add('is-error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      });
  });
})();
