//create_matrix 4 by 4 (it is matrix of 4 vector-rows)
G.F4_MATRIX = function (m) { this.m = m; };

(function f_alternative_constructors_for_matrix_4_by_4() {
    G.F4_MATRIX.f_by_copy = function (m) { return new G.F4_MATRIX([m[0].slice(), m[1].slice, m[2].slice, m[3].slice()]); }

    G.F4_MATRIX.f_unit = function () {return new G.F4_MATRIX([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]); };
    G.F4_MATRIX.UNIT = G.F4_MATRIX.f_unit();

    G.F4_MATRIX.f_by_rotate_axes = function (angle_degree, ia, ib) {
        var obj_m = G.F4_MATRIX.f_unit();
        var sin = Math.sin(angle_degree * Math.PI / 180);
        var cos = Math.cos(angle_degree * Math.PI / 180);
        obj_m.m[ia][ia] = cos;
        obj_m.m[ia][ib] = sin;
        obj_m.m[ib][ia] = -sin;
        obj_m.m[ib][ib] = cos;
        return obj_m;
    };

    G.F4_MATRIX.f_by_rotate_z = function (degree) { return G.F4_MATRIX.f_by_rotate_axes(degree, 0, 1); }
    G.F4_MATRIX.f_by_rotate_y = function (degree) { return G.F4_MATRIX.f_by_rotate_axes(degree, 0, 2); }
    G.F4_MATRIX.f_by_rotate_x = function (degree) { return G.F4_MATRIX.f_by_rotate_axes(degree, 1, 2); }

    //scale transformation for gotten array [0..3] of vector v
    G.F4_MATRIX.f_by_scale = function (arr_v) {
        return new G.F4_MATRIX([[arr_v[0], 0, 0, 0], [0, arr_v[1], 0, 0], [0, 0, arr_v[2], 0], [0, 0, 0, arr_v[3]]]);
    };

    //translate transformation for gotten array [0..3] of vector v
    G.F4_MATRIX.f_by_translate = function (arr_v) {
        return new G.F4_MATRIX([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], arr_v.slice()]);
    };

    G.F4_MATRIX.f_by_xy_scale_translate = function (xy_scale, xy_translate) {
        var s = [xy_scale.x, xy_scale.y, 0, 1];
        var t = [xy_translate.x, xy_translate.y, 0, 1];
        return new G.F4_MATRIX([[s[0], 0, 0, 0], [0, s[1], 0, 0], [0, 0, 1, 0], t.slice()]);
    };

    //inscribe ab_old in ab_total (preserve ratio)
    G.F4_MATRIX.f_by_two_areas = function (ab_old, ab_total, can_press) {
        var ab_new = (can_press ? ab_total : ab_total.f_center_maximize(ab_old.f_get_wh()));
        var xy_scale = ab_new.f_get_wh().f_div(ab_old.f_get_wh());

        var c_old = ab_old.f_get_center();
        var c_new = ab_new.f_get_center();

        var scaled_old = c_old.f_mult(xy_scale);
        var xy_translate = c_new.f_sub(scaled_old);
        
        var s = [xy_scale.x, xy_scale.y, 0, 1];
        var t = [xy_translate.x, xy_translate.y, 0, 1];

        return new G.F4_MATRIX([[s[0], 0, 0, 0], [0, s[1], 0, 0], [0, 0, 1, 0], t.slice()]);
    };
}());

G.F4_MATRIX.prototype = {
    f_matrix_mult: function (obj_matrix_b) {
        var a = this.m, b = obj_matrix_b.m;

        //R is main (row), C is column in x-line
        function f_matrix_el(R, C) {
            return ((a[R][0] * b[0][C]) + (a[R][1] * b[1][C]) + (a[R][2] * b[2][C]) + (a[R][3] * b[3][C]));
        }
        return (new G.F4_MATRIX(G.GENERATE.f_matrix_by_function(f_matrix_el, 4, 4)));
    },
    f_rotate_z: function (d) { return this.f_matrix_mult(G.F4_MATRIX.f_by_rotate_z(d)); },
    f_rotate_y: function (d) { return this.f_matrix_mult(G.F4_MATRIX.f_by_rotate_y(d)); },
    f_rotate_x: function (d) { return this.f_matrix_mult(G.F4_MATRIX.f_by_rotate_x(d)); }
};