//two points (rectangle area)
G.F_AB = function (a, b) { this.a = new G.F_XY(a.x, a.y); this.b = new G.F_XY(b.x, b.y); };

(function f_set_prototpe_for_F_AB() {
    //result area has zero size, besause point a and point b are equal ()
    G.F_AB.f_by_two_equal = function (get_point) { return new G.F_AB(get_point, get_point); };
    //constructor by matrix two by two
    G.F_AB.f_by_m22 = function (m22) { return new G.F_AB(G.F_XY.f_by_arr(m22[0]), G.F_XY.f_by_arr(m22[1])) };
    //constructor by center of rectangle and sizes wh
    G.F_AB.f_by_center_and_wh = function (c, wh) { return new G.F_AB(c.f_sub(wh.f_50()), c.f_add(wh.f_50())) };

    //width and height of the rectangle area
    G.F_AB.prototype.f_get_wh = function () { return this.b.f_sub(this.a); };
    //center of the rectangle area
    G.F_AB.prototype.f_get_center = function () { return this.b.f_add(this.a).f_50(); };

    //shift rectangle on (+px,+py)
    G.F_AB.prototype.f_op_add = function (p) { return new G.F_AB(this.a.f_add(p), this.b.f_add(p)); };
    //shift to make center in new point = THIS_AB + (NEW_CENTER - THIS_CENTER)
    G.F_AB.prototype.f_op_new_center = function (new_c) { return this.f_op_add(new_c.f_sub(this.f_get_center())); };
    //shift rectangle to the center in the new area (combine centers)
    G.F_AB.prototype.f_op_combine_center = function (new_c_ab) {return this.f_op_new_center(new_c_ab.f_get_center()); };

    //deep copy of gotten zone
    G.F_AB.prototype.f_op_copy = function () { return G.F_AB.f_by_m22([[this.a.x, this.a.y], [this.b.x, this.b.y]]); }
    //compare all 4 coordinates
    G.F_AB.prototype.f_op_equal = function (ab) { return (this.a.f_is_eq(ab.a) && this.b.f_is_eq(ab.b)); };

    //center is (0,0), corners are (1,1) and (-1,-1); calculate by the square coordinates
    G.F_AB.prototype.f_vector_for_arrow_by_pa_pb = function (relative_coord_axy, relative_coord_bxy) {
        var c00 = this.f_get_center();
        var step_xy = this.f_get_wh().f_50(); //square size is 2: from -1 to +1
        var new_a_from_00 = relative_coord_axy.f_mult(step_xy);
        var new_b_from_00 = relative_coord_bxy.f_mult(step_xy);
        return new G.F_AB(new_a_from_00.f_add(c00), new_b_from_00.f_add(c00));
    };

    //deep replasing of 4 coordinates
    G.F_AB.prototype.f_replace_ab = function (ab) {
        this.a.x = ab.a.x; this.a.y = ab.a.y;
        this.b.x = ab.b.x; this.b.y = ab.b.y;
    };

    //svaw this.a and this.b
    G.F_AB.prototype.f_swap_me = function () {
        var x = this.a.x; this.a.x = this.b.x; this.b.x = x;
        var y = this.a.y; this.a.y = this.b.y; this.b.y = y;
    };

    //compare gottten xy with this.a and this.b
    G.F_AB.prototype.f_has_cell_inside = function (checking_cell_nx_ny) {
        return (this.a.f_is_eq(checking_cell_nx_ny) || this.b.f_is_eq(checking_cell_nx_ny));
    };

    G.F_AB.prototype.f_has_pixel_inside = function (p) {
        //check MINx < ex < MAXx, MINy < ey < MAXy
        return ((this.a.x < p.x) && (p.x < this.b.x)) && ((this.a.y < p.y) && (p.y < this.b.y));
    };

    //combine THIS with gotten_ab: external frame a=(min,min) b=(max,max)
    G.F_AB.prototype.f_extend_point = function (p) {
        this.a.x = Math.min(this.a.x, this.b.x, p.x);
        this.a.y = Math.min(this.a.y, this.b.y, p.y);

        this.b.x = Math.max(this.a.x, this.b.x, p.x);
        this.b.y = Math.max(this.a.y, this.b.y, p.y);
    };

    //combine THIS with gotten_ab: external frame a=(min,min) b=(max,max)
    G.F_AB.prototype.f_op_union = function (ab) {
        var x1 = Math.min(this.a.x, this.b.x, ab.a.x, ab.b.x);
        var y1 = Math.min(this.a.y, this.b.y, ab.a.y, ab.b.y);

        var x2 = Math.max(this.a.x, this.b.x, ab.a.x, ab.b.x);
        var y2 = Math.max(this.a.y, this.b.y, ab.a.y, ab.b.y);
        return G.F_AB.f_by_m22([[x1, y1], [x2, y2]]);
    };

    //scale, but the center will be the same
    G.F_AB.prototype.f_center_scale = function (ratio) {
        var new_wh = this.f_get_wh().f_scale(ratio);
        var center = this.f_get_center();
        return G.F_AB.f_by_center_and_wh(center, new_wh);
    };

    //largest area with ratio nx/ny on this legal area
    G.F_AB.prototype.f_center_maximize = function (ratio_xy) {
        var new_wh = this.f_get_wh().f_ratio_maximize(ratio_xy);
        var new_ab_00_to_wh = new G.F_AB(G.F_XY.P00, new_wh);
        //we must preserve center position
        return new_ab_00_to_wh.f_op_combine_center(this);
    };

    //one rectangle cell (area borders in the rectangle grid)
    G.F_AB.prototype.f_cell_nxy = function (total_board_size_nx_ny, cell_xy) {
        //sizes of one cell (all cells have equal sizes)
        var cell_wh = this.f_get_wh().f_div(total_board_size_nx_ny);
        //left top corner of the cell_xy,  b will be equal
        var a = cell_wh.f_mult(cell_xy).f_add(this.a);
        return new G.F_AB(a, a.f_add(cell_wh));
    }
}());