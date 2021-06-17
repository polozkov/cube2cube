G.PROCESS = {
    arr_64_colors: G.GENERATE.f_array_by_function(function f(i) { return 0; }, 64),

    n_players: document.getElementById("id_form_n_players").n_players.value,
    n_player_now: 1,

    arr_moves: [],

    arr_cube_with_perm: {},

    f_move_do: function (n_64, n_player) {
        this.arr_moves.push({n_64: n_64, n_player: n_player});
        G.PROCESS.arr_64_colors[n_64] = n_player;
        G.PROCESS.n_player_now = (G.PROCESS.n_player_now == G.PROCESS.n_players) ? 1 : (G.PROCESS.n_player_now + 1);
    },

    f_move_undo: function () {
        var len = G.PROCESS.arr_moves.length;
        if (len == 0) {return; }

        var last_move = G.PROCESS.arr_moves.pop();
        G.PROCESS.arr_64_colors[last_move.n_64] = 0;

        G.PROCESS.n_player_now = (G.PROCESS.n_player_now == 1) ? G.PROCESS.n_players : (G.PROCESS.n_player_now - 1);
    },

    f_move_undo_all: function () {
        for (var i = G.PROCESS.arr_moves.length; i > 0; i--) {
            G.PROCESS.f_move_undo();
        }
    },
    //matrix with rotations on axis (x, y, z)
    f_m: function () {
        var x = G.EL.input_x.value;
        var y = G.EL.input_y.value;
        var z = G.EL.input_z.value;
        return G.F4_MATRIX.f_by_rotate_x(x).f_rotate_y(y).f_rotate_z(z)
    },

    f_is_xy_on_cell: function (p_xy, n_64, arr_cube_perm) {
        var cube = arr_cube_perm.cubes[n_64];
        return cube.f_is_point_on_face_z(p_xy);
    },

    f_search_pressed_cell: function (p_xy, arr_cube_perm) {
        for (var i64 = 0; i64 < 64; i64++) {
            //can do move here (on i64)
            if (G.BOARD_3D.f_is_legal_to_put(i64, G.PROCESS.arr_64_colors)) {
                //it is top face of cube, you press inside parallelogram
                if (G.PROCESS.f_is_xy_on_cell(p_xy, i64, arr_cube_perm)) {
                    return i64;
                }
            }
        }
        return null;
    }
};