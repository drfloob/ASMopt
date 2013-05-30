function SimplexModule(stdlib, foreign, heap) {
    "use asm";

    var sqrt = stdlib.Math.sqrt;
    var HEAP32F = new stdlib.Float32Array(heap);
    var HEAP32I = new stdlib.Int32Array(heap);
    

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
    function simplex_opt() {
	var varcnt= 0, rowcnt= 0, i= 0, j=0, foff=0;

	varcnt= (HEAP32I[0])|0;
	rowcnt= (varcnt-1)|0;

	for(; (i|0) < (varcnt|0); i=(i+1)|0)
	    if (+HEAP32F[(i+2) >> 2] < +0)
		break;
	if ((i|0) == (varcnt|0))
	    return 1;
	i= (i+1)|0;

	foff = (varcnt+1)|0;
	for(; (j|0) < (rowcnt|0); j=(j+1)|0)
	    if (+HEAP32F[j+foff >> 2] < +0)
		break;
	if ((j|0) == (rowcnt|0))
	    return 0|0;

	return 2|0; // not done
    };

    function simplex_solve() {};

    return { solve: simplex_opt };
}


SimplexModule.setup = function(f, C) {
    var sizeMult = (f.length)|0;
    var minByteSize = Math.max(4096, Math.pow(f.length, 2) * 32 / 8);
    var mult = Math.ceil(Math.log(minByteSize)/Math.log(2));

    // console.log(sizeMult, minByteSize, mult);

    var heap = new ArrayBuffer(Math.pow(2, mult));
    var h = new Float32Array(heap);
    var hi = new Int32Array(heap);
    hi[0] = f.length;
    h.set(f, 1);
    for(var i=0; i<C.length; i++)
	h.set(C[i], (f.length+1)*(i+1));
    return heap;
}