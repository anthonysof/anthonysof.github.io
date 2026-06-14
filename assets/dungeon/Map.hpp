#pragma once
#include <vector>
#include <cstdint>
#include <ostream>

enum class TileType : uint8_t {
    Rock = 0,
    Floor = 1,
    Wall = 2,
    Door = 3
};

struct Map {
    int width;
    int height;
    std::vector<TileType> tiles;

    Map(int w, int h) : width(w), height(h), tiles(w*h) { };

    TileType getTile(int x, int y) const { return tiles[y*width + x]; }

    void setTile(int x, int y, TileType type) { tiles[y*width + x] =  type; }

    void printMap(std::ostream& os) const {
        for (int y = 0; y < height; ++y) {
            for (int x = 0; x < width; ++x) {
                switch (getTile(x, y)) {
                    case TileType::Rock:  os << '#'; break;
                    case TileType::Floor: os << '.'; break;
                    case TileType::Wall:  os << '#'; break;
                    case TileType::Door:  os << '+'; break;
                }
            }
            os << '\n';
        }
    }
};