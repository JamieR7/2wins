let endTime;
let timerInterval;

// Timer functionality with background tab support
document.getElementById('startBtn').addEventListener('click', function() {
    const selectedMinutes = parseInt(document.getElementById('studyTime').value);
    endTime = Date.now() + (selectedMinutes * 60 * 1000); // Calculate end time
    
    document.getElementById('timeSelector').classList.add('hidden');
    document.getElementById('timer').classList.add('active');
    document.getElementById('studySection').classList.add('active');
    document.getElementById('reflectionSection').classList.add('active');
    
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
});

function updateTimer() {
    const timeRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `Study Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeRemaining === 0) {
        clearInterval(timerInterval);
        celebrate();
    }
}

// Celebration function with extended fireworks and fanfare
function celebrate() {
    const timer = document.getElementById('timer');
    timer.textContent = "🎉 Time's up! Great work! 🎉";
    timer.style.background = '#fbba07';
    timer.style.color = '#004587';
    timer.style.animation = 'pulse 0.5s ease-in-out infinite';
    
    // Play triumphant fanfare
    playFanfare();
    
    // 1 minute of continuous fireworks
    createFireworks(60000); // 60 seconds = 60,000 milliseconds
    
    // Stop pulse animation after 1 minute
    setTimeout(() => {
        timer.style.animation = 'none';
    }, 60000);
}

// Epic fanfare sound using Web Audio API
function playFanfare() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Triumphant melody notes (frequencies in Hz)
    const melody = [
        { freq: 523.25, start: 0, duration: 0.2 },    // C5
        { freq: 659.25, start: 0.2, duration: 0.2 },  // E5
        { freq: 783.99, start: 0.4, duration: 0.2 },  // G5
        { freq: 1046.50, start: 0.6, duration: 0.4 }, // C6 (hold)
        { freq: 987.77, start: 1.0, duration: 0.15 }, // B5
        { freq: 1046.50, start: 1.15, duration: 0.15 },// C6
        { freq: 1174.66, start: 1.3, duration: 0.3 }, // D6
        { freq: 1046.50, start: 1.6, duration: 0.6 }, // C6 (finale hold)
    ];
    
    melody.forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'triangle'; // Softer, more musical sound
        
        // Envelope for smooth attack and release
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now + note.start);
        gainNode.gain.linearRampToValueAtTime(0.3, now + note.start + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.2, now + note.start + note.duration - 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + note.start + note.duration);
        
        oscillator.start(now + note.start);
        oscillator.stop(now + note.start + note.duration);
    });
}

// Massive continuous fireworks for 1 minute
function createFireworks(duration) {
    const colors = ['#fbba07', '#004587', '#e73037', '#00ff00', '#ff00ff', '#00ffff', '#ff6b35', '#f7931e'];
    const fireworksContainer = document.createElement('div');
    fireworksContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(fireworksContainer);
    
    let elapsed = 0;
    const interval = setInterval(() => {
        // Launch multiple firework bursts
        for (let burst = 0; burst < 3; burst++) {
            setTimeout(() => {
                launchFirework(fireworksContainer, colors);
            }, burst * 100);
        }
        
        elapsed += 200;
        if (elapsed >= duration) {
            clearInterval(interval);
            setTimeout(() => fireworksContainer.remove(), 2000);
        }
    }, 200); // New fireworks every 200ms
}

function launchFirework(container, colors) {
    const launchX = Math.random() * 100;
    const launchY = 20 + Math.random() * 60; // Launch from top half of screen
    const burstColor = colors[Math.floor(Math.random() * colors.length)];
    const particleCount = 30 + Math.floor(Math.random() * 20); // 30-50 particles per burst
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 100 + Math.random() * 100;
        const deltaX = Math.cos(angle) * velocity;
        const deltaY = Math.sin(angle) * velocity;
        const size = 4 + Math.random() * 6;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${burstColor};
            border-radius: 50%;
            left: ${launchX}%;
            top: ${launchY}%;
            box-shadow: 0 0 ${size * 2}px ${burstColor};
            animation: explode${Math.random()} 1.5s ease-out forwards;
        `;
        
        // Unique animation for each particle
        const animationName = `explode${Math.random().toString(36).substr(2, 9)}`;
        const keyframes = `
            @keyframes ${animationName} {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(${deltaX}px, ${deltaY}px) scale(0); opacity: 0; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        particle.style.animation = `${animationName} 1.5s ease-out forwards`;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            styleSheet.remove();
        }, 1500);
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Music player
document.getElementById('musicSelect').addEventListener('change', function() {
    const selectedMusic = this.value;
    const musicPlayer = document.getElementById('musicPlayer');
    const musicSource = document.getElementById('musicSource');
    
    if (selectedMusic) {
        musicSource.src = selectedMusic;
        musicPlayer.style.display = 'block';
        musicPlayer.load();
        
        musicPlayer.play().catch(function(error) {
            console.log("Auto-play blocked - user needs to click play button");
        });
    } else {
        musicPlayer.pause();
        musicPlayer.style.display = 'none';
    }
});

// Reflection autocomplete
const selections = { win1: null, win2: null, wobble: null };

function setupAutocomplete(inputId, resultsId, selectedId, key) {
    const input = document.getElementById(inputId);
    const resultsDiv = document.getElementById(resultsId);
    const selectedDiv = document.getElementById(selectedId);

    input.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        resultsDiv.innerHTML = '';
        
        if (query.length < 2) return;

        const matches = sehsConcepts.filter(concept => 
            concept.name.toLowerCase().includes(query) ||
            concept.unit.toLowerCase().includes(query) ||
            concept.topic.toLowerCase().includes(query)
        );

        matches.slice(0, 8).forEach(function(concept) {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.innerHTML = '<strong>' + concept.name + '</strong><div class="concept-unit">Unit ' + concept.unit + ': ' + concept.topic + '</div>';
            
            item.addEventListener('click', function() {
                selections[key] = concept;
                input.value = '';
                resultsDiv.innerHTML = '';
                selectedDiv.innerHTML = '<div class="selected-concept">✓ ' + concept.name + ' (' + concept.unit + ')</div>';
                checkSubmitReady();
            });
            resultsDiv.appendChild(item);
        });
    });
}

setupAutocomplete('win1Input', 'win1Results', 'win1Selected', 'win1');
setupAutocomplete('win2Input', 'win2Results', 'win2Selected', 'win2');
setupAutocomplete('wobbleInput', 'wobbleResults', 'wobbleSelected', 'wobble');

function checkSubmitReady() {
    if (selections.win1 && selections.win2 && selections.wobble) {
        document.getElementById('submitBtn').disabled = false;
    }
}

// Google Form submission
document.getElementById('submitBtn').addEventListener('click', function() {
    const formId = '1FAIpQLSe_2hMaMoZOeQ87kCiDX2jxJVdIOMF76I6fBv8rjYs3Myw6yw';
    const formBaseUrl = `https://docs.google.com/forms/d/e/${formId}/viewform`;
    
    const params = new URLSearchParams({
        'entry.2075252850': selections.win1.name,
        'entry.351109808': selections.win1.unit,
        'entry.579376535': selections.win2.name,
        'entry.1883229741': selections.win2.unit,
        'entry.2069504899': selections.wobble.name,
        'entry.342149039': selections.wobble.unit
    });
    
    window.open(formBaseUrl + '?' + params.toString(), '_blank');
});
