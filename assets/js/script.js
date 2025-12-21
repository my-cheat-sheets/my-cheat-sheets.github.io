document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');



  function addExpandCollapseButtons() {
    const h1 = content.querySelector('h1');
    if (!h1 || content.querySelector('.expand-collapse-bar')) return;
    
    const bar = document.createElement('div');
    bar.className = 'expand-collapse-bar';
    bar.innerHTML = `<button data-action="expand-all">Expand All</button>
                     <button data-action="collapse-all">Collapse All</button>`;
    
    bar.onclick = (e) => {
      const action = e.target.dataset.action;
      if (action) {
        content.querySelectorAll('details').forEach(d => d.open = action === 'expand-all');
      }
    };
    
    h1.insertAdjacentElement('afterend', bar);
  }






  // Load cheatsheet - simplified
  function loadCheat(name, category) {
    fetch(`cheats/${category}/${name}.html`)
      .then(res => res.ok ? res.text() : Promise.reject(`HTTP ${res.status}`))
      .then(html => {
        content.innerHTML = html;
        addCopyButtons();
        addExpandCollapseButtons();
      })
      .catch(err => {
        content.innerHTML = `<p style="color:red">Could not load: ${name} (${category})</p>`;
        console.error('Fetch error:', err);
      });
  }

  function parseHashParams() {
    const params = {};
    window.location.hash.substring(1).split('&').forEach(part => {
      const [key, val] = part.split('=');
      if (key) params[key] = decodeURIComponent(val || '');
    });
    return params;
  }

  // Handle hash navigation - simplified
  function handleHash() {
    const params = parseHashParams();
    if (params.cheat) {
      loadCheat(params.cheat, params.category || 'languages');
    } else if (!content.querySelector('.landing-page')) {
      content.innerHTML = `<div class="welcome">
        <h1>Welcome to Cheatsheets Hub</h1>
        <p>Select a options from the menu to view cheatsheets.</p>
        <p>For example, select "Python" from the "Languages" menu to view the Python cheatsheet.</p>
        <br>
        <br>
        <p>click here to go to home page. <a style="color:blue; text-decoration:underline;" href="/">Home</a></p>
      </div>`;
    }
    addCopyButtons();
    addExpandCollapseButtons();
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // Theme toggle - simplified with safety check
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = '☀️';
  }
  
  if (themeToggle) {
    themeToggle.onclick = () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
    };
  }




  // ===== COPY BUTTON LOGIC =====
  const copyToClipboard = async (text) => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const textArea = Object.assign(document.createElement('textarea'), {
      value: text,
      style: 'position:fixed;opacity:0;'
    });
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const createCopyButton = (container) => {
    try {
      if (!container || container.querySelector('.copy-btn')) return;
      
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = '📋';
      
      const getCodeText = () => {
        const code = container.querySelector('code');
        return code?.innerText || container.innerText || container.textContent || '';
      };

      btn.onclick = async (e) => {
        e.stopPropagation();
        try {
          await copyToClipboard(getCodeText());
          btn.textContent = '✓';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = '📋';
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          btn.textContent = '✗';
          setTimeout(() => btn.textContent = '📋', 2000);
        }
      };
      
      container.appendChild(btn);
    } catch (err) {
      console.warn('Failed to add copy button:', err);
    }
  };

  function addCopyButtons() {
    try {
      // Support both <pre> and standalone <code> tags (pre is optional)
      // Add buttons to all <pre> elements
      document.querySelectorAll('pre').forEach(createCopyButton);
      
      // Add buttons to standalone <code> elements (not inside <pre>)
      document.querySelectorAll('code').forEach(code => {
        // Only process if not inside a <pre> element
        if (code && !code.closest('pre')) {
          createCopyButton(code);
        }
      });
    } catch (err) {
      console.error('Error adding copy buttons:', err);
    }
  }

  
  // Mobile nav toggle - simplified with safety check
  if (menuToggle && navMenu) {
    menuToggle.onclick = () => navMenu.classList.toggle('show');
  }

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Check if access key is set
    const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
    if (accessKeyInput && accessKeyInput.value === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      console.warn('Web3Forms access key not configured. Please get your key from https://web3forms.com');
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      const statusDiv = document.getElementById('form-status');
      
      // Validate access key
      if (accessKeyInput && accessKeyInput.value === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        statusDiv.className = 'form-status error';
        statusDiv.textContent = 'Please configure your Web3Forms access key. See instructions in the HTML comments.';
        statusDiv.style.display = 'block';
        return;
      }
      
      // Disable button and show loading
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline';
      statusDiv.style.display = 'none';
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Add page URL for tracking
      formData.append('from_url', window.location.href);
      
      try {
        // Submit to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Success
          statusDiv.className = 'form-status success';
          statusDiv.textContent = '✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon!';
          statusDiv.style.display = 'block';
          contactForm.reset();
          
          // Scroll to status message
          statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (error) {
        // Error
        statusDiv.className = 'form-status error';
        statusDiv.textContent = '❌ Sorry, there was an error sending your message. Please check your Web3Forms access key or try again later.';
        statusDiv.style.display = 'block';
        console.error('Form submission error:', error);
        
        // Scroll to error message
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
      }
    });
  }
});
