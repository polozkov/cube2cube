G.PROCESS = {
    arr_64_colors: G.GENERATE.f_array_by_function(function f(i) { return 0; }, 64),

    n_players: document.getElementById("id_form_n_players").n_players.value,
    n_player_now: 1,

    arr_moves: [],

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

    ab: G.F_AB.f_by_m22([[0, 0], [10, 10]]),
    gap_xy_h: [12, 12, 10],

    //matrix with rotations on axis (x, y, z)
    f_m: function () {
        var x = G.EL.input_x.value;
        var y = G.EL.input_y.value;
        var z = G.EL.input_z.value;
        return G.F4_MATRIX.f_by_rotate_x(x).f_rotate_y(y).f_rotate_z(z)
    },

    f_cube_final_to_draw: function (n_64) {
        var cube = G.BOARD_3D.f_cube_by_nxyz(G.BOARD_3D.arr_64_to_xyz[n_64], G.PROCESS.ab, G.PROCESS.gap_xy_h, 0);
        var cube_transform = cube.f_transform_cube(G.PROCESS.f_m());
        var cube_result = cube_transform.f_inscribe_in_area(G.SVG.AREAS.total, false, G.SVG.AREAS.local);
        return cube_result;
    },

    f_is_xy_on_cell: function (p_xy, n_64) {
        var cube = G.PROCESS.f_cube_final_to_draw(n_64);
        return cube.f_is_point_on_face_z(p_xy);
    },

    f_search_pressed_cell: function (p_xy) {
        for (var i64 = 0; i64 < 64; i64++) {
            if (G.BOARD_3D.f_is_legal_to_put(i64, G.PROCESS.arr_64_colors)) {
                if (G.PROCESS.f_is_xy_on_cell(p_xy, i64)) {
                    return i64;
                }
            }
        }
        return null;
    }
};