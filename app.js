let timeRemaining;
let timerInterval;

document.getElementById('startBtn').addEventListener('click', function() {
    const selectedMinutes = parseInt(document.getElementById('studyTime').value);
    timeRemaining = selectedMinutes * 60;
    
    document.getElementById('timeSelector').classList.add('hidden');
    document.getElementById('timer').classList.add('active');
    document.getElementById('studySection').classList.add('active');
    document.getElementById('reflectionSection').classList.add('active');
    
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
});

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `Study Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeRemaining === 0) {
        clearInterval(timerInterval);
        document.getElementById('timer').textContent = "Time's up! 🎯 Complete your reflection below";
        document.getElementById('timer').style.background = '#e73037';
        document.getElementById('timer').style.color = '#fff';
    } else {
        timeRemaining--;
    }
}

document.getElementById('musicSelect').addEventListener('change', function() {
    const selectedMusic = this.value;
    const musicPlayer = document.getElementById('musicPlayer');
    const musicSource = document.getElementById('musicSource');
    
    if (selectedMusic) {
        musicSource.src = selectedMusic;
        musicPlayer.style.display = 'block';
        musicPlayer.load();
        musicPlayer.play();
    } else {
        musicPlayer.pause();
        musicPlayer.style.display = 'none';
    }
});

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

// ✨ GOOGLE FORM SUBMISSION - YOUR ACTUAL FORM
document.getElementById('submitBtn').addEventListener('click', function() {
    const formId = '1FAIpQLSe_2hMaMoZOeQ87kCiDX2jxJVdIOMF76I6fBv8rjYs3Myw6yw';
    const formBaseUrl = `https://docs.google.com/forms/d/e/${formId}/viewform`;
    
    // Your exact entry IDs from the pre-filled link
    const params = new URLSearchParams({
        'entry.2075252850': selections.win1.name,        // Win #1 Concept
        'entry.351109808': selections.win1.unit,         // Win #1 Unit Code
        'entry.579376535': selections.win2.name,         // Win #2 Concept
        'entry.1883229741': selections.win2.unit,        // Win #2 Unit Code
        'entry.2069504899': selections.wobble.name,      // Wobble Concept
        'entry.342149039': selections.wobble.unit        // Wobble Unit Code
    });
    
    window.open(formBaseUrl + '?' + params.toString(), '_blank');
});
