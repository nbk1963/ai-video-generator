// Basic frontend behavior: modal, prompts, theme toggle, pseudo-generation
document.addEventListener('DOMContentLoaded', ()=> {
  const modal = document.getElementById('generatorModal');
  const openBtn = document.getElementById('openGenerator');
  const closeBtn = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelGen');
  const form = document.getElementById('generateForm');
  const status = document.getElementById('generateStatus');
  const promptCards = document.querySelectorAll('.prompt-card');
  const themeToggle = document.getElementById('themeToggle');

  // Open modal
  if(openBtn) openBtn.addEventListener('click', ()=> modal.style.display='flex');
  if(closeBtn) closeBtn.addEventListener('click', ()=> modal.style.display='none');
  if(cancelBtn) cancelBtn.addEventListener('click', ()=> modal.style.display='none');

  // Click outside closes
  window.addEventListener('click', e => {
    if(e.target === modal) modal.style.display='none';
  });

  // Prefill from prompt cards
  promptCards.forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const p = btn.getAttribute('data-prompt');
      document.getElementById('prompt').value = p;
      modal.style.display = 'flex';
      window.scrollTo({top:0, behavior:'smooth'});
    });
  });

  // Theme toggle (persist)
  const saved = localStorage.getItem('theme');
  if(saved === 'dark') document.body.classList.add('dark');

  themeToggle && themeToggle.addEventListener('click', ()=> {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Form submit -> pseudo generation flow
  form && form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    status.textContent = '';
    const prompt = document.getElementById('prompt').value.trim();
    const quality = document.getElementById('quality').value;
    const style = document.getElementById('style').value;
    const duration = document.getElementById('duration').value;

    if(!prompt){
      status.textContent = 'Please enter a prompt.';
      return;
    }

    // Show working message
    status.textContent = 'Sending job to model… (demo mode)';

    // ---- REAL IMPLEMENTATION NOTE ----
    // Replace the fetch below with your backend endpoint, e.g.:
    // const res = await fetch('/api/generate', { method:'POST', body: JSON.stringify({ prompt, quality, style, duration }), headers:{'Content-Type':'application/json'} });
    // const job = await res.json();
    // then poll job.status or receive a websocket to stream results.
    // For demo we simulate delay then show sample video.

    await new Promise(r => setTimeout(r, 2800)); // simulate processing

    // display sample video in hero preview
    const heroPreview = document.getElementById('heroPreview');
    if(heroPreview){
      heroPreview.innerHTML = `<video controls width="100%"><source src="../assets/sample-video.mp4" type="video/mp4">Your browser doesn't support the video tag.</video>`;
    }

    status.innerHTML = 'Video ready (demo). Replace the demo flow with your backend API to generate real videos.';
    modal.style.display = 'none';
    form.reset();
  });
});
