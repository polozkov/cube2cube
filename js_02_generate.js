G.GENERATE = {
    f_array_by_function: function (f_element_i, length_of_array) {
        var arr_result = [];
        for (var i = 0; i < length_of_array; i++) {
            arr_result.push(f_element_i(i));
        };
        return arr_result;
    },
    
    f_array_by_value: function (each_element_value, length_of_array) {
        function f(i) {return each_element_value};
        return G.GENERATE.f_array_by_function(f, length_of_array);
    },

    f_matrix_by_function: function (f_element_i_main_j_inner, get_size_main, get_size_inner) {
        var matrix_result = [], i_main;
        //function will be used as parametr in G.f_generate_array
        function f_row(n_in_row) { return f_element_i_main_j_inner(i_main, n_in_row); };
    
        for (i_main = 0; i_main < get_size_main; i_main++) {
            matrix_result.push(G.GENERATE.f_array_by_function(f_row, get_size_inner));
        };
        return matrix_result;
    }
};