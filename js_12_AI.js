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

    f_negamax: function (position, depth, n_player_will_play) {
        if (depth <= 0) {
            return G.AI.VALUE.f_calc_position(position, n_player_will_play);
        }

        var arr_moves = G.RULES.f_generate_best_moves(position, n_player_will_play);
        var len = arr_moves.length;

        //game is over in draw
        if (len == 0) { return 0; };

        //test if forse move
        if (len === 1) {
            //force move is attack (victory)
            if (G.RULES.f_is_row_4(position, arr_moves[0])) {
                return  (G.AI.VALUE.const_max_score + G.RULES.f_n_empty_cells(position));
            }
        }

        var value = -Infinity;
        var value_i;
        var new_depth = (len === 1) ? depth : depth - 1;

        for (var i = 0; i < len; i++) {
            G.RULES.MOVE.f_do(position, arr_moves[i]);
            value_i = -G.AI.f_negamax(position, new_depth, 3 - n_player_will_play);
            G.RULES.MOVE.f_undo(position, arr_moves[i]);

            value = Math.max(value, value_i);
        }
        return value;
    },

    //computers best move
    f_best_move: function (position, depth, who) {
        var arr_moves = G.RULES.f_generate_best_moves(position, who);
        if (arr_moves.length == 1) { return arr_moves[0]; };

        var i_score;
        var best_i = 0;
        var best_score = Infinity;

        //human is opponent, computer try minimize opponent
        for (var i = 0; i < arr_moves.length; i++) {
            G.RULES.MOVE.f_do(position, arr_moves[i]);
            i_score = G.AI.f_negamax(position, depth, 3 - who);
            //console.log(i, i_score, arr_moves[i]);
            G.RULES.MOVE.f_undo(position, arr_moves[i]);

            //computer minimizes human
            if (i_score < best_score) {
                best_score = i_score;
                best_i = i;
            }
        }
        //console.log("\n");
        //console.log(arr_moves[best_i].n_64 % 16, best_score, arr_moves[best_i]);
        //console.log("\n\n\n");
        if (arr_moves.length == 1) { console.log(arr_moves[0].n_64, '\n'); }

        return arr_moves[best_i];
    }
};