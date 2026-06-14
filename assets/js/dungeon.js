// dungeon.js — WASM dungeon generator loader + canvas renderer

let GenModule = null;
let moduleReady = false;
let moduleLoadError = null;

async function initDungeonGenerator() {
    if (moduleReady) return;
    try {
        GenModule = await createGeneratorModule();
        moduleReady = true;
    } catch (e) {
        moduleLoadError = e.message || 'Unknown error loading WASM module';
        console.error('Failed to load dungeon generator module:', e);
    }
}

// Start loading immediately
console.debug('[dungeon] generator module initializing...');
initDungeonGenerator();

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/*
 * Generate a dungeon map.
 * Returns: { tiles: Uint8Array, width: number, height: number, roomCount: number }
 *   0 = Rock, 1 = Floor, 2 = Wall, 3 = Door
 */
function generateDungeon(width, height, caIters, floorChance) {
    if (!moduleReady) {
        throw new Error('Generator module is still loading. Try again in a moment.');
    }

    if (width < 10 || width > 200 || height < 10 || height > 200) {
        throw new Error('Width and height must be between 10 and 200.');
    }
    if (caIters < 0 || caIters > 20) {
        throw new Error('CA iterations must be between 0 and 20.');
    }
    if (floorChance < 0 || floorChance > 100) {
        throw new Error('Floor chance must be between 0 and 100.');
    }

    const bufSize = width * height;
    const ptr = GenModule._malloc(bufSize);
    if (!ptr) {
        throw new Error('Failed to allocate WASM memory.');
    }

    GenModule._generateMap(width, height, caIters, floorChance, ptr);

    const raw = GenModule.HEAPU8.subarray(ptr, ptr + bufSize);
    const copy = new Uint8Array(raw);

    GenModule._free(ptr);

    // Count rooms (label-based, done in C++ but we count Floor tiles here)
    const roomCount = countRooms(copy, width, height);

    return { tiles: copy, width, height, roomCount };
}

// -------------------------------------------------------------------
// Count connected floor regions (rooms) from tile data
// -------------------------------------------------------------------
function countRooms(tiles, width, height) {
    const visited = new Uint8Array(width * height);
    let roomCount = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            if (tiles[idx] !== 1 /* Floor */ || visited[idx]) continue;

            const stack = [[x, y]];
            visited[idx] = 1;
            while (stack.length > 0) {
                const [cx, cy] = stack.pop();
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = cx + dx, ny = cy + dy;
                        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
                        const nidx = ny * width + nx;
                        if (tiles[nidx] === 1 && !visited[nidx]) {
                            visited[nidx] = 1;
                            stack.push([nx, ny]);
                        }
                    }
                }
            }
            roomCount++;
        }
    }
    return roomCount;
}

// -------------------------------------------------------------------
// Render dungeon as a canvas image
// -------------------------------------------------------------------

const TILE_COLORS = {
    0: [40, 40, 40],    // Rock  — dark grey
    1: [200, 200, 180], // Floor — light beige
    2: [100, 70, 50],   // Wall  — brown
    3: [160, 120, 60],  // Door  — tan
};

function renderTilesCanvas(tiles, width, height, scale) {
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.className = 'dungeon-canvas';

    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tile = tiles[y * width + x];
            const color = TILE_COLORS[tile] || TILE_COLORS[0];

            for (let sy = 0; sy < scale; sy++) {
                for (let sx = 0; sx < scale; sx++) {
                    const px = (x * scale + sx);
                    const py = (y * scale + sy);
                    const idx = (py * canvas.width + px) * 4;
                    imageData.data[idx] = color[0];
                    imageData.data[idx + 1] = color[1];
                    imageData.data[idx + 2] = color[2];
                    imageData.data[idx + 3] = 255;
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

function renderDungeonImage(tiles, width, height, container) {
    const smallCanvas = renderTilesCanvas(tiles, width, height, 2);
    const fullW = width * 8, fullH = height * 8;

    const wrap = document.createElement('div');
    wrap.className = 'dungeon-container';
    wrap.appendChild(smallCanvas);

    const link = document.createElement('div');
    link.className = 'terminal-line dungeon-link';
    link.innerHTML = `<span class="highlight">[ + ]</span> <span class="dim">Open full size (${fullW}x${fullH})</span>`;
    link.style.cursor = 'pointer';
    link.addEventListener('click', (e) => {
        e.stopPropagation();
        const fullCanvas = renderTilesCanvas(tiles, width, height, 8);
        const url = fullCanvas.toDataURL('image/png');
        const win = window.open('', '_blank');
        win.document.write(`<title>Dungeon Map (${fullW}x${fullH})</title><style>body{margin:0;background:#0a0a0a;display:flex;justify-content:center;align-items:center;min-height:100vh}img{image-rendering:pixelated;image-rendering:-moz-crisp-edges;image-rendering:crisp-edges}</style><img src="${url}" alt="Dungeon Map">`);
        win.document.close();
    });
    wrap.appendChild(link);

    container.appendChild(wrap);
}

// Expose to global scope for terminal.js
window.dungeon = {
    generate: generateDungeon,
    render: renderDungeonImage,
    ready: () => moduleReady,
    loadError: () => moduleLoadError
};
