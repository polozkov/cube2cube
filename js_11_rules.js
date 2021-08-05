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
    f_is_row_4: function (position, move, is_without_move) {
        if (!is_without_move) { G.RULES.MOVE.f_do(position, move); }
        //all rows woth this cell
        var rows = G.ROWS.arr_64.tetras[move.n_64];
        //test all rows
        for (var i = rows.length - 1; i >= 0; i--) {
            if (G.RULES.f_is_full_row(position, move.n_player, rows[i])) {
                if (!is_without_move) { G.RULES.MOVE.f_undo(position, move); }
                //return first winning row
                return rows[i].slice();
            }
        }
        if (!is_without_move) { G.RULES.MOVE.f_undo(position, move); }
        return false; //if no winning rows, return false
    },

    f_generate_all_moves: function (position, n_player) {
        var arr_moves = [];
        for (var i16 = 0; i16 < 16; i6++) {
            //test zero floor, first floor, second floor, third floor
            if (position[h] === 0) { arr_moves.push({ n_64: i16, n_player: n_player }) } else
                if (position[h + 16] === 0) { arr_moves.push({ n_64: i16 + 16, n_player: n_player }) } else
                    if (position[h + 32] === 0) { arr_moves.push({ n_64: i16 + 32, n_player: n_player }) } else
                        if (position[h + 48] === 0) { arr_moves.push({ n_64: i16 + 48, n_player: n_player }) };
        }
        return arr_moves;
    },

    f_generate_best_moves: function (position, n_player) {
        var all_moves = G.RULES.f_generate_all_moves(position, n_player);

        //test if you win, return first winning move (as array of 1 element)
        for (var i = 0; i < all_moves.length; i++) {
            if (G.RULES.f_is_row_4(position, all_moves[i]), false) {
                return [{ n_64: all_moves[i].n_64, n_player: n_player }];
            }
        }

        var next_player = 3 - n_player; //1 -> 2;  2 -> 1

        //test if opponent can win, return first defence
        for (var i = 0; i < all_moves.length; i++) {
            if (G.RULES.f_is_row_4(position, { n_64: all_moves[i].n_64, n_player: next_player }, false)) {
                return [{ n_64: all_moves[i].n_64, n_player: n_player }];
            }
        }

        //if you can not win and opponent can not win, return all legal moves
        return all_moves;
    }
}

G.AI = {
    VALUE: {
        const_max_score: 10000,
        //score for rows of 0,1,2,3,4 signs in row
        arr_score_for_row: [0, 3, 7, 20, 1000],

        f_calc_row_4: function (position, arr_index_4) {
            var arr_amount = [0, 0, 0], n_cell_color;
            for (var i4 = 0; i4 < 4; i4++) {
                n_cell_color = position[arr_index_4[i4]];
                arr_amount[n_cell_color]++;
            }
            //has both colors
            if (arr_amount[1] && arr_amount[2]) {
                return [0, 0];
            }
            //has score, return score of the first player and score of the second player
            return [G.AI.VALUE.arr_score_for_row[arr_amount[1]], G.AI.VALUE.arr_score_for_row[arr_amount[2]]];
        },

        f_calc_position: function (position, n_player_will_play) {
            var all_rows = G.ROWS.arr_tetras;
            var arr_score = [0, 0];
            var arr_i_score = [0, 0];
            for (var i76 = 0; i76 < all_rows.length; i76++) {
                arr_i_score = G.AI.VALUE.f_calc_row_4(position, all_rows[i76]);
                arr_score[0] += arr_i_score[0];
                arr_score[1] += arr_i_score[1];
            }
            var score_player = arr_score[n_player_will_play - 1];
            var score_oppenent = arr_score[(3 - n_player_will_play) - 1];

            return score_player - score_oppenent;
        }
    },

    f_negamax: function (position, depth, n_player_will_play) {
        if (depth <= 0) {
            return G.AI.VALUE.f_calc_position(position, n_player_will_play);
        }

        var arr_moves = G.RULES.f_generate_best_moves(position, n_player_will_play);
        if (arr_moves.length == 0) { return 0; }

        //when we attack or defense, we make force move
        if (arr_moves.length == 1) {
            G.RULES.MOVE.f_do(position, arr_moves[0]);

            var forced_value = G.AI.VALUE.const_max_score - depth;
            var is_win = G.RULES.f_is_row_4(position, arr_moves[0], true);
            //if no win, we defense
            if (!is_win) {
                forced_value = G.AI.f_negamax(position, depth, 3 - n_player_will_play);
            }

            G.RULES.MOVE.f_undo(position, arr_moves[0]);
            return forced_value;
        }

        var value = -Infinity;
        var value_i = 0;
        for (var i = 0; i < arr_moves.length; i++) {
            G.RULES.MOVE.f_do(position, arr_moves[i]);
            value_i = G.AI.f_negamax(position, depth - 1, 3 - n_player_will_play);
            G.RULES.MOVE.f_undo(position, arr_moves[i]);
            value = Math.max(value, value_i);
        }
        return -value;
    },

    f_best_move: function (position, depth, n_player_will_play) {
        var arr_moves = G.RULES.f_generate_best_moves(position, n_player_will_play);

        var best_score = Infinity;
        var best_i = 0;
        var i_score = 0;

        for (var i = 0; i < arr_moves.length; i++) {
            G.RULES.MOVE.f_do(position, arr_moves[i]);
            i_score = G.AI.f_negamax(position, depth - 1, 3 - n_player_will_play);
            G.RULES.MOVE.f_undo(position, arr_moves[i]);

            if (i_score < best_score) {
                best_score = i_score;
                best_i = i;
            }
        }

        return arr_moves[best_i];
    }
};