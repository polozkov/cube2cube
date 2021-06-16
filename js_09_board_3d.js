G.BOARD_3D = {
    //from 000 to 333
    arr_64_to_xyz: [],

    f_is_visible: function (n_64, arr_64) {
        return ((n_64 < 16) || (arr_64[n_64] > 0));
    },

    f_is_legal_to_put: function (n_64, arr_64) {
        return ((arr_64[n_64] == 0) && ((n_64 < 16) || (arr_64[n_64 - 16] > 0)));
    },

    f_cube_by_nxyz: function (n_xyz, area_00, gap_xy_h, owner) {
        var wh = area_00.f_get_wh();
        var wh_step = wh.f_add(new G.F_XY(gap_xy_h[0], gap_xy_h[1]));
        var xy_step =  wh_step.f_mult(new G.F_XY(n_xyz[0], n_xyz[1]));
        var h = gap_xy_h[2];
        var xyz_0 = [xy_step.x + area_00.a.x, xy_step.y + area_00.a.y, n_xyz[2] * h];
        var h_cube = (((owner > 0) || (n_xyz[2] > 0)) ? h : 0);
        var xyz_1 = [xy_step.x + area_00.b.x, xy_step.y + area_00.b.y, n_xyz[2] * h + h_cube];

        return G.F_CUBE.f_by_two_points(xyz_0, xyz_1);
    },

    f_coord_64_arr_cubes_arr_order: function (arr_64, area_00, gap_xy_h, m_transform) {
        var arr_cubes = [];
        var arr_order = [];
        var i_xyz;

        for (i64 = 0; i64 < 64; i64++) {
            i_xyz = G.BOARD_3D.arr_64_to_xyz[i64];
            arr_cubes.push(G.BOARD_3D.f_cube_by_nxyz(i_xyz, area_00, gap_xy_h, arr_64[i64]).f_transform_cube(m_transform));
            arr_order.push({value: arr_cubes[i64].f_get_cube_center().v[2], i: i64});
        }

        G.SORT.f_obj_value_i_bubble(arr_order);
        return {arr_cubes: arr_cubes, arr_order: arr_order};
    },

    f_coord_64_arr_cube_color_n: function (arr_64, area_00, gap_xy_h, m_transform) {
        var obj_64 = G.BOARD_3D.f_coord_64_arr_cubes_arr_order(arr_64, area_00, gap_xy_h, m_transform);
        var result_obj = [], i64, i;
        for (i64 = 0; i64 < 64; i64++) {
            i = obj_64.arr_order[i64].i;
            result_obj.push({cube: obj_64.arr_cubes[i], color: arr_64[i], n: i});
        }
        return result_obj;
    }
};

(function f_set_arr_64_to_xyz() {
    for (var iz = 0; iz < 4; iz++) {
        for (var iy = 0; iy < 4; iy++) {
            for (var ix = 0; ix < 4; ix++) {
                G.BOARD_3D.arr_64_to_xyz.push([ix, iy, iz]);
            }
        }
    }
}());
