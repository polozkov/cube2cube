//rows of 4 and 3 cells on cube 4*4*4
G.ROWS = {
    //is cell xyz on cube 4*4*4?
    f_is_xyz_on_cube_board: function (xyz) {
        return (0 <= xyz[0]) && (xyz[0] < 4) && (0 <= xyz[1]) && (xyz[1] < 4) && (0 <= xyz[2]) && (xyz[2] < 4);
    },

    //multiply all coordinates on number n
    f_mult_delta: function (xyz, n) {
        return [xyz[0] * n, xyz[1] * n, xyz[2] * n];
    },

    //add two coordinates
    f_add_delta: function (xyz_from, xyz_delta) {
        return [xyz_from[0] + xyz_delta[0], xyz_from[1] + xyz_delta[1], xyz_from[2] + xyz_delta[2]];
    },

    //rows of 3
    R3: {
        //13..1 in 3*3*3; positive from the end before negative (one direction)
        ARR_DIRS_XYZ: [
            [1, 1, 1], [0, 1, 1], [-1, 1, 1],
            [1, 0, 1], [0, 0, 1], [-1, 0, 1],
            [1, -1, 1], [0, -1, 1], [-1, -1, 1],
            [1, 1, 0], [0, 1, 0], [-1, 1, 0],
            [1, 0, 0]],
        //rows of exactly 3 cells, that can not be extended
        ARR_3_UNIQUE: [],
    },

    //rows of 4
    R4: {
        //21, 5, -11...
        ARR_DIRS_DELTAS: [],
        f_xyz_to_delta: function (xyz) { return xyz[0] * 16 + xyz[1] * 4 + xyz[2] },
        ARR_N64_TO_XYZ: [],
        ARR_UNIQUE: []
    },

    R64: {

    }
};

(function f_set_arr_for_G_ROWS() {
    var i, j;

    for (i = 0; i < 64; i++) {
        G.ROWS.R4.ARR_N64_TO_XYZ[i] = [Math.floor(i / 16), Math.floor(i / 4) % 4, i % 4];
    }

    for (i = 0; i < G.ROWS.R3.ARR_DIRS_XYZ.length; i++) {
        G.ROWS.R4.ARR_DIRS_DELTAS[i] = G.ROWS.R4.f_xyz_to_delta(G.ROWS.R3.ARR_DIRS_XYZ[i]);
    }

    function f_is_row_4(xyz_from, xyz_d, len_3_or_4) {
        var xyz_delta = G.ROWS.f_mult_delta(xyz_d, len_3_or_4);
        var xyz_new = G.ROWS.f_add_delta(xyz_from, xyz_delta);
        if (!G.ROWS.f_is_xyz_on_cube_board(xyz_new)) {return false;}
        if (len_3_or_4 == 3) {
            var xyz_pre = G.ROWS.f_add_delta(xyz_from, G.ROWS.f_mult_delta(xyz_d, -1));
            return G.ROWS.f_is_xyz_on_cube_board(xyz_pre);
        }
        return (len_3_or_4 != 3);
    }

    function f_arr4_by_from_and_delta(xyz_from, xyz_delta, len_3_or_4) {
        var xyz_1 = G.ROWS.f_add_delta(xyz_from, xyz_delta);
        var xyz_2 = G.ROWS.f_add_delta(xyz_1, xyz_delta);
        var arr_len_3 = [xyz_from.slice(), xyz_1, xyz_2];
        if (len_3_or_4 == 4) {
            arr_len_3.push(G.ROWS.f_add_delta(xyz_2, xyz_delta));
        }
        return arr_len_3;
    }

    for (i = 0; i < 64; i++) {
        var xyz_from = G.ROWS.R4.ARR_N64_TO_XYZ[i];
        for (j = 0; j < 13; j++) {
            var xyz_delta = G.ROWS.R3.ARR_DIRS_XYZ[j]
            if (f_is_row_4(xyz_from, xyz_delta)) {
                G.ROWS.R4.ARR_UNIQUE.push(f_arr4_by_from_and_delta(xyz_from, xyz_delta));
            }
        }
    }
}());

debugger