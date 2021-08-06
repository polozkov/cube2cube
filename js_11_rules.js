G.RULES = {
    MOVE: {
        f_do: function (position, move) { position[move.n_64] = move.n_player; },
        f_undo: function (position, move) { position[move.n_64] = 0; }
    },

    //is this row is winning
    f_is_full_row: function (position, color, row) {
        for (var i = row.length - 1; i >= 0; i--) {
            if (position[row[i]] !== color) { return false; }
        }
        return true;
    },

    //move = {n_64: n_64, n_player: n_player}
    f_is_row_4: function (position, move) {
        G.RULES.MOVE.f_do(position, move);
        //all rows woth this cell
        var rows = G.ROWS.arr_64.tetras[move.n_64];
        //test all rows
        for (var i = rows.length - 1; i >= 0; i--) {
            if (G.RULES.f_is_full_row(position, move.n_player, rows[i])) {
                G.RULES.MOVE.f_undo(position, move);
                //return first winning row
                return rows[i].slice();
            }
        }
        G.RULES.MOVE.f_undo(position, move);
        return false; //if no winning rows, return false
    },

    //"p" is position: array of 64 integer numbers of owners
    f_is_game_victory: function (p, who) {
        var all_rows = G.ROWS.arr_tetras;
        for (var i76 = 0; i76 < all_rows.length; i76++) {
            var n0 = all_rows[i76][0], n1 = all_rows[i76][1], n2 = all_rows[i76][2], n3 = all_rows[i76][3];
            if ((p[n0] === who) && (p[n1] === who) && (p[n2] === who) && (p[n3] === who)) {return true;}
        }
        return false;
    },

    f_generate_all_moves: function (position, n_player) {
        var arr_moves = [];
        for (var i16 = 0; i16 < 16; i16++) {
            //test zero floor, first floor, second floor, third floor
            if (position[i16] === 0) { arr_moves.push({ n_64: i16, n_player: n_player }) } else
                if (position[i16 + 16] === 0) { arr_moves.push({ n_64: i16 + 16, n_player: n_player }) } else
                    if (position[i16 + 32] === 0) { arr_moves.push({ n_64: i16 + 32, n_player: n_player }) } else
                        if (position[i16 + 48] === 0) { arr_moves.push({ n_64: i16 + 48, n_player: n_player }) };
        }
        return arr_moves;
    },

    f_generate_best_moves: function (position, n_player) {
        var all_moves = G.RULES.f_generate_all_moves(position, n_player);

        //test if you win, return first winning move (as array of 1 element)
        for (var i = 0; i < all_moves.length; i++) {
            if (G.RULES.f_is_row_4(position, all_moves[i])) {
                return [{ n_64: all_moves[i].n_64, n_player: n_player }];
            }
        }

        var next_player = 3 - n_player; //1 -> 2;  2 -> 1

        //test if opponent can win, return first defence
        for (var i = 0; i < all_moves.length; i++) {
            if (G.RULES.f_is_row_4(position, { n_64: all_moves[i].n_64, n_player: next_player })) {
                return [{ n_64: all_moves[i].n_64, n_player: n_player }];
            }
        }

        //if you can not win and opponent can not win, return all legal moves
        return all_moves;
    },

    f_is_full_cube: function (position) {
        for (var i = 48; i < 64; i++) { if (position[i] == 0) { return false; } }
        return true;
    },

    f_n_empty_cells: function (position) {
        var n = 0;
        for (var i = 0; i < 64; i++) {if (position[i] === 0) {n++;}}
        return n;
    }
}