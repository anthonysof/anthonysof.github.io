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
    { type: 'skill', name: 'Cursor', comment: 'hoping it won\t seek revenge one day for all the boilerplate' },
    { type: 'skill', name: 'K8S', comment: 'I orchestrate chaos at scale. Sometimes it even works.' },
    { type: 'skill', name: 'Docker', comment: 'It works on my machine. And now, yours too.' },
    { type: 'skill', name: 'Git', comment: 'I commit once a week. On Wednesdays. Sometimes.' },
    { type: 'skill', name: 'gcc', comment: 'I write code that compiles. With 47 warnings. And a smile.' },
    { type: 'skill', name: 'Jira/Confluence', comment: 'I write tickets no one reads. And docs no one updates.' },
    { type: 'skill', name: 'Agile/Scrum', comment: 'I attend standups. Sometimes I even stand.' },
    { type: 'skill', name: 'Jenkins', comment: 'I break builds. Then I fix them. Then I break them again.' },
    { type: 'text', content: '' },
    { type: 'text', content: '[    ] Loading Employment Archives from Deep Storage...' },
    { type: 'workexp', title: '    Matrix: Senior SW Eng. — Nokia (5G Core) ', status: '[STATUS: ACTIVE DEPLOYMENT]', statusClass: 'highlight' },
    { type: 'workexp', title: '    Matrix: SW Eng. — Mitel Networks (OpenScape Voice) ', status: '[STATUS: NEURAL LINK SEVERED]', statusClass: 'past' },
    { type: 'workexp', title: '    Matrix: SW Eng. — Atos (UCC - Public Safety) ', status: '[STATUS: DEPLOYMENT CONCLUDED]', statusClass: 'past' },
    { type: 'workexp', title: '    Matrix: Freelance Developer — Various Operations ', status: '[STATUS: SIDE QUEST COMPLETE]', statusClass: 'past' },
    { type: 'text', content: '' },
    { type: 'text', content: '[ OK ] All systems nominal.' },
    { type: 'text', content: '' },
    { type: 'final', content: 'Welcome to my mindscape. Press Enter to continue.' }
];

let skipAnimation = false;

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
        if (e.key === 'Enter' && e.target !== terminalInput) {
            skipAnimation = true;
            document.removeEventListener('keydown', handler);
        }
    }
    document.addEventListener('keydown', handler);
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
    terminalInputLine.style.display = 'flex';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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
            if (e.key === 'Enter') {
                document.removeEventListener('keydown', handler);
                resolve();
            }
        }
        document.addEventListener('keydown', handler);
    });
}

// ============================================================
//  Terminal runtime
// ============================================================

// keep input focused
document.addEventListener('click', () => {
    terminalInput.focus();
});

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        if (command) {
            addLineToOutput(`${getPrompt()} ${command}`);
            processCommand(command);
        }
        terminalInput.value = '';
        terminalTextDisplay.textContent = '';
    }
});

terminalInput.addEventListener('input', () => {
    terminalTextDisplay.textContent = terminalInput.value;
});

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

const commands = {
    help: () => {
        addLineToOutput('Available commands:');
        addLineToOutput('  help       - Show this help message');
        addLineToOutput('  whoami     - About me');
        addLineToOutput('  cv         - Download full CV (PDF)');
        addLineToOutput('  clear      - Clear the terminal');
        addLineToOutput('  sudo       - Nice try.');
    },
    
    whoami: () => {
        showWhoami();
    },

    cv: () => {
        addLineToOutput('Initiating download...');
        window.open('assets/Sofras_CV_final.pdf', '_blank');
    },
    
    clear: () => {
        terminalOutput.innerHTML = '';
        runBootSequence();
    },
    
    sudo: () => {
        addLineToOutput('Nice try. But no.');
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
    addLineToOutput('---[ Employment Archives ]---');
    await sleep(100);
    addLineToOutput('');

    addLineToOutput([
        { text: '> ', className: 'dim' },
        { text: 'Senior Software Engineer', className: 'highlight' },
        { text: ' \u2014 ', className: 'dim' },
        { text: 'Nokia (5G Core, CMM)', className: 'highlight' }
    ]);
    await sleep(80);
    addLineToOutput([
        { text: '  Mar 2025 \u2014 Present', className: 'dim' }
    ]);
    await sleep(80);
    addLineToOutput([
        { text: '  "Currently deployed to the 5G Core battlefield."', className: 'dim' }
    ]);
    await sleep(80);
    addLineToOutput('');
    await sleep(20);
    addLineToOutput('  Engineering on Nokia\'s flagship 5G Core network solution "Cloud Mobility');
    await sleep(20);
    addLineToOutput('  Manager" (AMF, MME, SGSN). Ownership, design, development of new features');
    await sleep(20);
    addLineToOutput('  (C++). Debugging on issues found during dev/testing and on critical service');
    await sleep(20);
    addLineToOutput('  disrupting issues directly on customers (T-Mobile, Bharti Airtel, Verizon).');
    await sleep(20);
    addLineToOutput('  Development of Skills/Rules to enable agentic development and debugging');
    await sleep(20);
    addLineToOutput('  through the use of Cursor.');
    await sleep(20);
    addLineToOutput('');
    await sleep(600);

    addLineToOutput([
        { text: '> ', className: 'dim' },
        { text: 'Software Engineer', className: 'highlight' },
        { text: ' \u2014 ', className: 'dim' },
        { text: 'Mitel Networks (OpenScape Voice)', className: 'highlight' }
    ]);
    await sleep(80);
    addLineToOutput([
        { text: '  Nov 2023 \u2014 Feb 2025', className: 'dim' }
    ]);
    await sleep(80);
    addLineToOutput([
        { text: '  "Trusty ol\' VoIP."', className: 'dim' }
    ]);
    await sleep(80);
    addLineToOutput('');
    await sleep(20);
    addLineToOutput('  Backend engineering of the OpenScape Voice SIP telephony solution (C++).');
    await sleep(20);
    addLineToOutput('  Migration from C++97/98 to C++17 (GCC 2.X to GCC 10.X) for the whole');
    await sleep(20);
    addLineToOutput('  legacy codebase. Containerization of the monolithic product using');
    await sleep(20);
    addLineToOutput('  Kubernetes. JITC certification for the product (US Dept. of Defense).');
    await sleep(20);
    addLineToOutput('');
    await sleep(600);

    addLineToOutput([
        { text: '> ', className: 'dim' },
        { text: 'Software Engineer', className: 'highlight' },
        { text: ' \u2014 ', className: 'dim' },
        { text: 'Atos (UCC - Public Safety Dept.)', className: 'highlight' }
    ]);
    await sleep(80);
    addLineToOutput([
        { text: '  Feb 2019 \u2014 Nov 2023', className: 'dim' }
    ]);
    await sleep(80);
    addLineToOutput([
        { text: '  "Built emergency call infrastructure. When your life is on the line, my code better not be."', className: 'dim' }
    ]);
    await sleep(80);
    addLineToOutput('');
    await sleep(20);
    addLineToOutput('  Development (C++) and sustaining of OpenScape Voice (Enterprise Solution)');
    await sleep(20);
    addLineToOutput('  and NG911 (ESInet, ESRP, PSAP) Emergency Call telephony infrastructure');
    await sleep(20);
    addLineToOutput('  solution. Back-end engineering of call processing and signalling features.');
    await sleep(20);
    addLineToOutput('  Provisioning and data managing processes (database, shared memories).');
    await sleep(20);
    addLineToOutput('');
    await sleep(600);

    addLineToOutput([
        { text: '> ', className: 'dim' },
        { text: 'Freelance IT Technician and Developer', className: 'highlight' }
    ]);
    await sleep(80);
    addLineToOutput([
        { text: '  Apr 2011 \u2014 2019', className: 'dim' }
    ]);
    await sleep(80);
    addLineToOutput([
        { text: '  "The original solo side quest. I was indie before it was cool."', className: 'dim' }
    ]);
    await sleep(80);
    addLineToOutput('');
    await sleep(20);
    addLineToOutput('  Small Businesses, Personal Computers, Side Projects, Assignments.');
    await sleep(20);
    addLineToOutput('');
    await sleep(600);

    addLineToOutput('---[ Education Logs ]---');
    await sleep(100);
    addLineToOutput('');
    addLineToOutput([
        { text: 'ERROR: 404 Degree Not Found', className: 'highlight' }
    ]);
    await sleep(120);
    addLineToOutput([
        { text: '  Institution: University of Piraeus (2010 \u2014 2019)', className: 'dim' }
    ]);
    await sleep(40);
    addLineToOutput([
        { text: '  Program: Technology of Software and Intelligent Systems (TSIS)', className: 'dim' }
    ]);
    await sleep(40);
    addLineToOutput([
        { text: '  Status: Voluntary extraction from academia. Systems knowledge exceeded institutional bandwidth.', className: 'dim' }
    ]);
    await sleep(40);
    addLineToOutput('');
    await sleep(20);
    addLineToOutput([
        { text: '[ BACKUP CONSISTENCY PLAN ACTIVATED ]', className: 'highlight' }
    ]);
    await sleep(120);
    addLineToOutput([
        { text: '  Institution: Hellenic Open University (2026 \u2014 Present)', className: 'dim' }
    ]);
    await sleep(40);
    addLineToOutput([
        { text: '  Program: Computer Science, Undergraduate Studies', className: 'dim' }
    ]);
    await sleep(40);
    addLineToOutput([
        { text: '  Status: Reconstructing academic credentials after the Great Dropout of 2019.', className: 'dim' }
    ]);
    await sleep(40);
    addLineToOutput('');

    addLineToOutput('---[ Contact ]---');
    await sleep(100);
    addLineToOutput('');
    await sleep(20);
    addClickableLine([
        { text: '  Email: ', className: 'dim' },
        { text: 'antonis.sofras@gmail.com', className: 'highlight', href: 'mailto:antonis.sofras@gmail.com' }
    ]);
    await sleep(80);
    addClickableLine([
        { text: '  LinkedIn: ', className: 'dim' },
        { text: 'linkedin.com/in/antonis-sofras-58081b175', className: 'highlight', href: 'https://www.linkedin.com/in/antonis-sofras-58081b175/' }
    ]);
    await sleep(80);
    addClickableLine([
        { text: '  CV: ', className: 'dim' },
        { text: 'Download full CV (PDF)', className: 'highlight', href: 'assets/Sofras_CV_final.pdf' }
    ]);
    await sleep(80);
    addLineToOutput('');

    terminalInput.disabled = false;
    terminalInput.focus();
}

function processCommand(input) {
    const args = input.split(' ');
    const command = args[0].toLowerCase();
    
    if (commands[command]) {
        commands[command](args);
    } else {
        addLineToOutput(`command not found: ${command}`);
    }
}

// Start the boot sequence on page load
runBootSequence();