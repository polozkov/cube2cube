G.EL = {
    input_x: document.getElementById("id_input_x"),
    input_y: document.getElementById("id_input_y"),
    input_z: document.getElementById("id_input_z"),
    button_submit: document.getElementById("id_button_submit"),

    button_back: document.getElementById("id_button_back"),
    button_new_game: document.getElementById("id_button_new_game"),

    n_players: document.getElementById("id_form_n_players").n_players,

    f_do_sumbit_angles: function () {
        var m = G.PROCESS.f_m();

        G.PROCESS.arr_cube_with_perm = G.BOARD_3D.f_arr_64_cubes_with_perm(m, G.SVG.area_total, G.PROCESS.arr_64_colors);

        var CUBE_SVG = G.SVG.f_create_64_svg_cells(G.PROCESS.arr_cube_with_perm, G.PROCESS.arr_64_colors);

        G.SVG.MAIN.innerHTML = CUBE_SVG;
    },

    f_set_span_colors: function () {
        for (var i_color = 1; i_color <= G.SETS.n_max_players; i_color++) {
            var el_span = document.getElementById("id_rgb_" + i_color);
            el_span.style = "color: " + G.SETS.RGB.arr_players[i_color];

            var is_visible = (i_color <= G.EL.n_players.value);
            var is_active = (i_color == G.PROCESS.n_player_now);
            el_span.innerHTML = is_visible ? (is_active ? "ХОДЯТ:█, " : "█, ") : "";
        }
        G.PROCESS.n_players = G.EL.n_players.value;
    },

    //left top corner's coordinate
    f_corner_window_coordinates: function (elem) {
        var box = elem.getBoundingClientRect();
        return (new G.F_XY(box.left, box.top));
    },

    f_button_back: function () {
        G.PROCESS.f_move_undo();
        G.EL.f_do_sumbit_angles();
        G.EL.f_set_span_colors();
    },

    f_button_new_game: function () {
        G.PROCESS.f_move_undo_all();
        G.EL.f_do_sumbit_angles();
        G.EL.f_set_span_colors();
    },

    f_resize: function () {
        G.SVG.f_set_svg_sizes(3);
        G.EL.f_do_sumbit_angles();
    }
};


