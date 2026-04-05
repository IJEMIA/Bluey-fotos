// --- BASE DE DATOS CON NOMBRES EXACTOS DE TUS ARCHIVOS ---
// He borrado los personajes que no tenían imagen en tu captura (Bandit, Chilli)
// para evitar errores.

const characterDB = {
    bluey: [
        { name: 'Bluey', size: 'kid', url: 'bluey-bluey.png' },
        { name: 'Bingo', size: 'kid', url: 'bluey-bingoesss.png' } // Nombre corregido según tu captura
    ],
    familia: [
        { name: 'Rad', size: 'dad', url: 'bluey-rad.png' },
        { name: 'Stripe', size: 'dad', url: 'bluey-stripe.png' },
        { name: 'Trixie', size: 'mom', url: 'bluey-trixie.png' }
    ],
    amigos: [
        { name: 'Coco', size: 'kid', url: 'bluey-coco.png' },
        { name: 'Indy', size: 'kid', url: 'bluey-indy.png' },
        { name: 'Mackenzie', size: 'kid', url: 'bluey-mackenz.png' }, // Nombre corregido
        { name: 'Rusty', size: 'kid', url: 'bluey-rusty.png' },
        { name: 'Snickers', size: 'kid', url: 'bluey-snakers.png' }, // Nombre corregido
        { name: 'Winton', size: 'kid', url: 'bluey-winton.png' }
    ],
    bebes: [
        { name: 'Socks', size: 'baby', url: 'bluey-socks.png' },
        { name: 'Muffin', size: 'baby', url: 'muffins.png' } // Nombre corregido
    ],
    mythic: [
        // Usamos una imagen extra que vi en tu lista para los especiales
        { name: 'Bluey Feliz', size: 'kid', url: 'bluey-bluey-dance.png' } 
    ]
};

const waitTimes = { bluey: 8, familia: 12, amigos: 15, bebes: 18, mythic: 25 };
let isHatching = false;

// --- SISTEMA DE AUDIO ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let isPlaying = false;

function toggleMusic() {
    const btn = document.getElementById('music-btn');
    if(isPlaying) {
        isPlaying = false; btn.innerText = '🔇'; btn.classList.remove('playing');
    } else {
        if(!audioCtx) audioCtx = new AudioContext();
        isPlaying = true; btn.innerText = '🔊'; btn.classList.add('playing');
        playMelody();
    }
}

function playMelody() {
    if(!isPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [523, 587, 659, 698, 784, 698, 659, 587]; 
    notes.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle'; osc.frequency.value = f;
        g.gain.setValueAtTime(0.1, now + i*0.25);
        g.gain.linearRampToValueAtTime(0, now + i*0.25 + 0.2);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(now + i*0.25); osc.stop(now + i*0.25 + 0.25);
    });
    setTimeout(playMelody, notes.length * 250 + 500);
}

// --- LÓGICA DE JUEGO ---

function startHatching(type) {
    if(isHatching) return;
    isHatching = true;
    
    document.querySelectorAll('.egg-btn').forEach(b => b.disabled = true);

    const overlay = document.getElementById('modal-overlay');
    const timer = document.getElementById('countdown-display');
    overlay.classList.add('active');

    let t = waitTimes[type];
    timer.innerText = t;

    const interval = setInterval(() => {
        t--;
        timer.innerText = t;
        if(t <= 0) {
            clearInterval(interval);
            hatchCharacter(type);
        }
    }, 1000);
}

function hatchCharacter(type) {
    const pool = characterDB[type];
    const randomChar = pool[Math.floor(Math.random() * pool.length)];
    
    document.getElementById('modal-overlay').classList.remove('active');
    addToGarden(randomChar);

    document.querySelectorAll('.egg-btn').forEach(b => b.disabled = false);
    isHatching = false;
}

function addToGarden(charData) {
    const container = document.getElementById('garden-container');
    const img = document.createElement('img');
    
    img.src = charData.url;
    img.className = 'character spawning';
    img.setAttribute('data-name', charData.name);
    
    if(charData.size === 'dad') img.classList.add('char-dad');
    if(charData.size === 'mom') img.classList.add('char-mom');
    if(charData.size === 'baby') img.classList.add('char-baby');

    const rect = container.getBoundingClientRect();
    const w = rect.width - 100;
    const h = rect.height - 100;
    const startX = Math.random() * w;
    const startY = Math.random() * h;

    img.style.left = startX + 'px';
    img.style.top = startY + 'px';

    container.appendChild(img);

    setTimeout(() => {
        img.classList.remove('spawning');
        moveCharacter(img);
    }, 500);
}

function moveCharacter(el) {
    if(!el.parentNode) return;

    const container = document.getElementById('garden-container');
    const rect = container.getBoundingClientRect();
    
    const elRect = el.getBoundingClientRect();
    const w = rect.width - elRect.width;
    const h = rect.height - elRect.height;

    const newX = Math.random() * w;
    const newY = Math.random() * h;

    const currentX = parseFloat(el.style.left);
    if(newX > currentX) el.style.transform = 'scaleX(1)';
    else el.style.transform = 'scaleX(-1)';

    el.style.left = newX + 'px';
    el.style.top = newY + 'px';

    setTimeout(() => moveCharacter(el), 3000 + Math.random()*2000);
}
