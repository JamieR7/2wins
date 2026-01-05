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

// Celebration function with fireworks and sound
function celebrate() {
    const timer = document.getElementById('timer');
    timer.textContent = "🎉 Time's up! Great work! 🎉";
    timer.style.background = '#fbba07';
    timer.style.color = '#004587';
    timer.style.animation = 'pulse 0.5s ease-in-out 3';
    
    // Play celebration sound
    const celebrationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVKzn77BdGAg+ltzykHEeBSuBzvLaiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUxh9Hz04IzBh5uwO/jmUgND1Ss5++wXRgIPpbS8pBxHgUrgc7y2ok3CBlou+3nn00QDFCn4/C2YxwGOJLX8sx5LAUkd8fw3ZBACha=');
    celebrationSound.play().catch(() => console.log('Sound autoplay blocked'));
    
    // Fireworks animation
    createFireworks();
}

// Confetti/Fireworks effect
function createFireworks() {
    const colors = ['#fbba07', '#004587', '#e73037', '#00ff00', '#ff00ff'];
    const fireworksContainer = document.createElement('div');
    fireworksContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(fireworksContainer);
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: explode 1s ease-out forwards;
            `;
            fireworksContainer.appendChild(firework);
            
            setTimeout(() => firework.remove(), 1000);
        }, i * 30);
    }
    
    setTimeout(() => fireworksContainer.remove(), 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    @keyframes explode {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0); opacity: 0; }
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
