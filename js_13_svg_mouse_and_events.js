G.EL.SVG.MOUSE = {
    f_is_xy_on_cell: function (p_xy, n_64, arr_cube_perm) {
        var cube = arr_cube_perm.cubes[n_64];
        return cube.f_is_point_on_face_z(p_xy);
    },

    f_search_pressed_cell: function (p_xy, arr_cube_perm) {
        for (var i64 = 0; i64 < 64; i64++) {
            //can do move here (on i64)
            if (G.EL.D3.f_is_legal_to_put(i64, G.EL.MOVES.arr_64_colors)) {
                //it is top face of cube, you press inside parallelogram
                if (G.EL.SVG.MOUSE.f_is_xy_on_cell(p_xy, i64, arr_cube_perm)) {
                    return i64;
                }
            }
        }
        return null;
    },

    //window corner of SVG
    f_svg_corner: function () {
        var box = G.EL.SVG.MAIN.getBoundingClientRect();
        return (new G.F_XY(box.left, box.top));
    },

    f_get_xy_by_event: function (clicked_event) {
        //coordinates from the SVG corner (client XY is window coordinates)
        var ex = clicked_event.clientX - G.EL.SVG.MOUSE.f_svg_corner().x;
        var ey = clicked_event.clientY - G.EL.SVG.MOUSE.f_svg_corner().y;
        return new G.F_XY(ex, ey);
    },

    //copm play, when cube is not full
    f_comp_play: function () {
        var best_move = G.AI.f_best_move(G.EL.MOVES.arr_64_colors, G.AI.depth, G.EL.MOVES.n_player_now);

        G.EL.MOVES.f_move_do(best_move.n_64, best_move.n_player);
        G.EL.ACTIONS.f_do_sumbit_angles();


        var win_row = G.RULES.f_is_row_4(G.EL.MOVES.arr_64_colors, best_move, true);
        if (win_row) {
            G.EL.ACTIONS.f_show_victory(best_move, win_row);
            return;
        }

        //game is finished in draw
        if (G.RULES.f_is_full_cube(G.EL.MOVES.arr_64_colors)) {
            return;
        }
    },

    f_event_click: function (clicked_event) {
        var xy = G.EL.SVG.MOUSE.f_get_xy_by_event(clicked_event);
        var n_cell = G.EL.SVG.MOUSE.f_search_pressed_cell(xy, G.EL.arr_cube_with_perm);

        if (n_cell != null) {
            var new_move = { n_64: n_cell, n_player: G.EL.MOVES.n_player_now };
            var win_row = G.RULES.f_is_row_4(G.EL.MOVES.arr_64_colors, new_move, false); //false if no winning rows

            G.EL.MOVES.f_move_do(n_cell, G.EL.MOVES.n_player_now);
            G.EL.ACTIONS.f_do_sumbit_angles();

            //human wins
            if (win_row) {
                G.EL.ACTIONS.f_show_victory(new_move, win_row);
                return;
            }

            //game is finished in draw
            if (G.RULES.f_is_full_cube(G.EL.MOVES.arr_64_colors)) {
                return;
            }

            if (G.EL.MOVES.game_comp_mode == G.EL.MOVES.n_player_now) {
                G.EL.SVG.MOUSE.f_comp_play();
            }
        }
    }
};

(function f_set_events() {
    for (var iz = 0; iz < 4; iz++) {
        for (var iy = 0; iy < 4; iy++) {
            for (var ix = 0; ix < 4; ix++) {
                G.EL.arr_64_to_xyz.push([ix, iy, iz]);
            }
        }
    }
    G.EL.BUTTONS.arr_game_modes[0].onclick = function () { G.EL.BUTTONS.f_set_game_mode(0) };
    G.EL.BUTTONS.arr_game_modes[1].onclick = function () { G.EL.BUTTONS.f_set_game_mode(1) };
    G.EL.BUTTONS.arr_game_modes[2].onclick = function () { G.EL.BUTTONS.f_set_game_mode(2) };
    G.EL.BUTTONS.f_set_game_mode(G.EL.MOVES.game_comp_mode);

    G.EL.SVG.f_set_svg_sizes(3);

    G.EL.ACTIONS.f_do_sumbit_angles();
    G.EL.FORM.button_submit.onclick = G.EL.ACTIONS.f_do_sumbit_angles;

    G.EL.SVG.MAIN.addEventListener("mousedown", G.EL.SVG.MOUSE.f_event_click);
    G.EL.BUTTONS.back.onclick = G.EL.BUTTONS.f_back;
    G.EL.BUTTONS.new_game.onclick = G.EL.BUTTONS.f_new_game;

    window.onresize = G.EL.ACTIONS.f_resize;
    window.addEventListener("orientationchange", function () { G.EL.ACTIONS.f_resize(); }, false);
    G.EL.ACTIONS.f_resize();
}());

//G.EL.MOVES. arr_64_colors[0] = 1;
//G.EL.MOVES. arr_64_colors[1] = 1;
//G.EL.MOVES. arr_64_colors[2] = 1;

//G.EL.MOVES. arr_64_colors[4] = 1;
//G.EL.MOVES. arr_64_colors[8] = 1;



