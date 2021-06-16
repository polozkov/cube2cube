G.SVG = {
    MAIN: document.getElementById("id_svg_game"),
    AREAS: {
        //all svg from (0,0) to (width, heigth)
        total: G.F_AB.f_by_m22([[0, 0], [0, 0]]),
        //area for transformed cubes to inscribe
        local: G.F_AB.f_by_m22([[0, 0], [0, 0]])
    },

    //parallelogram
    f_path_d_by_face_coord: function (face_coord) {
        var p0 = G.CONVERT.f_arr_01_to_string_with_comma(face_coord[0].v) + " ";
        var p1 = G.CONVERT.f_arr_01_to_string_with_comma(face_coord[1].v) + " ";
        var p2 = G.CONVERT.f_arr_01_to_string_with_comma(face_coord[2].v) + " ";
        var p3 = G.CONVERT.f_arr_01_to_string_with_comma(face_coord[3].v);
        return p0 + p1 + p2 + p3;
    },

    f_create_face: function (face_coord, n_owner) {
        var points = 'points="' + G.SVG.f_path_d_by_face_coord(face_coord.p4) + '"';
        var RGB_fill = G.SETS.RGB.arr_players[n_owner];
        var svg_string = '<polygon fill=' + RGB_fill + ' stroke="black" ' + points + ' />' + '\n';
        return svg_string;
    },

    f_create_cube: function (obj_cube, n_owner) {
        var face_arr = obj_cube.f_get_sorted_min_or_max(1);
        var svg_string = '';
        for (var i_face = 0; i_face < face_arr.length; i_face++) {
            svg_string = svg_string + G.SVG.f_create_face(face_arr[i_face], n_owner);
        };
        return svg_string;
    },

    f_create_64_cells: function (arr_64, area_00, gap_xy_h, m_transform, ab_total) {
        var arr_cube_color = G.BOARD_3D.f_coord_64_arr_cube_color_n(arr_64, area_00, gap_xy_h, m_transform);
        var arr_cubes = [];
        var svg_string = '';

        G.SVG.AREAS.local = arr_cube_color[0].cube.f_get_min_max_area();
        for (var i64 = 0; i64 < 64; i64++) {
            arr_cubes.push(arr_cube_color[i64].cube);
            G.SVG.AREAS.local = G.SVG.AREAS.local.f_op_union(arr_cube_color[i64].cube.f_get_min_max_area());
        }

        for (var i64 = 0; i64 < 64; i64++) {
            var placed_cube = arr_cubes[i64].f_inscribe_in_area(ab_total, false, G.SVG.AREAS.local);
            if (G.BOARD_3D.f_is_visible([arr_cube_color[i64].n], arr_64)) {
                svg_string = svg_string + G.SVG.f_create_cube(placed_cube, arr_cube_color[i64].color);
            }
        }
        return svg_string;
    },

    f_set_svg_sizes: function (y_top, repeat_n_times) {
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

            working_area_h = Math.max(working_area_h - y_top);

            G.SVG.MAIN.style.width = Math.floor(working_area_w) + "px";
            G.SVG.MAIN.style.height = Math.floor(working_area_h) + "px";

            G.SVG.AREAS.total.b.x = G.SVG.MAIN.clientWidth;
            G.SVG.AREAS.total.b.y = G.SVG.MAIN.clientHeight;
        }
    }
};

