//vector in 3D space with Homogeneous coordinates (p[3] = 1)
G.F4_VECTOR = function (point_XYZ) { this.v = point_XYZ; };

//unit vector for n_axis in [0..2]
G.F4_VECTOR.f_0001 = function () {return (new G.F4_VECTOR([0, 0, 0, 1])); };

G.F4_VECTOR.prototype = {
    //multiply this vector on gotten transform matrix:  this.v * obj_m
    f_mult_to_m: function (obj_matrix_b) {
        var a = this.v;
        var b = obj_matrix_b.m;
        function f_new_vector_coordinate(i) {return (a[0] * b[0][i]) + (a[1] * b[1][i]) + (a[2] * b[2][i]) + (a[3] * b[3][i]);}
        return (new G.F4_VECTOR(G.GENERATE.f_array_by_function(f_new_vector_coordinate, 4)));
    },

    //this.v[0..2] + xyz[0..2]
    f_add_xyz: function (xyz) {return (new G.F4_VECTOR([this.v[0] + xyz[0], this.v[1] + xyz[1], this.v[2] + xyz[2], this.v[3]]));},
    //this.v[0..2] + xyz[0..2]
    f_subtract_xyz: function (xyz) {return (new G.F4_VECTOR([this.v[0] - xyz[0], this.v[1] - xyz[1], this.v[2] - xyz[2], this.v[3]])); },
    //this.v[0..2] * xyz[0..2]
    f_mult_xyz: function (xyz) { return (new G.F4_VECTOR([this.v[0] * xyz[0], this.v[1] * xyz[1], this.v[2] * xyz[2], this.v[3]])); },
    //multiply 3 coordinates (x,y,z) on n_scale
    f_scale_n: function (n_scale) {return (new G.F4_VECTOR([this.v[0] * n_scale, this.v[1] * n_scale, this.v[2] * n_scale, this.v[3]]));},
    
    //make w = 1; and (x, y, z) scale to (x/w, y/w, z/w)
    f_get_normilize: function () {var w = this.v[3]; return (new G.F4_VECTOR([this.v[0] / w, this.v[1] / w, this.v[2] / w, 1])); },
    //dublicate (deep copy) of object F4_VECTOR 
    f_get_copy: function () {return (new G.F4_VECTOR(this.v.slice())); },

    f_projection_unit: function () {this.f_mult_to_m(G.F4_MATRIX.PROJECTION_UNIT_Z).f_get_normilize(); },
};

