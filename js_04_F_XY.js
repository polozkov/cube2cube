//work with point xy
G.F_XY = function (x, y) { this.x = x; this.y = y; };

(function f_set_prototpe_for_F_XY() {
    //CONSTANTS points: Zero(0,0), point(1; 1), point(2,2) (0.5, 0.5), point Delta Right, Left, Down, Up
    G.F_XY.P00 = new G.F_XY(0, 0);
    G.F_XY.P11 = new G.F_XY(1, 1);
    G.F_XY.P22 = new G.F_XY(2, 2);
    G.F_XY.P_HALF = new G.F_XY(0.5, 0.5);

    G.F_XY.P_R = new G.F_XY(1, 0);
    G.F_XY.P_L = new G.F_XY(-1, 0);
    G.F_XY.P_D = new G.F_XY(0, 1);
    G.F_XY.P_U = new G.F_XY(0, -1);

    //create new object F_XY by array of 2 real or integer numbers 
    G.F_XY.f_by_arr = function (arr_2) { return new G.F_XY(arr_2[0], arr_2[1]); };
    //pair, where .x = .y = n
    G.F_XY.f_by_same_nn = function (n) { return new G.F_XY(n, n); };

    //arithmetical operation + - * / and scale (this.x*n, this.y*n)
    G.F_XY.prototype.f_add = function (p) { return new G.F_XY(this.x + p.x, this.y + p.y); };
    G.F_XY.prototype.f_sub = function (p) { return new G.F_XY(this.x - p.x, this.y - p.y); };
    G.F_XY.prototype.f_mult = function (p) { return new G.F_XY(this.x * p.x, this.y * p.y); };
    G.F_XY.prototype.f_div = function (p) { return new G.F_XY(this.x / p.x, this.y / p.y); };
    G.F_XY.prototype.f_scale = function (n) { return new G.F_XY(this.x * n, this.y * n); };

    //return dublicate object (.x, .y)
    G.F_XY.prototype.f_get_copy = function () { return new G.F_XY(this.x, this.y); };
    //minimal coordinate
    G.F_XY.prototype.f_get_min = function () { return Math.min(this.x, this.y); };
    //convert this object in array of two numbers = [.x, .y]
    G.F_XY.prototype.f_get_arr_01 = function () { return [this.x, this.y]; };
    G.F_XY.prototype.f_get_xy_ratio = function () {return (this.x / this.y); };

    //compare this (.x,.y) with gotthen object (p.x,p.y)
    G.F_XY.prototype.f_is_eq = function (p) { return ((this.x == p.x) && (this.y == p.y)) };
    //orientation: vert: 0;  hory or square: 1; 
    G.F_XY.prototype.f_vert_hory_01 = function () { return (this.x < this.y) ? 0 : 1; };
    //deep coping (replasing procedure)
    G.F_XY.prototype.f_replace_xy = function (new_xy) { this.x = new_xy.x, this.y = new_xy.y };

    //clockwise rotation in the screen coordinates
    G.F_XY.prototype.f_rotate_90 = function () { return new G.F_XY(-this.y, this.x); };
    //half (or 50 percent) of point coordinates (x/2, y/2)
    G.F_XY.prototype.f_50 = function (n) { return new G.F_XY(this.x / 2, this.y / 2); };

    //.this will scaled to make gotten ratio (ratio is real number)
    G.F_XY.prototype.f_ratio_n = function (r) {
        var x = this.x, y = this.y;
        return ((r * y) > x) ? //check, if wanted_ratio_x/y  >  this_x/y
            new G.F_XY(x, x / r) : new G.F_XY(y * r, y);
    };
    //.this will be cutten to make gotten ratio (ratio is equal to wanted_ratio_xy.x / wanted_ratio_xy.y)
    G.F_XY.prototype.f_ratio_maximize = function (wanted_ratio_xy) {
        return this.f_ratio_n(wanted_ratio_xy.x / wanted_ratio_xy.y);
    };
}());