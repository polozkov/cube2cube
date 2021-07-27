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
                if ((ia < ib) && (ib < ic)) {
                    var arr_abc = [G.ROWS.t.n64_to_xyz[ia], G.ROWS.t.n64_to_xyz[ib], G.ROWS.t.n64_to_xyz[ic]];
                    var delta_1 = G.ROWS.f_triplet_minus(arr_abc[1], arr_abc[0]);
                    var delta_2 = G.ROWS.f_triplet_minus(arr_abc[2], arr_abc[1]);
                    //check that deltas are equal
                    if (G.ROWS.f_triplets_are_equal(delta_1, delta_2)) {
                        G.ROWS.arr_trios.push([ia, ib, ic]);
                    }
                }
                for (var id = ic; id < 64; id++) {
                    if ((ia < ib) && (ib < ic) && (ic < id)) {
                        var arr_xyz = [G.ROWS.t.n64_to_xyz[ia], G.ROWS.t.n64_to_xyz[ib], G.ROWS.t.n64_to_xyz[ic], G.ROWS.t.n64_to_xyz[id]];
                        var d1 = G.ROWS.f_triplet_minus(arr_xyz[1], arr_xyz[0]);
                        var d2 = G.ROWS.f_triplet_minus(arr_xyz[2], arr_xyz[1]);
                        var d3 = G.ROWS.f_triplet_minus(arr_xyz[3], arr_xyz[2]);
                        //check that deltas are equal
                        if (G.ROWS.f_triplets_are_equal(d1, d2) && G.ROWS.f_triplets_are_equal(d1, d3)) {
                            G.ROWS.arr_tetras.push([ia, ib, ic, id]);
                        }
                    }
                }
            }
        }
    }
    //console.log(G.ROWS.arr_tetras);
    //console.log(G.ROWS.arr_trios);

    function f_sort(a, i, j) {
        if (a[i] <= a[j]) { return; }
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }

    function f_all_tetras_with_cell(n64) {
        var arr_result_tetras = [];

        function f_check_and_add_to_arr_trios(a) {
            //sort only last element
            f_sort(a, 2, 3); f_sort(a, 1, 2); f_sort(a, 0, 1);
            if ((a[0] == a[1]) || (a[1] == a[2]) || (a[2] == a[3])) { return; };

            var arr_xyz = [G.ROWS.t.n64_to_xyz[a[0]], G.ROWS.t.n64_to_xyz[a[1]], G.ROWS.t.n64_to_xyz[a[2]], G.ROWS.t.n64_to_xyz[a[3]]];

            var d1 = G.ROWS.f_triplet_minus(arr_xyz[1], arr_xyz[0]);
            var d2 = G.ROWS.f_triplet_minus(arr_xyz[2], arr_xyz[1]);
            var d3 = G.ROWS.f_triplet_minus(arr_xyz[3], arr_xyz[2]);

            //check that deltas are equal
            if (G.ROWS.f_triplets_are_equal(d1, d2) && G.ROWS.f_triplets_are_equal(d1, d3)) { arr_result_tetras.push(a); }
        }

        for (var ia = 0; ia < 64; ia++) {
            for (var ib = 0; ib < ia; ib++) {
                for (var ic = 0; ic < ib; ic++) {
                    f_check_and_add_to_arr_trios([ic, ib, ia, n64]);
                }
            }
        }

        return arr_result_tetras;
    }

    function f_all_trios_with_cell(n64) {
        var arr_result_trios = [];

        function f_check_and_add_to_arr_trios(a) {
            //sort only last element
            if (a[2] < a[1]) { a = [a[0], a[2], a[1]]; };
            if (a[1] < a[0]) { a = [a[1], a[0], a[2]]; };
            if (a[2] < a[1]) { a = [a[0], a[2], a[1]]; };
            if ((a[0] == a[1]) || (a[1] == a[2])) { return; };

            var arr_xyz = [G.ROWS.t.n64_to_xyz[a[0]], G.ROWS.t.n64_to_xyz[a[1]], G.ROWS.t.n64_to_xyz[a[2]]];

            var d1 = G.ROWS.f_triplet_minus(arr_xyz[1], arr_xyz[0]);
            if ((Math.max(d1[0], d1[1], d1[2]) > 1) || (Math.min(d1[0], d1[1], d1[2]) < (-1))) { return };

            var d2 = G.ROWS.f_triplet_minus(arr_xyz[2], arr_xyz[1]);
            if ((Math.max(d2[0], d2[1], d2[2]) > 1) || (Math.min(d2[0], d2[1], d2[2]) < (-1))) { return };

            //check that deltas are equal, so: arr_xyz[1] is the center of (arr_xyz[0],arr_xyz[2])
            if (G.ROWS.f_triplets_are_equal(d1, d2)) { arr_result_trios.push(a); }
        }

        for (var ia = 0; ia < 64; ia++) {
            for (var ib = 0; ib < ia; ib++) {
                f_check_and_add_to_arr_trios([ib, ia, n64]);
            }
        }
        return arr_result_trios;
    }

    G.ROWS.arr_64.tetras = G.GENERATE.f_array_by_function(f_all_tetras_with_cell, 64);
    G.ROWS.arr_64.trios = G.GENERATE.f_array_by_function(f_all_trios_with_cell, 64);


    //console.log(G.ROWS.arr_64.trios[1]);
    //console.log(G.ROWS.arr_64.trios);

    //console.log("\n ---");
    //console.log(G.ROWS.arr_64.tetras[0]);
    //console.log(G.ROWS.arr_64.tetras[1]);
    //console.log(G.ROWS.arr_64.tetras);

    //debugger

    //console.log(G.ROWS.t.n64_to_xyz);
    //console.log(G.ROWS.t.xyz_to_n64);
}());