G.BOARD_3D = {
    area_00: G.F_AB.f_by_m22([[0, 0], [10, 10]]),
    gap_xy_h: [12, 12, 10],

    //calculate by area_00 and gap_xy_h
    f_area_local: function (m_transform) {
        var wh = G.BOARD_3D.area_00.f_get_wh();
        var wh_step = wh.f_add(new G.F_XY(G.BOARD_3D.gap_xy_h[0], G.BOARD_3D.gap_xy_h[1]));
        var ab_xy = new G.F_AB(G.BOARD_3D.area_00.a, G.BOARD_3D.area_00.b.f_add(wh_step.f_scale(3)));

        var p000 = [ab_xy.a.x, ab_xy.a.y, 0];
        var p111 = [ab_xy.b.x, ab_xy.b.y, G.BOARD_3D.gap_xy_h[2] * 4];

        var cube = G.F_CUBE.f_by_two_points(p000, p111);
        var cube_transform = cube.f_transform_cube(m_transform);

        return cube_transform.f_get_min_max_area();
    },

    //from 000 to 333
    arr_64_to_xyz: [],

    f_is_visible: function (n_64, arr_64) {
        return ((n_64 < 16) || (arr_64[n_64] > 0));
    },

    f_is_legal_to_put: function (n_64, arr_64) {
        return ((arr_64[n_64] == 0) && ((n_64 < 16) || (arr_64[n_64 - 16] > 0)));
    },

    f_arr_64_cubes_with_perm: function (m_transform, area_total, arr_owners_64) {
        var area_local = G.BOARD_3D.f_area_local(m_transform);

        function f_cube_nxyz(n_xyz, owner) {
            var wh = G.BOARD_3D.area_00.f_get_wh();
            var wh_step = wh.f_add(new G.F_XY(G.BOARD_3D.gap_xy_h[0], G.BOARD_3D.gap_xy_h[1]));
            var xy_step =  wh_step.f_mult(new G.F_XY(n_xyz[0], n_xyz[1]));

            var h = G.BOARD_3D.gap_xy_h[2];
            var xyz_0 = [xy_step.x + G.BOARD_3D.area_00.a.x, xy_step.y + G.BOARD_3D.area_00.a.y, n_xyz[2] * h];
            var h_cube = (((n_xyz[2] > 0) || (owner > 0)) ? h : 0);
            var xyz_1 = [xy_step.x + G.BOARD_3D.area_00.b.x, xy_step.y + G.BOARD_3D.area_00.b.y, n_xyz[2] * h + h_cube];

            var cube = G.F_CUBE.f_by_two_points(xyz_0, xyz_1);
            var cube_transform = cube.f_transform_cube(m_transform);
            return cube_transform.f_inscribe_in_area(area_total, false, area_local);
        }

        var arr_cubes = [];
        var arr_order = [];
        for (var i64 = 0; i64 < 64; i64++) {
            arr_cubes.push(f_cube_nxyz(G.BOARD_3D.arr_64_to_xyz[i64], arr_owners_64[i64]));
            arr_order.push({value: arr_cubes[i64].f_get_cube_center().v[2], i: i64});
        }
        G.SORT.f_obj_value_i_bubble(arr_order);
        return {perm: G.CONVERT.f_order_to_perm(arr_order), cubes: arr_cubes};
    }
};

(function f_set_arr_64_to_xyz_and_area_local() {
    for (var iz = 0; iz < 4; iz++) {
        for (var iy = 0; iy < 4; iy++) {
            for (var ix = 0; ix < 4; ix++) {
                G.BOARD_3D.arr_64_to_xyz.push([ix, iy, iz]);
            }
        }
    }
}());
