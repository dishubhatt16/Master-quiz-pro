                                                                                                                                                                                                               // Web Audio Synthesizer (Zero External Audio File Dependency)
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
    }

    playCorrect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.12); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.25); // G5

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    }

    playWrong() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playFinish() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime + (idx * 0.1));
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx * 0.1) + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + (idx * 0.1));
            osc.stop(this.ctx.currentTime + (idx * 0.1) + 0.4);
        });
    }

    toggleMute() {
        this.muted = !this.muted;
        const icon = document.getElementById('sound-icon');
        if (this.muted) {
            icon.className = "fa-solid fa-volume-xmark text-xs text-rose-400";
        } else {
            icon.className = "fa-solid fa-volume-high text-xs text-indigo-400";
        }
    }
}

const soundFx = new SoundEngine();

// Confetti Canvas Particle Engine
class ConfettiSystem {
    constructor() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animating = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    trigger() {
        this.particles = [];
        const colors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2 - 50,
                vx: (Math.random() - 0.5) * 18,
                vy: (Math.random() - 0.7) * 18,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 8,
                gravity: 0.35,
                opacity: 1
            });
        }
        if (!this.animating) {
            this.animating = true;
            this.loop();
        }
    }

    loop() {
        if (!this.animating) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let alive = 0;
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rSpeed;
            p.opacity -= 0.012;

            if (p.opacity > 0) {
                alive++;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = Math.max(0, p.opacity);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                this.ctx.restore();
            }
        });

        if (alive > 0) {
            requestAnimationFrame(() => this.loop());
        } else {
            this.animating = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

const confetti = new ConfettiSystem();

// Questions Database
const quizData = {
    os: {
        name: "Operating Systems",
        badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        icon: "fa-microchip",
        questions: [
            {
                question: "Which CPU scheduling algorithm gives the lowest average waiting time for a given set of processes?",
                difficulty: "Medium",
                options: ["First-Come First-Served (FCFS)", "Shortest Job First (SJF)", "Round Robin (RR)", "Priority Scheduling"],
                answer: 1,
                explanation: "SJF is mathematically proven to minimize average process waiting times."
            },
            {
                question: "What state occurs when processes wait endlessly on resources held by each other?",
                difficulty: "Easy",
                options: ["Thrashing", "Deadlock", "Segmentation Fault", "Starvation"],
                answer: 1,
                explanation: "Deadlock occurs when circular waiting holds resources among multiple processes."
            },
            {
                question: "Which memory management scheme permits non-contiguous allocation of physical memory?",
                difficulty: "Medium",
                options: ["Fixed Partitioning", "Paging", "Static Relocation", "Contiguous Allocation"],
                answer: 1,
                explanation: "Paging divides logical memory into pages and physical memory into frames for flexible non-contiguous loading."
            },
            {
                question: "What does the Unix system call 'fork()' execute?",
                difficulty: "Medium",
                options: ["Kills child process", "Spawns a duplicate child process", "Allocates heap space", "Reboots kernel"],
                answer: 1,
                explanation: "fork() creates an identical duplicate child process running in parallel."
            },
            {
                question: "What is 'Thrashing' in Virtual Memory?",
                difficulty: "Hard",
                options: ["Formatting virtual disks", "Excessive page faulting overwhelming CPU execution time", "Clearing cache registers", "System rebooting"],
                answer: 1,
                explanation: "Thrashing happens when the OS spends more time swapping pages than doing useful CPU computation."
            }
        ]
    },
    java: {
        name: "Java Programming",
        badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        icon: "fa-java",
        questions: [
            {
                question: "Which OOP principle allows a single method call to exhibit different behavior at runtime?",
                difficulty: "Easy",
                options: ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"],
                answer: 1,
                explanation: "Polymorphism allows objects of different classes to respond uniquely to the same method invocation."
            },
            {
                question: "What is the result of using an uninitialized local variable in a Java method?",
                difficulty: "Medium",
                options: ["Evaluates to null", "Evaluates to 0", "Causes a compilation error", "Allocates random heap space"],
                answer: 2,
                explanation: "Java local variables do not receive default values; using them unassigned fails compilation."
            },
            {
                question: "Which Java collection structure prevents duplicate elements?",
                difficulty: "Easy",
                options: ["List", "Set", "Queue", "ArrayList"],
                answer: 1,
                explanation: "Set implementations (e.g. HashSet) enforce unique element constraints."
            },
            {
                question: "What does applying the 'final' modifier to a Java method prevent?",
                difficulty: "Medium",
                options: ["Prevents method overloading", "Prevents subclasses from overriding it", "Makes method thread-unsafe", "Deletes method from bytecode"],
                answer: 1,
                explanation: "A final method signature cannot be overridden by derived child classes."
            },
            {
                question: "How is Garbage Collection managed in the JVM?",
                difficulty: "Hard",
                options: ["Explicit delete operators", "Automated background JVM thread daemon", "Operating system kernel call", "Compiler pre-pass"],
                answer: 1,
                explanation: "The JVM includes an automated Garbage Collector thread that reclaims unreachable memory."
            }
        ]
    },
    cn: {
        name: "Computer Networks",
        badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        icon: "fa-network-wired",
        questions: [
            {
                question: "Which OSI model layer handles end-to-end IP packet routing?",
                difficulty: "Easy",
                options: ["Data Link", "Network Layer", "Transport Layer", "Session Layer"],
                answer: 1,
                explanation: "Layer 3 (Network Layer) manages logical IP addressing and path routing."
            },
            {
                question: "What distinguishes TCP from UDP protocols?",
                difficulty: "Medium",
                options: ["TCP is connectionless", "TCP provides connection-oriented reliable delivery; UDP is faster & connectionless", "UDP guarantees packet order", "TCP operates only over WiFi"],
                answer: 1,
                explanation: "TCP uses handshakes to guarantee data delivery, whereas UDP trades guarantees for speed."
            },
            {
                question: "Which system maps human hostnames (e.g. google.com) to numeric IP addresses?",
                difficulty: "Easy",
                options: ["DHCP", "DNS", "ARP", "BGP"],
                answer: 1,
                explanation: "The Domain Name System (DNS) resolves domain strings into numerical network IP addresses."
            },
            {
                question: "What default port is reserved for secure HTTPS traffic?",
                difficulty: "Easy",
                options: ["80", "21", "443", "8080"],
                answer: 2,
                explanation: "Port 443 is the standard encrypted SSL/TLS HTTP port."
            },
            {
                question: "What mapping does the Address Resolution Protocol (ARP) perform?",
                difficulty: "Hard",
                options: ["IP address to MAC address", "MAC address to Domain Name", "Port number to IP address", "URL to Router Gateway"],
                answer: 0,
                explanation: "ARP resolves Layer 3 IP addresses to physical Layer 2 MAC addresses."
            }
        ]
    },
    math: {
        name: "Mathematics",
        badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        icon: "fa-square-root-variable",
        questions: [
            {
                question: "What is the sum of interior angles of a 6-sided regular hexagon?",
                difficulty: "Easy",
                options: ["360°", "540°", "720°", "900°"],
                answer: 2,
                explanation: "Sum = (n - 2) * 180°. For n=6, (4 * 180°) = 720°."
            },
            {
                question: "If a square matrix determinant equals zero, what property holds?",
                difficulty: "Medium",
                options: ["It is an Identity Matrix", "It is singular and has no matrix inverse", "It is symmetric", "All eigenvalues are 1"],
                answer: 1,
                explanation: "A matrix with det(A) = 0 is non-invertible or singular."
            },
            {
                question: "What is the derivative of f(x) = x³ + 2x?",
                difficulty: "Medium",
                options: ["3x² + 2", "3x + 2", "x² + 2", "3x² + x"],
                answer: 0,
                explanation: "Using the power rule: d/dx(x³) = 3x² and d/dx(2x) = 2. Result: 3x² + 2."
            },
            {
                question: "What is a connected undirected graph with no cycles termed?",
                difficulty: "Easy",
                options: ["Complete Graph", "Tree", "Bipartite Graph", "Hypercube"],
                answer: 1,
                explanation: "A connected graph without loops/cycles is defined as a Tree."
            },
            {
                question: "What is the probability of flipping two heads in sequence on a fair coin?",
                difficulty: "Easy",
                options: ["1/2", "1/3", "1/4", "3/4"],
                answer: 2,
                explanation: "P(H1) = 1/2, P(H2) = 1/2. Combined P = 1/2 * 1/2 = 1/4."
            }
        ]
    }
};

class QuizApp {
    constructor() {
        this.currentSubjectKey = null;
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.userAnswers = [];
        this.questionTimer = null;
        this.timeLeft = 20;
        this.totalTimer = null;
        this.totalSeconds = 0;
        this.currentActiveFilter = 'all';

        // Initial Mock High Score Entries for immediate vibrant display
        this.defaultScores = [
            { id: 1, name: "Alex_Cyber", avatar: "fa-user-ninja", subject: "os", score: 5, total: 5, accuracy: 100, time: "00:48", date: "2026-10-12" },
            { id: 2, name: "CodeWizard", avatar: "fa-laptop-code", subject: "java", score: 5, total: 5, accuracy: 100, time: "00:52", date: "2026-10-11" },
            { id: 3, name: "ByteRider", avatar: "fa-robot", subject: "cn", score: 4, total: 5, accuracy: 80, time: "01:05", date: "2026-10-10" },
            { id: 4, name: "MathPro", avatar: "fa-brain", subject: "math", score: 4, total: 5, accuracy: 80, time: "01:10", date: "2026-10-09" },
            { id: 5, name: "DevAstro", avatar: "fa-user-astronaut", subject: "os", score: 3, total: 5, accuracy: 60, time: "01:22", date: "2026-10-08" }
        ];

        this.initLocalStorage();
    }

    initLocalStorage() {
        if (!localStorage.getItem('masterquiz_leaderboard')) {
            localStorage.setItem('masterquiz_leaderboard', JSON.stringify(this.defaultScores));
        }
    }

    getLeaderboardData() {
        try {
            return JSON.parse(localStorage.getItem('masterquiz_leaderboard')) || [];
        } catch (e) {
            return this.defaultScores;
        }
    }

    saveLeaderboardEntry(entry) {
        const data = this.getLeaderboardData();
        data.unshift(entry);
        localStorage.setItem('masterquiz_leaderboard', JSON.stringify(data));
    }

    clearLeaderboardData() {
        if (confirm("Reset all high scores and leaderboard records?")) {
            localStorage.removeItem('masterquiz_leaderboard');
            this.initLocalStorage();
            this.renderLeaderboardScreen();
        }
    }

    showScreen(screenId) {
        this.resetTimers();
        ['home', 'quiz', 'results', 'leaderboard'].forEach(s => {
            const el = document.getElementById(`screen-${s}`);
            if (s === screenId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });

        if (screenId !== 'quiz') {
            document.getElementById('nav-stats').classList.remove('flex');
            document.getElementById('nav-stats').classList.add('hidden');
        }

        if (screenId === 'leaderboard') {
            this.renderLeaderboardScreen();
        }
    }

    startQuiz(subjectKey) {
        this.currentSubjectKey = subjectKey;
        const subject = quizData[subjectKey];
        this.questions = [...subject.questions];
        this.currentIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.userAnswers = [];
        this.totalSeconds = 0;

        // Reset Save Form
        document.getElementById('save-score-card').classList.remove('hidden');
        document.getElementById('save-feedback').classList.add('hidden');
        document.getElementById('btn-save-score').disabled = false;

        // Header HUD
        document.getElementById('lbl-nav-subj').innerText = subject.name;
        document.getElementById('nav-stats').classList.remove('hidden');
        document.getElementById('nav-stats').classList.add('flex');

        this.showScreen('quiz');
        this.startTotalTimer();
        this.loadQuestion();
    }

    restartCurrentQuiz() {
        if (this.currentSubjectKey) {
            this.startQuiz(this.currentSubjectKey);
        }
    }

    startTotalTimer() {
        if (this.totalTimer) clearInterval(this.totalTimer);
        this.totalTimer = setInterval(() => {
            this.totalSeconds++;
            const m = Math.floor(this.totalSeconds / 60).toString().padStart(2, '0');
            const s = (this.totalSeconds % 60).toString().padStart(2, '0');
            document.getElementById('lbl-nav-timer').innerText = `${m}:${s}`;
        }, 1000);
    }

    startQuestionTimer() {
        this.timeLeft = 20;
        document.getElementById('timer-count').innerText = `${this.timeLeft}s`;
        if (this.questionTimer) clearInterval(this.questionTimer);

        this.questionTimer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer-count').innerText = `${this.timeLeft}s`;
            if (this.timeLeft <= 0) {
                clearInterval(this.questionTimer);
                this.handleTimeOut();
            }
        }, 1000);
    }

    loadQuestion() {
        const q = this.questions[this.currentIndex];
        const total = this.questions.length;

        document.getElementById('quiz-progress-text').innerHTML = `<i class="fa-solid fa-compass"></i> Question ${this.currentIndex + 1} of ${total}`;
        document.getElementById('progress-bar-fill').style.width = `${((this.currentIndex + 1) / total) * 100}%`;

        document.getElementById('difficulty-badge').innerText = `${q.difficulty || 'Medium'} Difficulty`;
        document.getElementById('question-title').innerText = q.question;

        const container = document.getElementById('options-container');
        container.innerHTML = '';

        q.options.forEach((optText, i) => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500 hover:bg-slate-800/90 text-slate-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between group cursor-pointer shadow-sm";
            btn.innerHTML = `
                <span class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold group-hover:border-indigo-500 group-hover:text-indigo-300 transition-colors">${String.fromCharCode(65 + i)}</span>
                    <span>${optText}</span>
                </span>
                <span class="opt-status text-slate-500 text-base"></span>
            `;
            btn.onclick = () => this.selectOption(i, btn);
            container.appendChild(btn);
        });

        const streakBadge = document.getElementById('streak-badge');
        if (this.streak >= 2) {
            streakBadge.classList.remove('hidden');
            document.getElementById('streak-count').innerText = this.streak;
        } else {
            streakBadge.classList.add('hidden');
        }

        document.getElementById('btn-next').disabled = true;
        this.startQuestionTimer();
    }

    selectOption(selectedIndex) {
        if (this.isAnswering) return;
        this.isAnswering = true;
        clearInterval(this.questionTimer);

        const q = this.questions[this.currentIndex];
        const isCorrect = selectedIndex === q.answer;
        const container = document.getElementById('options-container');
        const buttons = container.getElementsByTagName('button');

        if (isCorrect) {
            this.score++;
            this.streak++;
            soundFx.playCorrect();
        } else {
            this.streak = 0;
            soundFx.playWrong();
        }

        this.userAnswers.push({
            question: q.question,
            options: q.options,
            selected: selectedIndex,
            correct: q.answer,
            explanation: q.explanation,
            isCorrect: isCorrect
        });

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
            buttons[i].classList.remove('hover:border-indigo-500', 'hover:bg-slate-800/90', 'cursor-pointer');

            if (i === q.answer) {
                buttons[i].className = "w-full text-left p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between shadow-lg shadow-emerald-500/10";
                buttons[i].querySelector('.opt-status').innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
            } else if (i === selectedIndex && !isCorrect) {
                buttons[i].className = "w-full text-left p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500 text-rose-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between shadow-lg shadow-rose-500/10";
                buttons[i].querySelector('.opt-status').innerHTML = '<i class="fa-solid fa-circle-xmark text-rose-400"></i>';
            } else {
                buttons[i].classList.add('opacity-40');
            }
        }

        this.isAnswering = false;
        document.getElementById('btn-next').disabled = false;
    }

    handleTimeOut() {
        const q = this.questions[this.currentIndex];
        this.streak = 0;
        soundFx.playWrong();

        this.userAnswers.push({
            question: q.question,
            options: q.options,
            selected: -1,
            correct: q.answer,
            explanation: q.explanation,
            isCorrect: false
        });

        const container = document.getElementById('options-container');
        const buttons = container.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
            if (i === q.answer) {
                buttons[i].className = "w-full text-left p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between";
                buttons[i].querySelector('.opt-status').innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
            } else {
                buttons[i].classList.add('opacity-40');
            }
        }
        document.getElementById('btn-next').disabled = false;
    }

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            this.loadQuestion();
        } else {
            this.finishQuiz();
        }
    }

    quitQuiz() {
        if (confirm('Quit active assessment? Progress will be lost.')) {
            this.showScreen('home');
        }
    }

    finishQuiz() {
        this.resetTimers();
        this.showScreen('results');

        const total = this.questions.length;
        const percentage = Math.round((this.score / total) * 100);

        if (percentage >= 70) {
            confetti.trigger();
            soundFx.playFinish();
        }

        const headline = document.getElementById('res-headline');
        const trophyIcon = document.getElementById('res-trophy-icon');
        if (percentage === 100) {
            headline.innerText = "Perfect Score!";
            trophyIcon.className = "fa-solid fa-crown text-slate-950";
        } else if (percentage >= 60) {
            headline.innerText = "Great Job!";
            trophyIcon.className = "fa-solid fa-trophy text-slate-950";
        } else {
            headline.innerText = "Keep Practicing!";
            trophyIcon.className = "fa-solid fa-graduation-cap text-slate-950";
        }

        document.getElementById('results-subtitle').innerText = `You finished the ${quizData[this.currentSubjectKey].name} evaluation.`;
        document.getElementById('res-score').innerText = `${this.score} / ${total}`;
        document.getElementById('res-accuracy').innerText = `${percentage}%`;

        const m = Math.floor(this.totalSeconds / 60).toString().padStart(2, '0');
        const s = (this.totalSeconds % 60).toString().padStart(2, '0');
        document.getElementById('res-time').innerText = `${m}:${s}`;

        // Question breakdown
        const breakdown = document.getElementById('results-breakdown');
        breakdown.innerHTML = '';

        this.userAnswers.forEach((ans, idx) => {
            const card = document.createElement('div');
            card.className = "p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs";

            const badge = ans.isCorrect
                ? '<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">Correct</span>'
                : '<span class="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">Incorrect</span>';

            card.innerHTML = `
                <div class="flex items-start justify-between gap-3">
                    <span class="font-bold text-slate-200">Q${idx + 1}: ${ans.question}</span>
                    ${badge}
                </div>
                <div class="text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                    <p><strong class="text-slate-300">Selected:</strong> ${ans.selected >= 0 ? ans.options[ans.selected] : '<span class="text-rose-400">Timed Out</span>'}</p>
                    <p><strong class="text-slate-300">Correct:</strong> <span class="text-emerald-400 font-medium">${ans.options[ans.correct]}</span></p>
                    <p class="text-slate-400/90 italic pt-1 flex items-start gap-1.5"><i class="fa-solid fa-circle-info text-indigo-400 mt-0.5"></i> <span>${ans.explanation}</span></p>
                </div>
            `;
            breakdown.appendChild(card);
        });
    }

    updateAvatarPreview() {
        const val = document.getElementById('avatar-select').value;
        document.getElementById('avatar-preview').className = `fa-solid ${val} text-indigo-400 text-lg`;
    }

    saveCurrentScore() {
        const nameInput = document.getElementById('player-name-input');
        const name = nameInput.value.trim() || 'Anonymous_Hero';
        const avatar = document.getElementById('avatar-select').value;
        const m = Math.floor(this.totalSeconds / 60).toString().padStart(2, '0');
        const s = (this.totalSeconds % 60).toString().padStart(2, '0');

        const entry = {
            id: Date.now(),
            name: name,
            avatar: avatar,
            subject: this.currentSubjectKey,
            score: this.score,
            total: this.questions.length,
            accuracy: Math.round((this.score / this.questions.length) * 100),
            time: `${m}:${s}`,
            date: new Date().toISOString().split('T')[0]
        };

        this.saveLeaderboardEntry(entry);

        document.getElementById('btn-save-score').disabled = true;
        document.getElementById('save-feedback').classList.remove('hidden');
        soundFx.playCorrect();
    }

    renderLeaderboardScreen() {
        const data = this.getLeaderboardData();

        // 1. Render Subject High Score Cards
        const highScoresContainer = document.getElementById('subject-high-score-cards');
        highScoresContainer.innerHTML = '';

        Object.keys(quizData).forEach(subjKey => {
            const subj = quizData[subjKey];
            const subjEntries = data.filter(item => item.subject === subjKey);
            
            // Sort by score desc, accuracy desc, then time
            subjEntries.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
            const top = subjEntries[0] || null;

            const card = document.createElement('div');
            card.className = "glass-card p-5 rounded-3xl border-slate-800 space-y-4 relative overflow-hidden flex flex-col justify-between";

            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                            <i class="fa-solid ${subj.icon}"></i>
                        </div>
                        <span class="text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${subj.badgeClass}">${subj.name}</span>
                    </div>
                    <h4 class="text-xs font-bold text-slate-400">Personal Best Record</h4>
                    <p class="text-xl font-black text-white mt-1">${top ? `${top.score} /${top.total}` : 'No Score'}</p>
                </div>
                
                <div class="pt-3 border-t border-slate-800/80 text-[11px] space-y-1 text-slate-400">
                    <div class="flex justify-between">
                        <span>Player:</span>
                        <span class="text-slate-200 font-bold">${top ? top.name : 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Accuracy:</span>
                        <span class="text-emerald-400 font-bold">${top ? `${top.accuracy}%` : '-'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Time Spent:</span>
                        <span class="text-amber-400 font-mono">${top ? top.time : '-'}</span>
                    </div>
                </div>
            `;
            highScoresContainer.appendChild(card);
        });

        // 2. Filter & Render Global Leaderboard Cards
        this.renderFilteredLeaderboard();
    }

    filterLeaderboard(subjectKey) {
        this.currentActiveFilter = subjectKey;
        document.querySelectorAll('.filter-subj-btn').forEach(btn => {
            if (btn.dataset.subj === subjectKey) {
                btn.className = "filter-subj-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs transition-all cursor-pointer";
            } else {
                btn.className = "filter-subj-btn px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer";
            }
        });
        this.renderFilteredLeaderboard();
    }

    renderFilteredLeaderboard() {
        let data = this.getLeaderboardData();

        if (this.currentActiveFilter !== 'all') {
            data = data.filter(item => item.subject === this.currentActiveFilter);
        }

        // Sort Leaderboard: Higher score first, higher accuracy, faster time
        data.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy || a.time.localeCompare(b.time));

        document.getElementById('lb-total-count').innerText = data.length;
        const container = document.getElementById('leaderboard-cards-container');
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-slate-500 space-y-2">
                    <i class="fa-solid fa-trophy text-3xl text-slate-700"></i>
                    <p class="text-xs font-bold">No High Scores Logged for this filter yet.</p>
                </div>
            `;
            return;
        }

        data.forEach((item, index) => {
            const rank = index + 1;
            const subjInfo = quizData[item.subject] || { name: item.subject, badgeClass: "bg-slate-800 text-slate-300" };

            // Rank Badges
            let rankBadge = `<span class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400">#${rank}</span>`;
            let borderClass = "border-slate-800/80";

            if (rank === 1) {
                rankBadge = `<span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">🥇</span>`;
                borderClass = "gold-border";
            } else if (rank === 2) {
                rankBadge = `<span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-100 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">🥈</span>`;
                borderClass = "silver-border";
            } else if (rank === 3) {
                rankBadge = `<span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md">🥉</span>`;
                borderClass = "bronze-border";
            }

            const card = document.createElement('div');
            card.className = `glass-card p-4 rounded-2xl border ${borderClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-slate-800/60`;

            card.innerHTML = `
                <!-- Left Info -->
                <div class="flex items-center gap-3.5">
                    ${rankBadge}
                    <div class="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-indigo-400 text-lg shadow-inner">
                        <i class="fa-solid ${item.avatar || 'fa-user-ninja'}"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h4 class="text-sm font-extrabold text-white">${item.name}</h4>
                            <span class="text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${subjInfo.badgeClass}">${subjInfo.name}</span>
                        </div>
                        <span class="text-[10px] text-slate-500 font-mono">Logged on ${item.date}</span>
                    </div>
                </div>

                <!-- Right Stats -->
                <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
                    <div class="text-left sm:text-right">
                        <span class="block text-[10px] font-semibold text-slate-400 uppercase">Score</span>
                        <span class="text-sm font-black text-indigo-400">${item.score} / ${item.total}</span>
                    </div>
                    <div class="text-left sm:text-right">
                        <span class="block text-[10px] font-semibold text-slate-400 uppercase">Accuracy</span>
                        <span class="text-sm font-black text-emerald-400">${item.accuracy}%</span>
                    </div>
                    <div class="text-left sm:text-right">
                        <span class="block text-[10px] font-semibold text-slate-400 uppercase">Time</span>
                        <span class="text-sm font-black text-amber-400 font-mono">${item.time}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    resetTimers() {
        if (this.questionTimer) clearInterval(this.questionTimer);
        if (this.totalTimer) clearInterval(this.totalTimer);
    }
}

// Initialize Global App Instance
const app = new QuizApp();
