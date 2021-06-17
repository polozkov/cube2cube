G.CONVERT = {
    f_n_to_string: function (r, n_digits) {
        //special case is when real nubmer is integer
        if (r == r.toFixed(0)) { return (r + '') };
    
        //if n_digits is UNDEFINED default value = 2;
        //s is the string (maybe with fanal zeros)
        var s = r.toFixed((n_digits !== undefined) ? n_digits : 2) + '';
    
        //delete final zeros of non-integer decimal fraction
        while (s.slice(-1) === '0') { s = s.slice(0, -1) };
    
        //check, that it is no final dot
        if (s.slice(-1) === '.') { s = s.slice(0, -1) };
    
        //final result will be string without unUsed final zeros (at he end, like 3.250000)
        return s;
    },

    f_arr_01_to_string_with_comma: function (arr_coord, accuracy_to_n_decimal_signs) {
        var str_x = G.CONVERT.f_n_to_string(arr_coord[0], accuracy_to_n_decimal_signs);
        var str_y = G.CONVERT.f_n_to_string(arr_coord[1], accuracy_to_n_decimal_signs);
        return (str_x + ',' + str_y);
    },

    f_order_to_perm: function (arr_of_obj_with_i) {
        var arr_result = [];
        for (var i = 0; i < arr_of_obj_with_i.length; i++) {
            arr_result.push(arr_of_obj_with_i[i].i);
        }
        return arr_result;
    }
};

G.SORT = {
    f_obj_value_i_bubble: function (arr_order) {
        var temp, new_n = 0, n = arr_order.length;
        //swap for bubble sort
        function f_swap(a, b) {
            temp = arr_order[a].i; arr_order[a].i = arr_order[b].i; arr_order[b].i = temp;
            temp = arr_order[a].value; arr_order[a].value = arr_order[b].value; arr_order[b].value = temp;
        };

        //bubble sort from English Wikipedia
        do {
            new_n = 0;
            for (i = 1; i < n; i++) {
                if (arr_order[i - 1].value > arr_order[i].value) {
                    f_swap(i - 1, i);
                    new_n = i;
                }
            }
            n = new_n;
        } while (n > 1);
    }
}
