function SimplexModule(stdlib, foreign, heap) {
    "use asm";

    /**
     * Solves a simplex optimization problem presented in basic feasible solved form.
     * 
     * C: ArrayBuffer (Float32), ideally of length ((f.length)^2 - f.length)
     *     represents constant + constraint coefficients for each variable in (your) known order (including slack, if needed)
     *     the first entry for each "row" is treated as a static constant, the rest coefficients
     * f: ArrayBuffer (Float32)
     *     represents the objective function constant + coefficients for each variable in (your) known order (including slack, if needed)
     *     the first is treated as a static constant, the rest coefficients
     * 
     */
    function simplex_opt(i_C, i_f) {
	var f= Float32Array(i_f);
	var C= Float32Array(i_C);
	var varcnt= (f.length-1)|0;
	var rowcnt= (C.length/f.length)|0;
	
	var i= 0|0, j=0|0, J= 0|0;

	for(i=0|0; i< varcnt; i=(i+1)|0) {
	    if (f[i+1] < 0) {
		J=(i+1)|0;
		for(j=0|0; j<rowcnt; j=(j+1)|0) {
		    if (C[j+J] < 0) {
			
		    }
		    // if none, then no solution
		}
	    }
	    // if none, then solved
	}
    };

    function simplex_solve() {};

    return { solve: simplex_solve };
}