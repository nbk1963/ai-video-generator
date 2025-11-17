const startBtn = document.getElementById('startBtn');
const generationModal = document.getElementById('generationModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const videoForm = document.getElementById('videoForm');
const videoPrompt = document.getElementById('videoPrompt');
const promptCards = document.querySelectorAll('.prompt-card');

// Open modal
startBtn.addEventListener('click', () => {
    generationModal.style.display = 'flex';
});

// Close modal
closeModal.addEventListener('click', () => {
    generationModal.style.display = 'none';
});
cancelBtn.addEventListener('click', () => {
    generationModal.style.display = 'none';
});

// Click outside -> close
window.addEventListener('click', (e) => {
    if (e.target === generationModal) {
        generationModal.style.display = 'none';
    }
});

// Handle form submit
videoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const prompt = videoPrompt.value;
    const quality = document.getElementById('videoQuality').value;
    const style = document.getElementById('videoStyle').value;
    const duration = document.getElementById('videoDuration').value;

    alert(`Video Started!\nPrompt: ${prompt}\nQuality: ${quality}\nStyle: ${style}\nDuration: ${duration}`);

    generationModal.style.display = 'none';
    videoForm.reset();
});

// Autofill prompt on card click
promptCards.forEach(card => {
    card.addEventListener('click', () => {
        videoPrompt.value = card.getAttribute('data-prompt');
        generationModal.style.display = 'flex';
    });
});
