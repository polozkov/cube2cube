//vertices of the cube (or unit cube if is undefined)
G.F_CUBE = function (get_arr_points) {
    this.v8 = get_arr_points;
};

//cube with zero centerr and vertices in [-1,-1,-1] to [1,1,1]
G.F_CUBE.f_by_two_points = function (a, b) {
    var p8 = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
    var i = 0, p = [], v8 = [];
    for (i = 0; i < 8; i++) {
        p = p8[i];
        v8.push(new G.F4_VECTOR([a[0] + (b[0] - a[0]) * p[0], a[1] + (b[1] - a[1]) * p[1], a[2] + (b[2] - a[2]) * p[2], 1]));
    }
    return (new G.F_CUBE(v8));
};

G.F_CUBE.f_by_side_2 = function () { return G.F_CUBE.f_by_two_points([-1, -1, -1], [1, 1, 1]); };

(function f_set_prototype_F_CUBE() {
    G.F_CUBE.prototype.f_transform_cube = function (obj_transformation_matrix) {
        var new_v8 = G.GENERATE.f_array_by_value(null, 8);
        for (var p = 0; p < 8; p++) { new_v8[p] = this.v8[p].f_mult_to_m(obj_transformation_matrix); }
        return new G.F_CUBE(new_v8);
    };

    //get point xyz: 0: 000, 1: 100, 2: 010, 3: 110, 4: 001... 
    G.F_CUBE.prototype.f_get_point = function (i) { return this.v8[i[0] + i[1] * 2 + i[2] * 4]; };

    //A,B,C,D: array [0..2] of 0 or 1;
    G.F_CUBE.prototype.f_get_face_by_4_points = function (A, B, C, D) {
        var p4 = [this.f_get_point(A), this.f_get_point(B), this.f_get_point(C), this.f_get_point(D)];
        var center = p4[0].f_add_xyz(p4[1].v).f_add_xyz(p4[2].v).f_add_xyz(p4[3].v).f_scale_n(0.25);
        return { p4: p4, center: center };
    };

    G.F_CUBE.FACE_X0 = [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]];
    G.F_CUBE.FACE_X1 = [[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]];
    G.F_CUBE.FACE_Y0 = [[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 0]];
    G.F_CUBE.FACE_Y1 = [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]];
    G.F_CUBE.FACE_Z0 = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]];
    G.F_CUBE.FACE_Z1 = [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
    G.F_CUBE.FACES_ARR = [G.F_CUBE.FACE_X0, G.F_CUBE.FACE_X1, G.F_CUBE.FACE_Y0, G.F_CUBE.FACE_Y1, G.F_CUBE.FACE_Z0, G.F_CUBE.FACE_Z1];

    G.F_CUBE.prototype.f_get_face = function (face_05) {
        var ABCD = G.F_CUBE.FACES_ARR[face_05];
        return this.f_get_face_by_4_points(ABCD[0], ABCD[1], ABCD[2], ABCD[3]);
    };

    G.F_CUBE.prototype.f_get_min_max_area = function () {
        var p_min = this.v8[0].v.slice();
        var p_max = this.v8[0].v.slice();

        for (var p = 1; p < 8; p++) {
            for (var i = 0; i < 4; i++) {
                p_min[i] = Math.min(p_min[i], this.v8[p].v[i]);
                p_max[i] = Math.max(p_max[i], this.v8[p].v[i]);
            }
        }
        return G.F_AB.f_by_m22([p_min, p_max]);
    };

    G.F_CUBE.prototype.f_get_cube_center = function () {
        return (this.v8[0].f_add_xyz(this.v8[7].v).f_scale_n(0.5));
    };

    G.F_CUBE.prototype.f_permutation_face = function () {
        var arr_faces = [], arr_order = [], i;

        for (i = 0; i < 6; i++) {
            arr_faces.push(this.f_get_face(i));
            //order has property i (index)
            arr_order.push({ i: i, value: arr_faces[i].center.v[2] });
        }
        G.SORT.f_obj_value_i_bubble(arr_order);
        return G.CONVERT.f_order_to_perm(arr_order);
    };

    G.F_CUBE.prototype.f_inscribe_in_area = function (ab_total, can_press, ab_this) {
        var m = G.F4_MATRIX.f_by_two_areas(ab_this || this.f_get_min_max_area(), ab_total, can_press);
        return (this.f_transform_cube(m));
    };

    G.F_CUBE.prototype.f_is_point_on_face_z = function (p_xy) {
        //face Z0
        var p4 = this.f_get_face(4).p4;
        function f_is_in(na, nb) {
            var va = [p4[na].v[0] - p_xy.x, p4[na].v[1] - p_xy.y];
            var vb = [p4[nb].v[0] - p_xy.x, p4[nb].v[1] - p_xy.y];
            return ((va[0] * vb[1] - va[1] * vb[0]) >= 0);
        }
        return (f_is_in(0, 1) && f_is_in(1, 2) && f_is_in(2, 3) && f_is_in(3, 0))
    } 
}());