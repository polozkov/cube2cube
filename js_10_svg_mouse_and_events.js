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

    f_event_click: function (clicked_event) {
        var xy = G.EL.SVG.MOUSE.f_get_xy_by_event(clicked_event);
        var n_cell = G.EL.SVG.MOUSE.f_search_pressed_cell(xy, G.EL.arr_cube_with_perm);
        if (n_cell != null) {
            G.EL.MOVES.f_move_do(n_cell, G.EL.MOVES.n_player_now);
            G.EL.ACTIONS.f_do_sumbit_angles();
            G.EL.ACTIONS.f_set_span_colors();
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

    for (var i_player = 2; i_player <= G.SETS.n_max_players; i_player++) {
        document.getElementById("id_n_players_" + i_player).onclick = G.EL.f_set_span_colors;
    }
    G.EL.ACTIONS.f_set_span_colors();

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


