G.SVG.MOUSE = {
    f_svg_corner: function () { return G.EL.f_corner_window_coordinates(G.SVG.MAIN); },

    f_get_xy_by_event: function (clicked_event) {
        //coordinates from the SVG corner (client XY is window coordinates)
        var ex = clicked_event.clientX - G.SVG.MOUSE.f_svg_corner().x;
        var ey = clicked_event.clientY - G.SVG.MOUSE.f_svg_corner().y;
        return new G.F_XY(ex, ey);
    },

    f_event_click: function (clicked_event) {
        var xy = G.SVG.MOUSE.f_get_xy_by_event(clicked_event);
        if (G.PROCESS.f_search_pressed_cell(xy) != null) {
            G.PROCESS.f_move_do(G.PROCESS.f_search_pressed_cell(xy), G.PROCESS.n_player_now);
            G.EL.f_do_sumbit_angles();
            G.EL.f_set_span_colors();
        }
    }
};


