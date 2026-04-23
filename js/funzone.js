/* ===== Fun Zone JavaScript Features ===== */

// ===== 1. Mood Picker =====
const moodData = {
    happy: {
        emoji: '🙂',
        title: 'Feeling Happy!',
        message: "That's wonderful! Your positive energy is contagious. Share your happiness with others today!",
        tip: "Take a moment to journal about what's making you happy. It helps lock in these positive feelings!"
    },
    sad: {
        emoji: '😢',
        title: 'Feeling Sad',
        message: "It's okay to feel sad. Remember, this feeling is temporary and you're not alone.",
        tip: "Try listening to your favourite music or calling a friend. Small acts of self-care can help."
    },
    stressed: {
        emoji: '😟',
        title: 'Feeling Stressed',
        message: "Take a deep breath. Stress is manageable with the right tools and perspective.",
        tip: "Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7, exhale for 8. Repeat 4 times."
    },
    energetic: {
        emoji: '⚡',
        title: 'Feeling Energetic!',
        message: "Great energy! Use it wisely - channel it into something productive or exercise!",
        tip: "This is a perfect time for a workout, cleaning, or starting that project you've been putting off."
    },
    tired: {
        emoji: '😴',
        title: 'Feeling Tired',
        message: "Your body is asking for rest. Listen to it - quality rest is essential for mental health.",
        tip: "Try a 20-minute power nap or practice gentle stretching. Avoid screens for 30 minutes before bed."
    },
    anxious: {
        emoji: '😰',
        title: 'Feeling Anxious',
        message: "Anxiety is your mind's way of protecting you. Let's work through it together.",
        tip: "Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste."
    }
};

function selectMood(mood) {
    const data = moodData[mood];
    const result = document.getElementById('moodResult');
    
    // Update mood button states
    document.querySelectorAll('.mood-btn-fun').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === mood);
    });
    
    // Show result
    result.style.display = 'block';
    result.style.animation = 'fadeInUp 0.5s ease';
    
    document.querySelector('#moodResult .mood-result-icon').textContent = data.emoji;
    document.getElementById('moodTitle').textContent = data.title;
    document.getElementById('moodMessage').textContent = data.message;
    document.getElementById('moodTip').textContent = data.tip;
    
    // Save mood to cookie
    saveMoodEntry(mood);
    
    // Scroll to result
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== 2. Motivation Generator =====
const motivations = [
    { text: "Your mental health is a priority. Your feelings are valid.", author: "MindfulPath" },
    { text: "Every day is a fresh start. Don't let yesterday define today.", author: "Unknown" },
    { text: "You are stronger than you think and braver than you believe.", author: "C.S. Lewis" },
    { text: "Progress, not perfection. Every small step counts.", author: "MindfulPath" },
    { text: "It's okay to not be okay as long as you don't give up.", author: "Unknown" },
    { text: "Your journey is unique. Don't compare your chapter 1 to someone else's chapter 20.", author: "Unknown" },
    { text: "Be patient with yourself. Self-growth is tender; it's holy ground.", author: "Stephen Covey" },
    { text: "You don't have to be positive all the time. It's okay to feel everything at once.", author: "Unknown" },
    { text: "The only way out is through. You can do this.", author: "MindfulPath" },
    { text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.", author: "Glenn Close" },
    { text: "Self-care is not selfish. You cannot pour from an empty cup.", author: "Eleanor Brown" },
    { text: "You are enough just as you are. Each emotion you feel is part of being human.", author: "Unknown" },
    { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "You are not your thoughts. You are the observer of your thoughts.", author: "Eckhart Tolle" }
];

function generateMotivation() {
    const randomIndex = Math.floor(Math.random() * motivations.length);
    const motivation = motivations[randomIndex];
    
    const textEl = document.getElementById('motivationText');
    const authorEl = document.getElementById('motivationAuthor');
    const container = document.getElementById('motivationContent');
    
    // Animate out
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        textEl.textContent = `"${motivation.text}"`;
        authorEl.textContent = `— ${motivation.author}`;
        
        // Animate in
        container.style.transition = 'all 0.4s ease';
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
    }, 300);
    
    // Save to cookie
    setCookie('lastMotivation', motivation.text, 1);
}

// ===== 3. Wellbeing Style Quiz =====
const styleQuestions = [
    {
        question: "How do you prefer to spend your free time?",
        options: [
            { text: "Quiet time alone with a book or music", type: "calm" },
            { text: "Socializing with friends or family", type: "active" },
            { text: "A mix of both depending on my mood", type: "balanced" },
            { text: "Being productive and getting things done", type: "calm" }
        ]
    },
    {
        question: "When you're stressed, what helps most?",
        options: [
            { text: "Deep breathing and meditation", type: "calm" },
            { text: "Going for a run or workout", type: "active" },
            { text: "Talking it out with someone", type: "balanced" },
            { text: "Taking a nap or sleeping it off", type: "calm" }
        ]
    },
    {
        question: "What's your ideal morning routine?",
        options: [
            { text: "Early wake-up for exercise and meditation", type: "active" },
            { text: "Slow start with coffee and quiet reflection", type: "calm" },
            { text: "Balanced mix of planning and self-care", type: "balanced" },
            { text: "Quick routine to get the day started", type: "active" }
        ]
    },
    {
        question: "How do you recharge after a long day?",
        options: [
            { text: "Solo activities like reading or gaming", type: "calm" },
            { text: "Physical activities or sports", type: "active" },
            { text: "Quality time with loved ones", type: "balanced" },
            { text: "Creative hobbies like art or music", type: "balanced" }
        ]
    }
];

const styleResults = {
    calm: {
        icon: '🌿',
        title: 'The Calm Thinker',
        desc: 'You find peace in stillness and solitude. Your mindful approach to life helps you navigate challenges with grace.',
        traits: ['Values quiet time', 'Excellent at self-reflection', 'Natural problem solver', 'Deep emotional awareness']
    },
    active: {
        icon: '⚡',
        title: 'The Active Energy',
        desc: 'You recharge through movement and activity. Your high energy and enthusiasm inspire those around you.',
        traits: ['Thrives on action', 'Natural motivator', 'Excellent physical energy', 'Loves social connections']
    },
    balanced: {
        icon: '⚖️',
        title: 'The Balanced Mind',
        desc: 'You masterfully balance activity with rest. Your adaptability makes you resilient in any situation.',
        traits: ['Flexible approach', 'Social and solo equally', 'Emotionally intelligent', 'Great at reading situations']
    }
};

let styleAnswers = [];
let currentStyleQuestion = 0;

function startStyleQuiz() {
    styleAnswers = [];
    currentStyleQuestion = 0;
    
    document.getElementById('styleQuizIntro').style.display = 'none';
    document.getElementById('styleQuizQuestions').style.display = 'block';
    document.getElementById('styleQuizResults').style.display = 'none';
    
    showStyleQuestion();
}

function showStyleQuestion() {
    const q = styleQuestions[currentStyleQuestion];
    document.getElementById('styleQuestionText').textContent = q.question;
    document.getElementById('currentStyleQ').textContent = currentStyleQuestion + 1;
    document.getElementById('quizStyleProgress').style.width = ((currentStyleQuestion) / styleQuestions.length * 100) + '%';
    
    const container = document.getElementById('styleOptionsContainer');
    container.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'style-option';
        btn.innerHTML = option.text;
        btn.onclick = () => selectStyleOption(index, option.type);
        container.appendChild(btn);
    });
    
    document.getElementById('styleNextBtn').disabled = styleAnswers[currentStyleQuestion] === undefined;
    
    if (currentStyleQuestion === styleQuestions.length - 1) {
        document.getElementById('styleNextBtn').textContent = 'See Results';
    } else {
        document.getElementById('styleNextBtn').textContent = 'Next';
    }
}

function selectStyleOption(index, type) {
    styleAnswers[currentStyleQuestion] = type;
    
    document.querySelectorAll('.style-option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === index);
    });
    
    document.getElementById('styleNextBtn').disabled = false;
}

function nextStyleQuestion() {
    if (styleAnswers[currentStyleQuestion] === undefined) {
        showToast('Please select an option', 'error');
        return;
    }
    
    if (currentStyleQuestion < styleQuestions.length - 1) {
        currentStyleQuestion++;
        showStyleQuestion();
    } else {
        showStyleResults();
    }
}

function showStyleResults() {
    // Count answers
    const counts = { calm: 0, active: 0, balanced: 0 };
    styleAnswers.forEach(a => counts[a]++);
    
    // Determine dominant type
    let dominant = 'balanced';
    let max = counts.balanced;
    
    if (counts.calm > max) { dominant = 'calm'; max = counts.calm; }
    if (counts.active > max) { dominant = 'active'; max = counts.active; }
    
    const result = styleResults[dominant];
    
    document.getElementById('styleQuizIntro').style.display = 'none';
    document.getElementById('styleQuizQuestions').style.display = 'none';
    document.getElementById('styleQuizResults').style.display = 'block';
    
    document.getElementById('styleResultIcon').textContent = result.icon;
    document.getElementById('styleResultTitle').textContent = result.title;
    document.getElementById('styleResultDesc').textContent = result.desc;
    
    const traitsList = document.getElementById('styleTraitsList');
    traitsList.innerHTML = result.traits.map(trait => `<span class="trait-badge">${trait}</span>`).join('');
    
    // Save result
    setCookie('wellbeingStyle', dominant, 30);
    
    document.getElementById('styleQuizResults').scrollIntoView({ behavior: 'smooth' });
    showToast(`Your wellbeing style: ${result.title}`, 'success');
}

function retakeStyleQuiz() {
    startStyleQuiz();
}

// ===== 4. Breathing Exercise Timer =====
let breathingInterval;
let breathingPhase = 0;
let cycleCount = 0;
let breathingSeconds = 0;
let breathingTimer;

const breathingPhases = [
    { text: 'Inhale...', duration: 4000, scale: 1.4 },
    { text: 'Hold...', duration: 4000, scale: 1.4 },
    { text: 'Exhale...', duration: 4000, scale: 0.8 }
];

function startBreathing() {
    document.getElementById('breathingStartBtn').style.display = 'none';
    document.getElementById('breathingStopBtn').style.display = 'inline-flex';
    
    cycleCount = 0;
    breathingSeconds = 0;
    breathingPhase = 0;
    
    updateBreathingDisplay();
    runBreathingCycle();
    
    // Timer for elapsed time
    breathingTimer = setInterval(() => {
        breathingSeconds++;
        const mins = Math.floor(breathingSeconds / 60);
        const secs = breathingSeconds % 60;
        document.getElementById('timeElapsed').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function runBreathingCycle() {
    const phase = breathingPhases[breathingPhase];
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    
    text.textContent = phase.text;
    circle.style.transform = `scale(${phase.scale})`;
    
    setTimeout(() => {
        breathingPhase = (breathingPhase + 1) % breathingPhases.length;
        if (breathingPhase === 0) {
            cycleCount++;
            document.getElementById('cycleCount').textContent = cycleCount;
        }
        runBreathingCycle();
    }, phase.duration);
}

function updateBreathingDisplay() {
    const circle = document.getElementById('breathingCircle');
    circle.style.transition = 'transform 0.3s ease';
}

function stopBreathing() {
    clearInterval(breathingTimer);
    document.getElementById('breathingStartBtn').style.display = 'inline-flex';
    document.getElementById('breathingStopBtn').style.display = 'none';
    
    const circle = document.getElementById('breathingCircle');
    circle.style.transform = 'scale(1)';
    document.getElementById('breathingText').textContent = 'Well done!';
    
    showToast(`You completed ${cycleCount} breathing cycles!`, 'success');
    
    // Save stats
    setCookie('breathingSessions', parseInt(getCookie('breathingSessions') || '0') + 1, 30);
    setCookie('breathingCycles', parseInt(getCookie('breathingCycles') || '0') + cycleCount, 30);
}

// ===== 5. Colour Mood Selector =====
const colourData = {
    blue: {
        title: 'Calm Blue',
        effect: 'Blue is known to lower heart rate and blood pressure. It promotes feelings of peace, trust, and security.',
        tips: [
            'Look at blue objects when feeling anxious',
            'Blue lighting can help create a calming bedroom atmosphere',
            'Blue clothing can make you appear more trustworthy'
        ],
        bg: 'linear-gradient(135deg, #3498db, #2980b9)'
    },
    green: {
        title: 'Relaxed Green',
        effect: 'Green symbolizes nature and growth. It relieves stress and brings a sense of balance and harmony.',
        tips: [
            'Spend time in nature or near plants',
            'Green workspace can reduce eye strain',
            'Green foods boost energy and vitality'
        ],
        bg: 'linear-gradient(135deg, #2ecc71, #27ae60)'
    },
    yellow: {
        title: 'Happy Yellow',
        effect: 'Yellow is the colour of sunshine and happiness. It stimulates creativity, optimism, and mental activity.',
        tips: [
            'Yellow accents in your home boost happiness',
            'Wear yellow when you need a confidence boost',
            'Yellow sticky notes can increase motivation'
        ],
        bg: 'linear-gradient(135deg, #f1c40f, #f39c12)'
    },
    red: {
        title: 'Energetic Red',
        effect: 'Red increases heart rate and creates urgency. It boosts energy, passion, and motivation.',
        tips: [
            'Red is great for workouts and high-energy activities',
            'Use red sparingly to avoid overwhelming feelings',
            'Red accents can increase appetite and excitement'
        ],
        bg: 'linear-gradient(135deg, #e74c3c, #c0392b)'
    },
    purple: {
        title: 'Creative Purple',
        effect: 'Purple combines the calm of blue with the energy of red. It inspires creativity and spiritual awareness.',
        tips: [
            'Purple environments boost creative thinking',
            'Purple lighting helps with meditation',
            'Purple foods like grapes boost brain health'
        ],
        bg: 'linear-gradient(135deg, #9b59b6, #8e44ad)'
    },
    pink: {
        title: 'Loving Pink',
        effect: 'Pink has a calming effect similar to blue but adds warmth. It promotes love, compassion, and nurturing.',
        tips: [
            'Pink can reduce aggressive behaviour',
            'Pink rooms promote relaxation and comfort',
            'Pink clothing makes you appear more approachable'
        ],
        bg: 'linear-gradient(135deg, #ff9ff3, #f368e0)'
    },
    grey: {
        title: 'Neutral Grey',
        effect: 'Grey provides balance and calm. It helps centre emotions and can make other colours stand out more.',
        tips: [
            'Grey creates a minimalist, sophisticated space',
            'Grey backgrounds help other colours pop',
            'Grey is great for reducing visual stimulation'
        ],
        bg: 'linear-gradient(135deg, #34495e, #2c3e50)'
    }
};

function selectColour(colour) {
    const data = colourData[colour];
    
    // Update button states
    document.querySelectorAll('.colour-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.colour === colour);
    });
    
    // Show result
    const result = document.getElementById('colourResult');
    result.style.display = 'block';
    
    document.getElementById('colourPreview').style.background = data.bg;
    document.getElementById('colourTitle').textContent = data.title;
    document.getElementById('colourEffect').textContent = data.effect;
    
    const tipsList = document.getElementById('colourTipsList');
    tipsList.innerHTML = data.tips.map(tip => `<li>${tip}</li>`).join('');
    
    result.style.animation = 'fadeInUp 0.5s ease';
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Save preference
    setCookie('preferredColour', colour, 30);
}

// ===== 6. Daily Challenge =====
const challenges = [
    { icon: '💧', title: 'Drink a Glass of Water', desc: 'Staying hydrated boosts energy and mental clarity. Aim for 8 glasses a day!' },
    { icon: '🚶', title: 'Take a 10-Minute Walk', desc: 'A short walk can improve mood and creativity. Get some fresh air!' },
    { icon: '🧘', title: 'Practice 5 Minutes of Stretching', desc: 'Stretching relieves muscle tension and reduces stress. Your body will thank you!' },
    { icon: '📱', title: 'Digital Detox for 30 Minutes', desc: 'Put away screens and be present. Read a book, draw, or just sit quietly.' },
    { icon: '😊', title: 'Do Something Kind for Someone', desc: 'Acts of kindness boost your own happiness too! Help a neighbour or compliment a stranger.' },
    { icon: '🌿', title: 'Spend Time in Nature', desc: 'Connect with nature for 15 minutes. Studies show it reduces stress hormones.' },
    { icon: '📝', title: 'Write 3 Things You\'re Grateful For', desc: 'Gratitude journaling increases happiness. Take a moment to appreciate the good things.' },
    { icon: '😴', title: 'Go to Bed 15 Minutes Earlier', desc: 'More sleep = better mental health. Your brain needs rest to function optimally.' },
    { icon: '🎵', title: 'Listen to Your Favourite Song', desc: 'Music heals! Put on a song that makes you happy and really listen.' },
    { icon: '🤝', title: 'Connect with a Friend', desc: 'Social connection is vital for mental health. Call or message someone you care about.' },
    { icon: '🥗', title: 'Eat One Healthy Meal', desc: 'Nourish your body with whole foods. Your brain needs good fuel to think clearly.' },
    { icon: '🧠', title: 'Learn Something New Today', desc: 'Keep your brain sharp! Watch a documentary, read an article, or try a new skill.' },
    { icon: '🌬️', title: 'Practice Deep Breathing', desc: 'Take 5 slow, deep breaths. It activates your relaxation response instantly.' },
    { icon: '🎯', title: 'Set Tomorrow\'s Goals Tonight', desc: 'Planning reduces anxiety. Write down 3 things you want to accomplish tomorrow.' },
    { icon: '😊', title: 'Smile at 5 Strangers Today', desc: 'Smiling is contagious! Your smile might be the bright spot in someone\'s day.' }
];

function getTodayChallenge() {
    // Use date to get consistent challenge for the day
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % challenges.length;
    return challenges[index];
}

function loadChallenge() {
    const challenge = getTodayChallenge();
    const todayStr = new Date().toDateString();
    const lastCompleted = getCookie('challengeLastCompleted');
    
    document.getElementById('challengeIcon').textContent = challenge.icon;
    document.getElementById('challengeTitle').textContent = challenge.title;
    document.getElementById('challengeDesc').textContent = challenge.desc;
    
    // Load streak
    const streak = parseInt(getCookie('challengeStreak') || '0');
    document.getElementById('streakCount').textContent = streak;
    
    // Check if already completed today
    if (lastCompleted === todayStr) {
        const btn = document.getElementById('challengeBtn');
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2"><polyline points="20 6 9 17 4 12"/></svg> Completed!';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-secondary');
        btn.disabled = true;
    }
}

function completeChallenge() {
    const todayStr = new Date().toDateString();
    const lastCompleted = getCookie('challengeLastCompleted');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    let streak = parseInt(getCookie('challengeStreak') || '0');
    
    // Update streak
    if (lastCompleted === yesterdayStr) {
        streak++;
    } else if (lastCompleted !== todayStr) {
        streak = 1;
    }
    
    setCookie('challengeStreak', streak.toString(), 365);
    setCookie('challengeLastCompleted', todayStr, 365);
    
    // Update UI
    document.getElementById('streakCount').textContent = streak;
    const btn = document.getElementById('challengeBtn');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2"><polyline points="20 6 9 17 4 12"/></svg> Completed!';
    btn.classList.remove('btn-success');
    btn.classList.add('btn-secondary');
    btn.disabled = true;
    
    showToast(`Amazing! You've maintained a ${streak}-day streak!`, 'success');
    
    // Confetti effect
    createConfetti();
}

function skipChallenge() {
    const challenge = getTodayChallenge();
    const btn = document.getElementById('challengeBtn');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Get New Challenge';
    btn.onclick = function() { loadNewChallenge(); };
    
    // Reset streak
    setCookie('challengeStreak', '0', 365);
    document.getElementById('streakCount').textContent = '0';
    
    showToast('Challenge skipped. Try to stay consistent!', 'info');
}

function loadNewChallenge() {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomIndex];
    
    document.getElementById('challengeIcon').textContent = challenge.icon;
    document.getElementById('challengeTitle').textContent = challenge.title;
    document.getElementById('challengeDesc').textContent = challenge.desc;
    
    const btn = document.getElementById('challengeBtn');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2"><polyline points="20 6 9 17 4 12"/></svg> I did it!';
    btn.classList.add('btn-success');
    btn.classList.remove('btn-secondary');
    btn.disabled = false;
    btn.onclick = function() { completeChallenge(); };
    
    showToast('New challenge loaded! Good luck!', 'info');
}

function createConfetti() {
    const colors = ['#2D8B6F', '#4ECDC4', '#f1c40f', '#e74c3c', '#9b59b6'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
            z-index: 9999;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
    
    // Add confetti animation style
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== Initialize on page load =====
document.addEventListener('DOMContentLoaded', function() {
    loadChallenge();
    initNavigation();
    initCookieConsent();
    initMoodCheckin();
    initScrollToTop();
    
    // Show a random motivation on load
    setTimeout(() => generateMotivation(), 1000);
});
