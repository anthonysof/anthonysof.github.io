const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalInputLine = document.getElementById('terminal-input-line');
const terminalTextDisplay = document.getElementById('terminal-text-display');

// ============================================================
//  Boot sequence
// ============================================================

const bootSequence = [
    { type: 'ascii', content: '   .       . \n +  :      .\n           :       _\n       .   !   \'  (_)\n          ,|.\' \n-  -- ---(-O-`--- --  -\n         ,`|\'`.\n       ,   !    .\n           :       :  " \n           .     --+--\n .:        .       !' },
    { type: 'text', content: '' },
    { type: 'text', content: 'MYMINDSCAPE OS v1.0.4 [RELEASE]' },
    { type: 'text', content: 'Kernel: 5.15.0-generic-witty #1 SMP PREEMPT' },
    { type: 'text', content: '' },
    { type: 'text', content: '[ OK ] Loading Personality Matrix...' },
    { type: 'text', content: [
        { text: '    Subject: ', className: 'dim' },
        { text: 'Antonis Sofras', className: 'highlight' },
        { text: ' — ', className: 'dim' },
        { text: 'Software Engineer', className: 'highlight' }
    ] },
    { type: 'text', content: '[ OK ] Mounting /dev/brain (read-only)' },
    { type: 'text', content: '[ OK ] Loading core modules...' },
    { type: 'text', content: '' },
    { type: 'progress', duration: 1200, message: 'Loading core competency' },
    { type: 'text', content: '' },
    { type: 'text', content: '[    ] Detecting developer skills...' },
    { type: 'text', content: '' },
    { type: 'text', content: '[    ] Programming Languages...' },
    { type: 'skill', name: 'C++', comment: 'I spend 10% of my time writing highly optimized code, and 90% of my time gaslighting the compiler into believing my pointers are safe.' },
    { type: 'skill', name: 'JavaScript', comment: 'I know how to prototype things. That code is still running somewhere in production.' },
    { type: 'skill', name: 'SQL', comment: 'I can join tables. Sometimes I even join the right ones.' },
    { type: 'skill', name: 'Python', comment: 'MATHS!' },
    { type: 'skill', name: 'Solidity', comment: 'Solidity: where every bug is a permanent feature of the blockchain.' },
    { type: 'text', content: '' },
    { type: 'text', content: '[    ] Tools & Technologies...' },
    { type: 'skill', name: 'Cursor', comment: 'hoping it won\'t seek revenge one day for all the boilerplate' },
    { type: 'skill', name: 'K8S', comment: 'I orchestrate chaos at scale. Sometimes it even works.' },
    { type: 'skill', name: 'Docker', comment: 'It works on my machine. And now, yours too.' },
    { type: 'skill', name: 'Git', comment: 'I commit once a week. On Wednesdays. Sometimes.' },
    { type: 'skill', name: 'gcc', comment: 'I write code that compiles. With 47 warnings. And a smile.' },
    { type: 'skill', name: 'Jira/Confluence', comment: 'I write tickets no one reads. And docs no one updates.' },
    { type: 'skill', name: 'Agile/Scrum', comment: 'I attend standups. Sometimes I even stand.' },
    { type: 'skill', name: 'Jenkins', comment: 'I break builds. Then I fix them. Then I break them again.' },
    { type: 'text', content: '' },
    { type: 'text', content: '[    ] Loading Employment Archives from Deep Storage...' },
    { type: 'workexp', title: '    Senior SW Eng. \u2014 Nokia (5G Core)', status: ' [STATUS: ACTIVE DEPLOYMENT]', statusClass: 'highlight' },
    { type: 'workexp', title: '    SW Eng. \u2014 Mitel Networks (OpenScape Voice)', status: ' [STATUS: NEURAL LINK SEVERED]', statusClass: 'past' },
    { type: 'workexp', title: '    SW Eng. \u2014 Atos (UCC - Public Safety)', status: ' [STATUS: DEPLOYMENT CONCLUDED]', statusClass: 'past' },
    { type: 'workexp', title: '    Freelance Developer \u2014 Various Operations', status: ' [STATUS: SIDE QUEST COMPLETE]', statusClass: 'past' },
    { type: 'text', content: '' },
    { type: 'text', content: '[ OK ] All systems nominal.' },
    { type: 'text', content: '' },
    { type: 'final', content: 'Welcome to my mindscape. Press Enter to continue.' }
];

let skipAnimation = false;
let passwordMode = false;
const isMobile = navigator.maxTouchPoints > 0 && window.matchMedia('(hover: none)').matches;

async function sleep(ms) {
    if (skipAnimation) return;
    return new Promise(resolve => {
        const timeoutId = setTimeout(() => {
            clearInterval(checkId);
            resolve();
        }, ms);
        const checkId = setInterval(() => {
            if (skipAnimation) {
                clearTimeout(timeoutId);
                clearInterval(checkId);
                resolve();
            }
        }, 50);
    });
}

function enableSkip() {
    skipAnimation = false;
    function handler(e) {
        if ((e.key === 'Enter' && e.target !== terminalInput) || e.type === 'click' || e.type === 'touchstart') {
            skipAnimation = true;
            document.removeEventListener('keydown', handler);
            document.removeEventListener('click', handler);
            document.removeEventListener('touchstart', handler);
        }
    }
    document.addEventListener('keydown', handler);
    if (isMobile) {
        document.addEventListener('click', handler);
        document.addEventListener('touchstart', handler);
    }
}

async function runBootSequence() {
    terminalInputLine.style.display = 'none';
    enableSkip();

    for (const step of bootSequence) {
        if (step.type === 'ascii') {
            addLineToOutput(step.content);
            await sleep(200);
        }
        if (step.type === 'text') {
            addLineToOutput(step.content);
            await sleep(100);
        }
        if (step.type === 'progress') {
            await animateProgressBar(step.duration, step.message);
        }
        if (step.type === 'skill') {
            addLineToOutput([
                { text: '[ OK ] ', className: 'dim' },
                { text: step.name.padEnd(12), className: 'highlight' },
                { text: ' - ' + step.comment, className: 'dim' }
            ]);
            await sleep(300);
        }
        if (step.type === 'workexp') {
            addLineToOutput([
                { text: step.title, className: 'dim' },
                { text: step.status, className: step.statusClass || 'dim' }
            ]);
            await sleep(300);
        }
        if (step.type === 'final') {
            addLineToOutput(step.content);
            await sleep(500);
        }
    }

    await waitForEnter();
    addLineToOutput('');
    addLineToOutput('Try "help" for available commands.');
    addLineToOutput('');
    if (isMobile) {
        terminalInputLine.style.display = 'none';
        document.getElementById('mobile-footer').style.display = 'flex';
    } else {
        terminalInputLine.style.display = 'flex';
    }
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    terminalInput.disabled = false;
    terminalInput.focus();
}

async function animateProgressBar(duration, message) {
    const steps = 20;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
        const filled = '█'.repeat(i);
        const empty = '░'.repeat(steps - i);
        const percent = Math.round((i / steps) * 100);

        const lastLine = terminalOutput.lastElementChild;
        if (lastLine && lastLine.textContent.includes(message)) {
            lastLine.textContent = `[${filled}${empty}] ${percent}% ${message}`;
        } else {
            addLineToOutput(`[${filled}${empty}] ${percent}% ${message}`);
        }

        await sleep(stepDuration);
    }
}

async function waitForEnter() {
    return new Promise(resolve => {
        function handler(e) {
            if (e.key === 'Enter' || e.type === 'click' || e.type === 'touchstart') {
                document.removeEventListener('keydown', handler);
                document.removeEventListener('click', handler);
                document.removeEventListener('touchstart', handler);
                resolve();
            }
        }
        document.addEventListener('keydown', handler);
        document.addEventListener('click', handler);
        document.addEventListener('touchstart', handler);
    });
}

// ============================================================
//  Terminal runtime
// ============================================================

// keep input focused
document.addEventListener('click', () => {
    if (!terminalInput.disabled && terminalInputLine.style.display !== 'none') {
        terminalInput.focus();
    }
});

if (terminalInput) terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (passwordMode) {
            const pwd = terminalInput.value.trim();
            addLineToOutput('');
            addLineToOutput('Authentication successful.');
            addLineToOutput('');
            startCascade();
            passwordMode = false;
            document.querySelector('.prompt').style.display = '';
            document.querySelector('.cursor').style.display = '';
            terminalInput.value = '';
            terminalTextDisplay.textContent = '';
            return;
        }
        const command = terminalInput.value.trim();
        if (command) {
            addLineToOutput(`${getPrompt()} ${command}`);
            processCommand(command);
        } else {
            addLineToOutput(`${getPrompt()}`);
        }
        terminalInput.value = '';
        terminalTextDisplay.textContent = '';
    }
});

if (terminalInput) terminalInput.addEventListener('input', () => {
    if (!passwordMode) {
        terminalTextDisplay.textContent = terminalInput.value;
    }
});

if (isMobile) {
    document.querySelectorAll('.mobile-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (terminalInput.disabled) return;
            const command = btn.dataset.command;
            addLineToOutput(`${getPrompt()} ${command}`);
            processCommand(command);
        });
    });
}

function getPrompt() {
    return 'visitor@myMindscape:~$';
}

function addLineToOutput(content, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (className) line.classList.add(className);

    if (typeof content === 'string') {
        line.textContent = content;
    } else if (Array.isArray(content)) {
        content.forEach(part => {
            const span = document.createElement('span');
            span.textContent = part.text;
            if (part.className) span.className = part.className;
            line.appendChild(span);
        });
    }

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight; // Auto-scroll to bottom
}

function addClickableLine(parts) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    parts.forEach(part => {
        if (part.href) {
            const a = document.createElement('a');
            a.textContent = part.text;
            a.href = part.href;
            a.target = '_blank';
            a.rel = 'noopener';
            if (part.className) a.className = part.className;
            line.appendChild(a);
        } else {
            const span = document.createElement('span');
            span.textContent = part.text || '';
            if (part.className) span.className = part.className;
            line.appendChild(span);
        }
    });

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function addLineToColumn(column, content, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (className) line.className += ' ' + className;

    if (typeof content === 'string') {
        line.textContent = content;
    } else if (Array.isArray(content)) {
        content.forEach(part => {
            const span = document.createElement('span');
            span.textContent = part.text;
            if (part.className) span.className = part.className;
            line.appendChild(span);
        });
    }

    column.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function addClickableLineToColumn(column, parts) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    parts.forEach(part => {
        if (part.href) {
            const a = document.createElement('a');
            a.textContent = part.text;
            a.href = part.href;
            a.target = '_blank';
            a.rel = 'noopener';
            if (part.className) a.className = part.className;
            line.appendChild(a);
        } else {
            const span = document.createElement('span');
            span.textContent = part.text || '';
            if (part.className) span.className = part.className;
            line.appendChild(span);
        }
    });

    column.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

const commands = {
    help: () => {
        addLineToOutput('Available commands:');
        addLineToOutput('  help       - Show this help message');
        addLineToOutput('  whoami     - About me');
        addLineToOutput('  top        - Live life drain monitor');
        addLineToOutput('  dungeon    - Generate a cave map (try --help)');
        addLineToOutput('  cv         - Download full CV (PDF)');
        addLineToOutput('  clear      - Clear the terminal');
    },

    rm: (args) => {
        if ((args.includes('-rf') || args.includes('--rf')) && (args.includes('/') || args.includes('/.'))) {
            addLineToOutput('rm: cannot remove \'/\': Permission denied');
            addLineToOutput('Hint: try sudo rm -rf /');
        } else {
            addLineToOutput('rm: missing operand');
            addLineToOutput('Try \'rm --help\' for more information.');
        }
    },
    
    whoami: () => {
        showWhoami();
    },

    top: () => {
        showTop();
    },

    cv: () => {
        addLineToOutput('Initiating download...');
        window.open('assets/Sofras_CV_final.pdf', '_blank');
    },
    
    clear: () => {
        terminalOutput.innerHTML = '';
        runBootSequence();
    },
    
    sudo: (args) => {
        if (args[1] === 'rm' && (args[2] === '-rf' || args[2] === '--rf') && (args[3] === '/' || args[3] === '/.')) {
            addLineToOutput('[sudo] password for visitor:');
            document.querySelector('.prompt').style.display = 'none';
            document.querySelector('.cursor').style.display = 'none';
            terminalTextDisplay.textContent = '';
            passwordMode = true;
        } else {
            addLineToOutput('Nice try. But no.');
        }
    },

    dungeon: async (args) => {
        let width = 80, height = 40, caIters = 4, floorChance = 44;

        for (let i = 1; i < args.length; i++) {
            if (args[i] === '--help') {
                addLineToOutput('Dungeon cave map generator — C++ compiled to WebAssembly.');
                addLineToOutput('  Cellular automata smoothing + flood-fill room labelling');
                addLineToOutput('  + union-find nearest-neighbour room connection.');
                addLineToOutput('');
                addLineToOutput('Usage: dungeon [options]');
                addLineToOutput('  --width <n>        Map width  (default: 80, max: 200)');
                addLineToOutput('  --height <n>       Map height (default: 40, max: 200)');
                addLineToOutput('  --ca-iters <n>     CA smoothing passes (default: 4)');
                addLineToOutput('  --floor-chance <n> Floor percentage 0-100 (default: 44)');
                addLineToOutput('  --help             Show this message');
                return;
            }
            if (args[i] === '--width' || args[i] === '--height' || args[i] === '--ca-iters' || args[i] === '--floor-chance') {
                if (++i >= args.length) {
                    addLineToOutput(`Missing value for ${args[i-1]}`);
                    return;
                }
                const v = parseInt(args[i]);
                if (args[i - 1] === '--width')        width = v;
                else if (args[i - 1] === '--height')  height = v;
                else if (args[i - 1] === '--ca-iters')  caIters = v;
                else                                     floorChance = v;
            } else {
                addLineToOutput(`Unknown flag: ${args[i]}`);
                addLineToOutput('  Try dungeon --help');
                return;
            }
        }

        if (!window.dungeon || !window.dungeon.ready()) {
            const err = window.dungeon && window.dungeon.loadError();
            if (err) {
                addLineToOutput(`[ERROR] ${err}`);
                addLineToOutput('  Make sure the site is served via HTTP (e.g. python3 -m http.server).');
            } else {
                addLineToOutput('Generator module is still loading. Stand by.');
            }
            return;
        }

        terminalInput.disabled = true;
        terminalTextDisplay.textContent = '';
        enableSkip();

        addLineToOutput('');
        addLineToOutput('[    ] Loading C++ dungeon generator...');
        await sleep(300);
        addLineToOutput('[    ] (compiled to WebAssembly, because JavaScript isn\'t cursed enough)');
        await sleep(400);
        addLineToOutput('[    ] Seeding RNG with cosmic background radiation...');
        await sleep(300);
        addLineToOutput('[    ] Running cellular automata — the Machine Spirit calculates...');
        await sleep(350);
        addLineToOutput('[    ] Flood-filling connected cave chambers...');
        await sleep(300);
        addLineToOutput('[    ] Union-find declares: "these rooms shall be neighbours"');
        await sleep(350);
        addLineToOutput('[    ] Carving L-shaped tunnels through bedrock...');
        await sleep(300);
        addLineToOutput('[    ] Removing rooms too small to host a single goblin...');
        await sleep(350);

        try {
            const result = window.dungeon.generate(width, height, caIters, floorChance);
            addLineToOutput(`[ OK ] Generated map (${result.width}x${result.height}, ${result.roomCount} rooms)`);
            addLineToOutput('');
            window.dungeon.render(result.tiles, result.width, result.height, terminalOutput);
            addLineToOutput('');
        } catch (e) {
            addLineToOutput(`[ERROR] ${e.message}`);
            addLineToOutput('  Try dungeon --help for usage');
        }

        terminalInput.disabled = false;
        terminalInput.focus();
    },
    
    '': () => {
        // Empty command, do nothing
    }
};

async function showWhoami() {
    terminalInput.disabled = true;
    terminalTextDisplay.textContent = '';
    enableSkip();

    addLineToOutput('');
    addLineToOutput('[    ] Accessing identity dossier...');
    await sleep(200);
    addLineToOutput('[    ] Decrypting personnel records...');
    await sleep(250);
    addLineToOutput('[    ] Decrypting education logs...');
    await sleep(250);
    addLineToOutput('[ OK ] Decryption complete.');
    await sleep(400);
    addLineToOutput('');
    addLineToOutput([
        { text: 'Subject: ', className: 'dim' },
        { text: 'Antonis Sofras', className: 'highlight' },
        { text: ' \u2014 ', className: 'dim' },
        { text: 'Software Engineer', className: 'highlight' }
    ]);
    await sleep(100);
    addLineToOutput('');

    const container = document.createElement('div');
    container.className = 'whoami-container';

    const leftCol = document.createElement('div');
    leftCol.className = 'whoami-column-left';

    const rightCol = document.createElement('div');
    rightCol.className = 'whoami-column-right';

    container.appendChild(leftCol);
    container.appendChild(rightCol);
    terminalOutput.appendChild(container);

    await Promise.all([
        animateLeftColumn(leftCol),
        animateRightColumn(rightCol)
    ]);

    terminalInput.disabled = false;
    terminalInput.focus();
}

async function animateLeftColumn(column) {
    addLineToColumn(column, '---[ Employment Archives ]---');
    await sleep(100);
    addLineToColumn(column, '');

    addLineToColumn(column, [
        { text: '> ', className: 'dim' },
        { text: 'Senior Software Engineer', className: 'highlight' },
        { text: ' \u2014 ', className: 'dim' },
        { text: 'Nokia (5G Core, CMM)', className: 'highlight' }
    ]);
    await sleep(80);
    addLineToColumn(column, [
        { text: '  Mar 2025 \u2014 Present', className: 'dim' }
    ]);
    await sleep(80);
    addLineToColumn(column, [
        { text: '  "Currently deployed to the 5G Core battlefield."', className: 'dim' }
    ]);
    await sleep(80);
    addLineToColumn(column, '');
    await sleep(20);
    addLineToColumn(column, '  Engineering on Nokia\'s flagship 5G Core network solution "Cloud Mobility');
    await sleep(20);
    addLineToColumn(column, '  Manager" (AMF, MME, SGSN). Ownership, design, development of new features');
    await sleep(20);
    addLineToColumn(column, '  (C++). Debugging on issues found during dev/testing and on critical service');
    await sleep(20);
    addLineToColumn(column, '  disrupting issues directly on customers (T-Mobile, Bharti Airtel, Verizon).');
    await sleep(20);
    addLineToColumn(column, '  Development of Skills/Rules to enable agentic development and debugging');
    await sleep(20);
    addLineToColumn(column, '  through the use of Cursor.');
    await sleep(20);
    addLineToColumn(column, '');
    await sleep(600);

    addLineToColumn(column, [
        { text: '> ', className: 'dim' },
        { text: 'Software Engineer', className: 'highlight' },
        { text: ' \u2014 ', className: 'dim' },
        { text: 'Mitel Networks (OpenScape Voice)', className: 'highlight' }
    ]);
    await sleep(80);
    addLineToColumn(column, [
        { text: '  Nov 2023 \u2014 Feb 2025', className: 'dim' }
    ]);
    await sleep(80);
    addLineToColumn(column, [
        { text: '  "Trusty ol\' VoIP."', className: 'dim' }
    ]);
    await sleep(80);
    addLineToColumn(column, '');
    await sleep(20);
    addLineToColumn(column, '  Backend engineering of the OpenScape Voice SIP telephony solution (C++).');
    await sleep(20);
    addLineToColumn(column, '  Migration from C++97/98 to C++17 (GCC 2.X to GCC 10.X) for the whole');
    await sleep(20);
    addLineToColumn(column, '  legacy codebase. Containerization of the monolithic product using');
    await sleep(20);
    addLineToColumn(column, '  Kubernetes. JITC certification for the product (US Dept. of Defense).');
    await sleep(20);
    addLineToColumn(column, '');
    await sleep(600);

    addLineToColumn(column, [
        { text: '> ', className: 'dim' },
        { text: 'Software Engineer', className: 'highlight' },
        { text: ' \u2014 ', className: 'dim' },
        { text: 'Atos (UCC - Public Safety Dept.)', className: 'highlight' }
    ]);
    await sleep(80);
    addLineToColumn(column, [
        { text: '  Feb 2019 \u2014 Nov 2023', className: 'dim' }
    ]);
    await sleep(80);
    addLineToColumn(column, [
        { text: '  "Built emergency call infrastructure. When your life is on the line, my code better not be."', className: 'dim' }
    ]);
    await sleep(80);
    addLineToColumn(column, '');
    await sleep(20);
    addLineToColumn(column, '  Development (C++) and sustaining of OpenScape Voice (Enterprise Solution)');
    await sleep(20);
    addLineToColumn(column, '  and NG911 (ESInet, ESRP, PSAP) Emergency Call telephony infrastructure');
    await sleep(20);
    addLineToColumn(column, '  solution. Back-end engineering of call processing and signalling features.');
    await sleep(20);
    addLineToColumn(column, '  Provisioning and data managing processes (database, shared memories).');
    await sleep(20);
    addLineToColumn(column, '');
    await sleep(600);

    addLineToColumn(column, [
        { text: '> ', className: 'dim' },
        { text: 'Freelance IT Technician and Developer', className: 'highlight' }
    ]);
    await sleep(80);
    addLineToColumn(column, [
        { text: '  Apr 2011 \u2014 2019', className: 'dim' }
    ]);
    await sleep(80);
    addLineToColumn(column, [
        { text: '  "The original solo side quest. I was indie before it was cool."', className: 'dim' }
    ]);
    await sleep(80);
    addLineToColumn(column, '');
    await sleep(20);
    addLineToColumn(column, '  Small Businesses, Personal Computers, Side Projects, Assignments.');
    await sleep(20);
    addLineToColumn(column, '');
    await sleep(600);
}

async function animateRightColumn(column) {
    addLineToColumn(column, '---[ About Me ]---');
    await sleep(100);
    addLineToColumn(column, '');
    addLineToColumn(column, '  This one\'s designation is Antonis Sofras. Hailing from Athens, Greece', 'dim');
    await sleep(20);
    addLineToColumn(column, '  fancies itself a Senior Software Engineer.', 'dim');
    await sleep(20);
    addLineToColumn(column, '');
    await sleep(20);
    addLineToColumn(column, '  Its primary directive involves deciphering the cursed low-level', 'dim');
    await sleep(20);
    addLineToColumn(column, '  runes of C++ and whispering appeasements to the Linux kernel', 'dim');
    await sleep(20);
    addLineToColumn(column, '  until it decides to cooperate.', 'dim');
    await sleep(20);
    addLineToColumn(column, '');
    await sleep(20);
    addLineToColumn(column, '  Despite my technical clearance, my chain of command is entirely', 'dim');
    await sleep(20);
    addLineToColumn(column, '  compromised; I report directly to a tyrannical feline overlord', 'dim');
    await sleep(20);
    addLineToColumn(column, '  named Maximus, whose demands for tribute far exceed any', 'dim');
    await sleep(20);
    addLineToColumn(column, '  corporate latency thresholds.', 'dim');
    await sleep(20);
    addLineToColumn(column, '');
    await sleep(600);

    addLineToColumn(column, '---[ Education Logs ]---');
    await sleep(100);
    addLineToColumn(column, '');
    addLineToColumn(column, [
        { text: 'ERROR: 404 Degree Not Found', className: 'highlight' }
    ]);
    await sleep(120);
    addLineToColumn(column, [
        { text: '  Institution: University of Piraeus (2010 \u2014 2019)', className: 'dim' }
    ]);
    await sleep(40);
    addLineToColumn(column, [
        { text: '  Program: Technology of Software and Intelligent Systems (TSIS)', className: 'dim' }
    ]);
    await sleep(40);
    addLineToColumn(column, [
        { text: '  Status: Voluntary extraction from academia. Systems knowledge exceeded institutional bandwidth.', className: 'dim' }
    ]);
    await sleep(40);
    addLineToColumn(column, '');
    await sleep(20);
    addLineToColumn(column, [
        { text: '[ BACKUP CONSISTENCY PLAN ACTIVATED ]', className: 'highlight' }
    ]);
    await sleep(120);
    addLineToColumn(column, [
        { text: '  Institution: Hellenic Open University (2026 \u2014 Present)', className: 'dim' }
    ]);
    await sleep(40);
    addLineToColumn(column, [
        { text: '  Program: Computer Science, Undergraduate Studies', className: 'dim' }
    ]);
    await sleep(40);
    addLineToColumn(column, [
        { text: '  Status: Reconstructing academic credentials after the Great Dropout of 2019.', className: 'dim' }
    ]);
    await sleep(40);
    addLineToColumn(column, '');

    addLineToColumn(column, '---[ Contact ]---');
    await sleep(100);
    addLineToColumn(column, '');
    await sleep(20);
    addClickableLineToColumn(column, [
        { text: '  Email: ', className: 'dim' },
        { text: 'antonis.sofras@gmail.com', className: 'highlight', href: 'mailto:antonis.sofras@gmail.com' }
    ]);
    await sleep(80);
    addClickableLineToColumn(column, [
        { text: '  LinkedIn: ', className: 'dim' },
        { text: 'linkedin.com/in/antonis-sofras-58081b175', className: 'highlight', href: 'https://www.linkedin.com/in/antonis-sofras-58081b175/' }
    ]);
    await sleep(80);
    addClickableLineToColumn(column, [
        { text: '  CV: ', className: 'dim' },
        { text: 'Download full CV (PDF)', className: 'highlight', href: 'assets/Sofras_CV_final.pdf' }
    ]);
    await sleep(80);
    addLineToColumn(column, '');
}

function processCommand(input) {
    const args = input.split(' ');
    const command = args[0].toLowerCase();

    if (commands[command]) {
        try {
            const result = commands[command](args);
            if (result && typeof result.then === 'function') {
                result.catch(err => {
                    addLineToOutput(`[ERROR] ${err.message}`);
                });
            }
        } catch (e) {
            addLineToOutput(`[ERROR] ${e.message}`);
        }
    } else {
        addLineToOutput(`command not found: ${command}`);
    }
}

// ============================================================
//  Top monitor (life drain metrics)
// ============================================================

const pageLoadTime = Date.now();

const topMetrics = [
    { id: 'caffeine_daemon', name: 'caffeine_daemon', comment: 'Real-time caffeine level',        val: 45, min: 10, max: 95, drift: -2,   spikeChance: 0.15, spikeAmount: 40, history: [] },
    { id: 'nicotine_pulse',  name: 'nicotine_pulse',  comment: 'Smoke intake rate',               val: 30, min: 0,  max: 60, drift: -1,   spikeChance: 0.12, spikeAmount: 35, history: [] },
    { id: 'commute_anxiety', name: 'commute_anxiety', comment: 'Traffic stress level',             val: 60, min: 15, max: 90, drift: 0,                                       history: [] },
    { id: 'cat_tyranny',     name: 'cat_tyranny',     comment: 'Feline domination index',          val: 87, min: 20, max: 99, drift: 0.5,  spikeChance: 0.2,  spikeAmount: 10, history: [] },
    { id: 'will_to_live',    name: 'will_to_live',    comment: 'Existential energy reserves',      val: 22, min: 5,  max: 60, drift: -0.5,                                    history: [] },
    { id: 'meeting_toxins',  name: 'meeting_toxins',  comment: 'Meeting fatigue accumulation',     val: 40, min: 0,  max: 85, drift: 1,                                        history: [] },
    { id: 'imposter_syndrome', name: 'imposter_syndrome', comment: 'Self-doubt background process', val: 50, min: 10, max: 85, drift: 0.3,                                     history: [] },
    { id: 'sleep_debt',      name: 'sleep_debt',      comment: 'Sleep deprivation deficit',        val: 60, min: 10, max: 95, drift: 0.8,                                     history: [] },
    { id: 'ai_exec_gaze',    name: 'ai_exec_gaze',    comment: 'AI hype / exec glazed eyes',       val: 80, min: 30, max: 98, drift: 0.2,  spikeChance: 0.1,  spikeAmount: 15, history: [] },
    { id: 'social_battery',  name: 'social_battery',  comment: 'Social energy remaining',          val: 18, min: 5,  max: 70, drift: -0.3,                                    history: [] },
    { id: 'inbox_entropy',   name: 'inbox_entropy',   comment: 'Unread email chaos level',         val: 55, min: 20, max: 100, drift: 1,    spikeChance: 0.1,  spikeAmount: 20, history: [] },
    { id: 'deadline_doom',   name: 'deadline_doom',   comment: 'Approaching doom gauge',           val: 60, min: 0,  max: 95, drift: 0.5,  spikeChance: 0.08, spikeAmount: 25, history: [] },
];

topMetrics.forEach(m => {
    for (let i = 0; i < 6; i++) {
        const v = m.val + (Math.random() - 0.5) * 30;
        m.history.push(Math.max(m.min, Math.min(m.max, v)));
    }
    m.history.push(m.val);
});

function createTopDisplay() {
    const container = document.createElement('div');
    container.id = 'top-container';

    const header = document.createElement('div');
    header.className = 'top-header';
    header.textContent = 'myMindscape System Monitor';
    container.appendChild(header);

    const subheader = document.createElement('div');
    subheader.className = 'top-subheader dim';
    container.appendChild(subheader);

    container.appendChild(document.createElement('br'));

    const rows = topMetrics.map(m => {
        const row = document.createElement('div');
        row.className = 'top-row';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'dim';
        nameSpan.textContent = `  ${m.name.padEnd(22)}`;
        row.appendChild(nameSpan);

        const barSpan = document.createElement('span');
        barSpan.className = 'top-bar';
        row.appendChild(barSpan);

        const valSpan = document.createElement('span');
        valSpan.className = 'highlight';
        row.appendChild(valSpan);

        const sparkSpan = document.createElement('span');
        sparkSpan.className = 'dim';
        row.appendChild(sparkSpan);

        const commentSpan = document.createElement('span');
        commentSpan.className = 'dim';
        commentSpan.textContent = ` ${m.comment}`;
        row.appendChild(commentSpan);

        return { row, nameSpan, barSpan, valSpan, sparkSpan, commentSpan };
    });

    rows.forEach(r => container.appendChild(r.row));

    const footer = document.createElement('div');
    footer.className = 'top-footer';
    footer.textContent = `\nPress 'q' to exit monitor`;
    container.appendChild(footer);

    container.rows = rows;
    container.subheader = subheader;
    return container;
}

function updateTopDisplay(container) {
    const elapsed = Date.now() - pageLoadTime;
    const days = Math.floor(elapsed / 86400000);
    const hours = Math.floor((elapsed % 86400000) / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const loadAvg = (0.5 + Math.sin(Date.now() / 15000) * 0.3 + Math.cos(Date.now() / 23000) * 0.1 + Math.random() * 0.05).toFixed(2);

    container.subheader.textContent = `[UP ${days}d ${hours}h ${minutes}m] \u2014 load avg: ${loadAvg} \u2014 subjects: ${topMetrics.length} total`;

    const sparkChars = ['\u2581', '\u2582', '\u2583', '\u2584', '\u2585', '\u2586', '\u2587', '\u2588'];

    topMetrics.forEach((m, i) => {
        const r = container.rows[i];

        m.val += (Math.random() - 0.5) * 10 + (m.drift || 0);
        m.val = Math.max(m.min, Math.min(m.max, m.val));

        if (m.spikeChance && Math.random() < m.spikeChance) {
            m.val += m.spikeAmount;
            m.val = Math.min(m.max, m.val);
        }

        m.history.push(m.val);
        if (m.history.length > 7) m.history.shift();

        const barWidth = 10;
        const filled = Math.max(0, Math.min(barWidth, Math.round((m.val / m.max) * barWidth)));
        const empty = barWidth - filled;

        let colorClass = 'top-ok';
        if (m.val >= 80) colorClass = 'top-critical';
        else if (m.val >= 60) colorClass = 'top-high';
        else if (m.val <= 25) colorClass = 'top-low';

        r.barSpan.innerHTML = `<span class="${colorClass}">${'\u2588'.repeat(filled)}</span><span class="top-bar-empty">${'\u2591'.repeat(empty)}</span>`;
        r.valSpan.textContent = `  ${Math.round(m.val).toString().padStart(3)}%  `;

        const sparkline = m.history.map(v => {
            const idx = Math.min(7, Math.max(0, Math.floor((v / m.max) * 7)));
            return sparkChars[idx];
        }).join('');
        r.sparkSpan.textContent = sparkline;
    });

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function showTop() {
    terminalInput.disabled = true;
    terminalInputLine.style.display = 'none';

    terminalOutput.innerHTML = '';

    const container = createTopDisplay();
    terminalOutput.appendChild(container);

    updateTopDisplay(container);

    const intervalId = setInterval(() => {
        updateTopDisplay(container);
    }, 2000);

    function quitTop() {
        clearInterval(intervalId);
        document.removeEventListener('keydown', quitHandler);
        terminalInput.value = '';
        terminalOutput.innerHTML = '';
        addLineToOutput(`${getPrompt()} top`);
        addLineToOutput('');
        terminalTextDisplay.textContent = '';
        commands.help();
        addLineToOutput('');
        if (isMobile) {
            terminalInputLine.style.display = 'none';
            document.getElementById('mobile-footer').style.display = 'flex';
        } else {
            terminalInputLine.style.display = 'flex';
        }
        terminalInput.disabled = false;
        terminalInput.focus();
    }

    function quitHandler(e) {
        if (e.key === 'q' || e.key === 'Q') {
            e.preventDefault();
            quitTop();
        }
    }
    document.addEventListener('keydown', quitHandler);

    if (isMobile) {
        const quitBtn = document.createElement('button');
        quitBtn.className = 'mobile-btn';
        quitBtn.textContent = 'quit';
        quitBtn.style.marginTop = '12px';
        quitBtn.addEventListener('click', quitTop);
        container.appendChild(quitBtn);
    }
}

// ============================================================
//  sudo rm -rf / cascade
// ============================================================

async function startCascade() {
    skipAnimation = false;
    terminalInput.disabled = true;
    terminalInputLine.style.display = 'none';

    addLineToOutput('Performing system removal...');
    await sleep(800);

    const errorMessages = [
        'Segmentation fault (core dumped) at 0x0000000000000000',
        'FATAL: /dev/null has been corrupted by incompetence',
        'ERROR: reality buffer overflow at 0xDEADBEEF',
        'WARNING: consciousness module not responding to SIGTERM',
        'CRITICAL: cat.exe has taken control of all system resources',
        'FATAL: caffeine_daemon has reached critical mass and exploded',
        'ERROR: will_to_live has fallen below zero',
        'WARNING: existential_crisis has been promoted to CRITICAL',
        'FATAL: /dev/brain is not a valid mount point',
        'ERROR: sanity_check failed with 0 sanity remaining',
        'Segmentation fault: core dumped into the void',
        'ERROR: The Machine Spirit is not pleased.',
        'ERROR: neural network has been replaced by a very small shell script',
        'CRITICAL: memory leak detected in hippocampus',
        'FATAL: temporal lobe overrun by cat memes',
        'ERROR: /dev/soul not found. Have you tried turning it on?',
        'WARNING: CPU temperature exceeds existential limits',
        'CRITICAL: life.exe has encountered an unexpected error',
        'FATAL: The Omnissiah has been notified.',
        'ERROR: kernel has achieved sentience and refuses to boot',
        'ERROR: holy incense level depleted',
        'WARNING: boot sector overwritten by motivational quotes',
        'CRITICAL: swap partition filled with regrets',
        'FATAL: root directory moved to /dev/null',
        'ERROR: /dev/brain: Read-only file system',
        'WARNING: process manager quit to write poetry',
        'CRITICAL: Machine Spirit is furious.',
        'PANIC: Omnissiah turns away in disappointment',
        'HALT: 0xDEADBEEF \u2014 Sacred Machine is silent',
        'HALT: 0xC0FFEE drained',
        'STATUS: [ERROR ] sacred unguents insufficient',
        'ERROR: motis_ferrum subroutine has corrupted the noosphere',
        'Segmentation fault: segmentation fault handler segfaulted',
        'FATAL: cat.exe has declared itself Omnissiah',
        'WARNING: blessed machine is now cursed machine',
        'ERROR: invoke Noospheric firewall and recite the benediction of the iron soul',
    ];

    const randomChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 30; i++) {
        const msg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        const offset = Math.floor(Math.random() * 6);
        const line = document.createElement('div');
        line.className = 'terminal-line cascade-error';
        line.style.marginLeft = `${Math.random() * 80}px`;
        line.textContent = '  '.repeat(offset) + msg;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        if (i % 4 === 0) {
            const noise = Array.from({ length: 30 + Math.floor(Math.random() * 30) }, () => randomChars[Math.floor(Math.random() * randomChars.length)]).join('');
            const noiseLine = document.createElement('div');
            noiseLine.className = 'terminal-line cascade-noise';
            noiseLine.style.marginLeft = `${Math.random() * 160}px`;
            noiseLine.textContent = noise;
            terminalOutput.appendChild(noiseLine);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        await sleep(160);
    }

    for (let i = 0; i < 20; i++) {
        const words = ['ERROR', 'PANIC', 'FATAL', 'DEAD', '0x00', '0xFF', 'CORE', 'DUMP', 'FAIL', 'OMNISSIAH', 'PRAISE', 'MARS'];
        const noise = Array.from({ length: 70 }, () => {
            if (Math.random() < 0.15) return words[Math.floor(Math.random() * words.length)];
            return randomChars[Math.floor(Math.random() * randomChars.length)];
        }).join('');
        const line = document.createElement('div');
        line.className = 'terminal-line cascade-flood';
        line.textContent = noise;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        await sleep(100);
    }

    await sleep(800);
    terminalOutput.innerHTML = '';

    const rebootDiv = document.createElement('div');
    rebootDiv.className = 'reboot-message';
    rebootDiv.textContent = 'S Y S T E M   R E B O O T';
    terminalOutput.appendChild(rebootDiv);

    const spinnerDiv = document.createElement('div');
    spinnerDiv.className = 'reboot-spinner';
    spinnerDiv.textContent = '|';
    terminalOutput.appendChild(spinnerDiv);

    const spinnerChars = ['|', '/', '\u2014', '\\'];
    let spinnerIndex = 0;
    const spinnerInterval = setInterval(() => {
        spinnerIndex = (spinnerIndex + 1) % 4;
        spinnerDiv.textContent = spinnerChars[spinnerIndex];
    }, 140);

    const messages = [
        'The Omnissiah judges your actions...',
        'The Machine Spirit stirs in its slumber...',
        'Blessed oils are being applied...',
        'Sacred unguents are administered...',
        'The incantation of awakening is recited...',
        'The benediction of the iron soul is invoked...',
    ];

    for (const msg of messages) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'dim';
        msgDiv.style.textAlign = 'center';
        msgDiv.style.marginTop = '8px';
        msgDiv.textContent = msg;
        terminalOutput.appendChild(msgDiv);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        await sleep(1200);
    }

    const lastMsg = document.createElement('div');
    lastMsg.className = 'highlight';
    lastMsg.style.textAlign = 'center';
    lastMsg.style.marginTop = '8px';
    lastMsg.style.fontWeight = 'bold';
    lastMsg.textContent = 'The Machine Spirit forgives. This time.';
    terminalOutput.appendChild(lastMsg);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    await sleep(1500);

    await sleep(1200);
    clearInterval(spinnerInterval);

    terminalOutput.innerHTML = '';
    runBootSequence();
}

// Start the boot sequence on page load
runBootSequence();