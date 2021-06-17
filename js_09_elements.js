G.EL = {
    FORM: {
        input_x: document.getElementById("id_input_x"),
        input_y: document.getElementById("id_input_y"),
        input_z: document.getElementById("id_input_z"),
        button_submit: document.getElementById("id_button_submit"),

        //matrix with rotations on axis (x, y, z)
        f_m: function () {
            var x = G.EL.FORM.input_x.value;
            var y = G.EL.FORM.input_y.value;
            var z = G.EL.FORM.input_z.value;
            return G.F4_MATRIX.f_by_rotate_x(x).f_rotate_y(y).f_rotate_z(z)
        },
    },

    //from 000 to 333
    arr_64_to_xyz: [],

    //cubes coordinates and their order (from back to forward)
    arr_cube_with_perm: {},

    //area of base of zero cube
    area_00: G.F_AB.f_by_m22([[0, 0], [10, 10]]),

    //gaps between cubes and height
    gap_xy_h: [12, 12, 10],

    MOVES: {
        //amount of players
        n_players: document.getElementById("id_form_n_players").n_players.value,
        //who play now
        n_player_now: 1,
        //owners of cells
        arr_64_colors: G.GENERATE.f_array_by_function(function f(i) { return 0; }, 64),

        arr_moves: [],

        f_move_do: function (n_64, n_player) {
            G.EL.MOVES.arr_moves.push({ n_64: n_64, n_player: n_player });
            G.EL.MOVES.arr_64_colors[n_64] = n_player;
            G.EL.MOVES.n_player_now = (G.EL.MOVES.n_player_now == G.EL.MOVES.n_players) ? 1 : (G.EL.MOVES.n_player_now + 1);
        },

        f_move_undo: function () {
            var len = G.EL.MOVES.arr_moves.length;
            if (len == 0) { return; }

            var last_move = G.EL.MOVES.arr_moves.pop();
            G.EL.MOVES.arr_64_colors[last_move.n_64] = 0;

            G.EL.MOVES.n_player_now = (G.EL.MOVES.n_player_now == 1) ? G.EL.MOVES.n_players : (G.EL.MOVES.n_player_now - 1);
        },

        f_move_undo_all: function () {
            for (var i = G.EL.MOVES.arr_moves.length; i > 0; i--) {
                G.EL.MOVES.f_move_undo();
            }
        }
    },

    D3: {
        //calculate by area_00 and gap_xy_h
        f_area_local: function (m_transform) {
            var wh = G.EL.area_00.f_get_wh();
            var wh_step = wh.f_add(new G.F_XY(G.EL.gap_xy_h[0], G.EL.gap_xy_h[1]));
            var ab_xy = new G.F_AB(G.EL.area_00.a, G.EL.area_00.b.f_add(wh_step.f_scale(3)));

            var p000 = [ab_xy.a.x, ab_xy.a.y, 0];
            var p111 = [ab_xy.b.x, ab_xy.b.y, G.EL.gap_xy_h[2] * 4];

            var cube = G.F_CUBE.f_by_two_points(p000, p111);
            var cube_transform = cube.f_transform_cube(m_transform);

            return cube_transform.f_get_min_max_area();
        },

        f_is_visible: function (n_64, arr_64) {
            return ((n_64 < 16) || (arr_64[n_64] > 0));
        },

        f_is_legal_to_put: function (n_64, arr_64) {
            return ((arr_64[n_64] == 0) && ((n_64 < 16) || (arr_64[n_64 - 16] > 0)));
        },

        f_arr_64_cubes_with_perm: function (m_transform, area_total, arr_owners_64) {
            var area_local = G.EL.D3.f_area_local(m_transform);

            function f_cube_nxyz(n_xyz, owner) {
                var wh = G.EL.area_00.f_get_wh();
                var wh_step = wh.f_add(new G.F_XY(G.EL.gap_xy_h[0], G.EL.gap_xy_h[1]));
                var xy_step = wh_step.f_mult(new G.F_XY(n_xyz[0], n_xyz[1]));

                var h = G.EL.gap_xy_h[2];
                var xyz_0 = [xy_step.x + G.EL.area_00.a.x, xy_step.y + G.EL.area_00.a.y, n_xyz[2] * h];
                var h_cube = (((n_xyz[2] > 0) || (owner > 0)) ? h : 0);
                var xyz_1 = [xy_step.x + G.EL.area_00.b.x, xy_step.y + G.EL.area_00.b.y, n_xyz[2] * h + h_cube];

                var cube = G.F_CUBE.f_by_two_points(xyz_0, xyz_1);
                var cube_transform = cube.f_transform_cube(m_transform);
                return cube_transform.f_inscribe_in_area(area_total, false, area_local);
            }

            var arr_cubes = [];
            var arr_order = [];
            for (var i64 = 0; i64 < 64; i64++) {
                arr_cubes.push(f_cube_nxyz(G.EL.arr_64_to_xyz[i64], arr_owners_64[i64]));
                arr_order.push({ value: arr_cubes[i64].f_get_cube_center().v[2], i: i64 });
            }
            G.SORT.f_obj_value_i_bubble(arr_order);
            return { perm: G.CONVERT.f_order_to_perm(arr_order), cubes: arr_cubes };
        }
    },

    SVG: {
        MAIN: document.getElementById("id_svg_game"),

        //SVG area from (0,0) to (width,height)
        area_total: G.F_AB.f_by_m22([[0, 0], [0, 0]]),

        //parallelogram
        f_path_d_by_face_coord: function (face_coord) {
            var p0 = G.CONVERT.f_arr_01_to_string_with_comma(face_coord[0].v) + " ";
            var p1 = G.CONVERT.f_arr_01_to_string_with_comma(face_coord[1].v) + " ";
            var p2 = G.CONVERT.f_arr_01_to_string_with_comma(face_coord[2].v) + " ";
            var p3 = G.CONVERT.f_arr_01_to_string_with_comma(face_coord[3].v);
            return p0 + p1 + p2 + p3;
        },

        f_create_64_svg_cells: function (arr_cube_perm, arr_owners_64) {
            var arr_face_perm = arr_cube_perm.cubes[0].f_permutation_face();
            var svg_board = '';

            function f_face(face_coord, n_owner) {
                var points = 'points="' + G.EL.SVG.f_path_d_by_face_coord(face_coord) + '"';
                var RGB_fill = G.SETS.RGB.arr_players[n_owner];
                var svg_face = '<polygon fill=' + RGB_fill + ' stroke="black" ' + points + ' />' + '\n';

                return svg_face;
            }

            function f_cube_i(obj_cube, n_owner) {
                var svg_cube = '';
                for (var i6 = 0; i6 < 6; i6++) {
                    svg_cube = svg_cube + f_face(obj_cube.f_get_face(arr_face_perm[i6]).p4, n_owner);
                };
                return svg_cube;
            }

            for (var i64 = 0; i64 < 64; i64++) {
                if (G.EL.D3.f_is_visible(i64, arr_owners_64)) {
                    svg_board = svg_board + f_cube_i(arr_cube_perm.cubes[i64], arr_owners_64[i64]);
                }
            }
            return '<g stroke-linejoin="round">' + svg_board + '</g>';
        },

        f_set_svg_sizes: function (repeat_n_times) {
            for (; repeat_n_times > 0; repeat_n_times--) {
                var working_area_w = Math.min(
                    document.body.scrollWidth || Infinity, document.documentElement.scrollWidth || Infinity,
                    document.body.offsetWidth || Infinity, document.documentElement.offsetWidth || Infinity,
                    document.body.clientWidth || Infinity, document.documentElement.clientWidth || Infinity
                );

                var working_area_h = Math.min(
                    document.body.scrollHeight || Infinity, document.documentElement.scrollHeight || Infinity,
                    document.body.offsetHeight || Infinity, document.documentElement.offsetHeight || Infinity,
                    document.body.clientHeight || Infinity, document.documentElement.clientHeight || Infinity
                );

                var y_top = G.EL.SVG.MAIN.getBoundingClientRect().top;
                working_area_h = working_area_h - y_top;

                G.EL.SVG.MAIN.style.width = Math.floor(working_area_w) + "px";
                G.EL.SVG.MAIN.style.height = Math.floor(working_area_h) + "px";

                G.EL.SVG.area_total.b.x = G.EL.SVG.MAIN.clientWidth;
                G.EL.SVG.area_total.b.y = G.EL.SVG.MAIN.clientHeight;
            }
        }
    },

    ACTIONS: {
        f_do_sumbit_angles: function () {
            var m = G.EL.FORM.f_m();

            G.EL.arr_cube_with_perm = G.EL.D3.f_arr_64_cubes_with_perm(m, G.EL.SVG.area_total, G.EL.MOVES.arr_64_colors);

            var CUBE_SVG = G.EL.SVG.f_create_64_svg_cells(G.EL.arr_cube_with_perm, G.EL.MOVES.arr_64_colors);

            G.EL.SVG.MAIN.innerHTML = CUBE_SVG;
        },

        f_set_span_colors: function () {
            G.EL.MOVES.n_players = document.getElementById("id_form_n_players").n_players.value;

            for (var i_color = 1; i_color <= G.SETS.n_max_players; i_color++) {
                var el_span = document.getElementById("id_rgb_" + i_color);
                el_span.style = "color: " + G.SETS.RGB.arr_players[i_color];

                var is_visible = (i_color <= G.EL.MOVES.n_players);
                var is_active = (i_color == G.EL.MOVES.n_player_now);
                el_span.innerHTML = is_visible ? (is_active ? "ХОДЯТ:█, " : "█, ") : "";
            }
        },

        f_resize: function () {
            G.EL.SVG.f_set_svg_sizes(3);
            G.EL.ACTIONS.f_do_sumbit_angles();
        }
    },

    BUTTONS: {
        back: document.getElementById("id_button_back"),
        new_game: document.getElementById("id_button_new_game"),

        f_back: function () {
            G.EL.MOVES.f_move_undo();
            G.EL.ACTIONS.f_do_sumbit_angles();
            G.EL.ACTIONS.f_set_span_colors();
        },

        f_new_game: function () {
            G.EL.MOVES.f_move_undo_all();
            G.EL.ACTIONS.f_do_sumbit_angles();
            G.EL.ACTIONS.f_set_span_colors();
        }
    }
};