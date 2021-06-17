(function f_set_events() {
    for (var i_player = 2; i_player <= G.SETS.n_max_players; i_player++) {
        document.getElementById("id_n_players_" + i_player).onclick = G.EL.f_set_span_colors;
    }
    G.EL.f_set_span_colors();

    G.SVG.f_set_svg_sizes(3);

    G.EL.f_do_sumbit_angles();
    G.EL.button_submit.onclick = G.EL.f_do_sumbit_angles;

    G.SVG.MAIN.addEventListener("mousedown", G.SVG.MOUSE.f_event_click);
    G.EL.button_back.onclick = G.EL.f_button_back;
    G.EL.button_new_game.onclick = G.EL.f_button_new_game;

    window.onresize = G.EL.f_resize;
    window.addEventListener("orientationchange", function() {G.EL.f_resize(); }, false);
    G.EL.f_resize();
}());