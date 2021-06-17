G.SVG = {
    MAIN: document.getElementById("id_svg_game"),
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
            var points = 'points="' + G.SVG.f_path_d_by_face_coord(face_coord) + '"';
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
            if (G.BOARD_3D.f_is_visible(i64, arr_owners_64)) {
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

            var y_top = G.SVG.MAIN.getBoundingClientRect().top;
            working_area_h = working_area_h - y_top;

            G.SVG.MAIN.style.width = Math.floor(working_area_w) + "px";
            G.SVG.MAIN.style.height = Math.floor(working_area_h) + "px";

            G.SVG.area_total.b.x = G.SVG.MAIN.clientWidth;
            G.SVG.area_total.b.y = G.SVG.MAIN.clientHeight;
        }
    }
};

