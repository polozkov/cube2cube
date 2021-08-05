G.AI = {
    depth: 3,

    VALUE: {
        const_max_score: 10000,
        //score for rows of 0,1,2,3,4 signs in row
        arr_score_for_row: [0, 3, 7, 100, 1000],

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

    //player 1 is maximizing
    f_minimax: function (position, depth, maximizing_player) {
        //game victory by opponent
        if (G.RULES.f_is_game_victory(position, 3 - maximizing_player)) {
            return -(G.AI.VALUE.const_max_score + G.RULES.f_n_empty_cells(position));
        }

        if (depth <= 0) {
            return G.AI.VALUE.f_calc_position(position, maximizing_player);
        }

        var value;
        var arr_moves = G.RULES.f_generate_best_moves(position, maximizing_player);
        var len = arr_moves.length;
        if (len == 0) { return 0; }

        var value_i;
        if (maximizing_player == 1) {
            value = -Infinity;
            for (var i = 0; i < len; i++) {
                G.RULES.MOVE.f_do(position, arr_moves[i]);
                value_i = G.AI.f_minimax(position, depth - ((len===1) ? 0 : 1), 3 - maximizing_player);
                G.RULES.MOVE.f_undo(position, arr_moves[i]);
                value = Math.max(value, value_i);
            }
        } else {
            value = Infinity;
            for (var i = 0; i < len; i++) {
                G.RULES.MOVE.f_do(position, arr_moves[i]);
                value_i = G.AI.f_minimax(position, depth - ((len===1) ? 0 : 1), maximizing_player);
                G.RULES.MOVE.f_undo(position, arr_moves[i]);
                value = Math.min(value, value_i);
            }
        }
        return value;
    },

    f_negamax: function (position, depth, n_player_will_play) {
        if (depth <= 0) {
            return G.AI.VALUE.f_calc_position(position, n_player_will_play);
        }

        var arr_moves = G.RULES.f_generate_best_moves(position, n_player_will_play);
        var len = arr_moves.length;

        if (len == 0) {return 0; };

        var value = -Infinity;
        var value_i;

        for (var i = 0; i < len; i++) {
            G.RULES.MOVE.f_do(position, arr_moves[i]);
            value_i = G.AI.f_negamax(position, depth - 1, 3 - n_player_will_play);
            G.RULES.MOVE.f_undo(position, arr_moves[i]);

            value = Math.max(value, value_i);
        }
        return -value;
    },

    f_best_move: function (position, depth, who) {
        var arr_moves = G.RULES.f_generate_best_moves(position, who);
        if (arr_moves.length == 1) {console.log('force'); return arr_moves[0]; };

        var i_score = 0;
        var best_i = 0;
        var best_score = -G.AI.VALUE.const_max_score * 2;

        //when comp is second player, best score is minimun

        for (var i = 0; i < arr_moves.length; i++) {
            G.RULES.MOVE.f_do(position, arr_moves[i]);
            i_score = -G.AI.f_minimax(position, depth, 3 - who);
            G.RULES.MOVE.f_undo(position, arr_moves[i]);

            if (i_score > best_score) {
                best_score = i_score;
                best_i = i;
            }
        }

        console.log(best_score, arr_moves[best_i]);
        if (arr_moves.length == 1) { console.log(arr_moves[0].n_64, '\n');}

        return arr_moves[best_i];
    }
};