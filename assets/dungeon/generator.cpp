#include "Map.hpp"
#include <random>
#include <queue>
#include <utility>
#include <algorithm>
#include <cstdlib>
#include <cstring>

// -------------------------------------------------------------------
// Global random engine
// -------------------------------------------------------------------
static std::mt19937& globalRng() {
    static std::mt19937 rng(std::random_device{}());
    return rng;
}

// -------------------------------------------------------------------
// Count rock neighbours (including out-of-bounds as rock)
// -------------------------------------------------------------------
static int rockNeighbors(const Map& map, int x, int y) {
    int count = 0;
    for (int dy = -1; dy <= 1; ++dy) {
        for (int dx = -1; dx <= 1; ++dx) {
            if (dx == 0 && dy == 0) continue;
            int nx = x + dx, ny = y + dy;
            if (nx < 0 || nx >= map.width || ny < 0 || ny >= map.height
                || map.getTile(nx, ny) == TileType::Rock)
                ++count;
        }
    }
    return count;
}

// -------------------------------------------------------------------
// Cellular automata smoothing
// -------------------------------------------------------------------
static void applyCellularAutomata(Map& map, int iterations) {
    auto& tiles = map.tiles;
    std::vector<TileType> next(tiles.size());
    for (int iter = 0; iter < iterations; ++iter) {
        for (int y = 0; y < map.height; ++y) {
            for (int x = 0; x < map.width; ++x) {
                int idx = y * map.width + x;
                next[idx] = tiles[idx];
                int rockCount = rockNeighbors(map, x, y);
                if (next[idx] == TileType::Rock && rockCount < 4)
                    next[idx] = TileType::Floor;
                else if (next[idx] == TileType::Floor && rockCount >= 5)
                    next[idx] = TileType::Rock;
            }
        }
        std::swap(tiles, next);
    }
}

// -------------------------------------------------------------------
// Flood fill: label each connected Floor region with a unique ID
// -------------------------------------------------------------------
static std::vector<int> labelRooms(const Map& map) {
    int w = map.width, h = map.height;
    std::vector<int> labels(w * h, -1);
    int nextId = 0;

    for (int y = 0; y < h; ++y) {
        for (int x = 0; x < w; ++x) {
            if (map.getTile(x, y) != TileType::Floor || labels[y * w + x] != -1)
                continue;

            std::queue<std::pair<int,int>> q;
            q.push({x, y});
            labels[y * w + x] = nextId;

            while (!q.empty()) {
                auto [cx, cy] = q.front(); q.pop();
                for (int dy = -1; dy <= 1; ++dy) {
                    for (int dx = -1; dx <= 1; ++dx) {
                        if (dx == 0 && dy == 0) continue;
                        int nx = cx + dx, ny = cy + dy;
                        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                        int idx = ny * w + nx;
                        if (map.getTile(nx, ny) == TileType::Floor && labels[idx] == -1) {
                            labels[idx] = nextId;
                            q.push({nx, ny});
                        }
                    }
                }
            }
            ++nextId;
        }
    }
    return labels;
}

// -------------------------------------------------------------------
// Carve an L-shaped tunnel between two points
// -------------------------------------------------------------------
static void carveTunnel(Map& map, int x1, int y1, int x2, int y2) {
    auto& rng = globalRng();
    if (std::uniform_int_distribution(0, 1)(rng)) {
        for (int x = std::min(x1, x2); x <= std::max(x1, x2); ++x)
            map.setTile(x, y1, TileType::Floor);
        for (int y = std::min(y1, y2); y <= std::max(y1, y2); ++y)
            map.setTile(x2, y, TileType::Floor);
    } else {
        for (int y = std::min(y1, y2); y <= std::max(y1, y2); ++y)
            map.setTile(x1, y, TileType::Floor);
        for (int x = std::min(x1, x2); x <= std::max(x1, x2); ++x)
            map.setTile(x, y2, TileType::Floor);
    }
}

// -------------------------------------------------------------------
// Connect rooms: nearest-neighbour union-find with L-shaped tunnels
// -------------------------------------------------------------------
static void connectRooms(Map& map, const std::vector<int>& labels) {
    int w = map.width, h = map.height;
    auto& rng = globalRng();

    int roomCount = *std::max_element(labels.begin(), labels.end()) + 1;
    if (roomCount < 2) return;

    std::vector<std::vector<std::pair<int,int>>> rooms(roomCount);
    for (int y = 0; y < h; ++y)
        for (int x = 0; x < w; ++x)
            if (labels[y * w + x] != -1)
                rooms[labels[y * w + x]].push_back({x, y});

    std::vector<std::pair<int,int>> reps;
    for (auto& r : rooms)
        reps.push_back(r[std::uniform_int_distribution(0, (int)r.size()-1)(rng)]);

    std::vector<int> parent(roomCount);
    for (int i = 0; i < roomCount; ++i) parent[i] = i;

    auto find = [&](int x) {
        while (parent[x] != x) parent[x] = parent[parent[x]], x = parent[x];
        return x;
    };
    auto unite = [&](int a, int b) { parent[find(a)] = find(b); };

    auto allConnected = [&]() {
        int root = find(0);
        for (int i = 1; i < roomCount; ++i)
            if (find(i) != root) return false;
        return true;
    };

    while (!allConnected()) {
        int bestA = -1, bestB = -1, bestDist = 1 << 30;
        for (int a = 0; a < roomCount; ++a) {
            for (int b = a + 1; b < roomCount; ++b) {
                if (find(a) == find(b)) continue;
                int dist = std::abs(reps[a].first  - reps[b].first)
                         + std::abs(reps[a].second - reps[b].second);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestA = a; bestB = b;
                }
            }
        }
        if (bestA == -1) break;

        carveTunnel(map, reps[bestA].first, reps[bestA].second,
                          reps[bestB].first, reps[bestB].second);
        unite(bestA, bestB);
    }
}

// -------------------------------------------------------------------
// Full cave generation pipeline
// -------------------------------------------------------------------
static void generateCave(Map& map, int caIterations) {
    applyCellularAutomata(map, caIterations);

    auto labels = labelRooms(map);

    int w = map.width, h = map.height;
    int roomCount = *std::max_element(labels.begin(), labels.end()) + 1;
    std::vector<int> count(roomCount, 0);
    for (auto l : labels) if (l != -1) ++count[l];
    for (int y = 0; y < h; ++y)
        for (int x = 0; x < w; ++x)
            if (labels[y * w + x] != -1 && count[labels[y * w + x]] < 3)
                map.setTile(x, y, TileType::Rock);

    auto cleanLabels = labelRooms(map);
    connectRooms(map, cleanLabels);
}

// -------------------------------------------------------------------
// Exported function: generate map and write tile data to output buffer.
// output must be pre-allocated (width * height bytes), one byte per tile.
//   TileType::Rock  = 0
//   TileType::Floor = 1
//   TileType::Wall  = 2
//   TileType::Door  = 3
// -------------------------------------------------------------------
extern "C" {

void generateMap(int width, int height, int caIterations, int floorChance, uint8_t* output) {
    Map m(width, height);

    auto& rng = globalRng();
    std::uniform_int_distribution<int> dist(0, 99);

    for (int i = 0; i < width * height; ++i) {
        m.tiles[i] = (dist(rng) < floorChance) ? TileType::Floor : TileType::Rock;
    }

    generateCave(m, caIterations);

    for (int i = 0; i < width * height; ++i) {
        output[i] = static_cast<uint8_t>(m.tiles[i]);
    }
}

} // extern "C"
