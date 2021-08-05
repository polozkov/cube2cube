//rows of 3 cells on cube 4*4*4
G.ROWS = {
    arr_26_trios: [
        [1, 1, 1], [1, 1, 0], [1, 1, -1], [1, 0, 1], [1, 0, 0], [1, 0, -1], [1, -1, 1], [1, -1, 0], [1, -1, -1],
        [0, 1, 1], [0, 1, 0], [0, 1, -1], [0, 0, 1], [0, 0, -1], [0, -1, 1], [0, -1, 0], [0, -1, -1],
        [-1, 1, 1], [-1, 1, 0], [-1, 1, -1], [-1, 0, 1], [-1, 0, 0], [-1, 0, -1], [-1, -1, 1], [-1, -1, 0], [-1, -1, -1]
    ],

    //convert (transfer n64 to xyz and back)
    t: {
        n64_to_xyz: [],
        xyz_to_n64: []
    },

    //a - b
    f_triplet_minus: function (a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; },
    //is triplet a equal to b
    f_triplets_are_equal: function (a, b) { return ((a[0] === b[0]) && (a[1] === b[1]) && (a[2] === b[2])); },

    //all tetras in cube
    arr_tetras: [],
    //all trios in cube
    arr_trios: [],

    arr_64: {
        trios: [],  //all triplets for each cell
        tetras: [], //arr rows of 4 for each cell
    }
};

(function f_set_rows() {
    var n = 0;
    for (var iz = 0; iz < 4; iz++) {
        G.ROWS.t.xyz_to_n64.push([]);
        for (var iy = 0; iy < 4; iy++) {
            G.ROWS.t.xyz_to_n64[iz].push([]);
            for (var ix = 0; ix < 4; ix++) {
                G.ROWS.t.n64_to_xyz.push([ix, iy, iz]);
                G.ROWS.t.xyz_to_n64[iz][iy].push(n);
                n++;
            }
        }
    }

    function f_try_push_abc(ia, ib, ic) {
        if ((ia >= ib) || (ib >= ic)) { return; }

        var arr_abc = [G.ROWS.t.n64_to_xyz[ia], G.ROWS.t.n64_to_xyz[ib], G.ROWS.t.n64_to_xyz[ic], []];
        var delta_1 = G.ROWS.f_triplet_minus(arr_abc[1], arr_abc[0]);
        var delta_2 = G.ROWS.f_triplet_minus(arr_abc[2], arr_abc[1]);

        //check that deltas are equal
        if (!G.ROWS.f_triplets_are_equal(delta_1, delta_2)) { return; }
        G.ROWS.arr_trios.push([ia, ib, ic])

        for (var id = ic + 1; id < 64; id++) {
            arr_abc[3] = G.ROWS.t.n64_to_xyz[id];
            var delta_3 = G.ROWS.f_triplet_minus(arr_abc[3], arr_abc[2]);
            //check that deltas are equal
            if (G.ROWS.f_triplets_are_equal(delta_2, delta_3)) {
                G.ROWS.arr_tetras.push([ia, ib, ic, id]);
            }
        }
    }

    //set G.ROWS.arr_tetras and .arr_trios
    for (var ia = 0; ia < 64; ia++) {
        for (var ib = ia; ib < 64; ib++) {
            for (var ic = ib; ic < 64; ic++) {
                f_try_push_abc(ia, ib, ic)
            }
        }
    }

    function f_all_rows_with_cell(n64, all_rows, cell_rows) {
        cell_rows[n64] = [];
        for (var i = 0; i < all_rows.length; i++) {
            for (var j = 0; j < all_rows[i].length; j++) {
                if (n64 == all_rows[i][j]) {
                    cell_rows[n64].push(all_rows[i].slice())
                }
            }
        }
    }

    for (var t64 = 0; t64 < 64; t64++) {
        f_all_rows_with_cell(t64, G.ROWS.arr_tetras, G.ROWS.arr_64.tetras);
        f_all_rows_with_cell(t64, G.ROWS.arr_trios, G.ROWS.arr_64.trios);
    }


    //console.log(G.ROWS.arr_tetras);
    
    //console.log(G.ROWS.arr_64.trios[1]);
    //console.log(G.ROWS);

    //console.log("\n ---");
    //console.log(G.ROWS.arr_64.tetras[0]);
    //console.log(G.ROWS.arr_64.tetras[1]);
    //console.log(G.ROWS.arr_64.tetras);

    //debugger

    //console.log(G.ROWS.t.n64_to_xyz);
    //console.log(G.ROWS.t.xyz_to_n64);
}());