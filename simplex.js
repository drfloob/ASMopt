function SimplexModule(stdlib, foreign, heap) {
    "use asm";

    var sqrt = stdlib.Math.sqrt;

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
    function simplex_opt(heap) {
	heap = 
	var varcnt= 0;
	varcnt= (sqrt(
	    heap.byteLength 
		/ 
		4.0)
		 -1)|0;

	var f= Float32Array(heap, 0, (varcnt+1)|0);
	var C= Float32Array(heap, ((varcnt+1)*4)|0);
	var rowcnt= (varcnt-1)|0;
	
	var i= 0|0, j=0|0;

	for(i=0|0; i< varcnt; i=(i+1)|0)
	    if (f[i+1] < 0)
		break;
	if (i == varcnt)
	    return 1|0;
	i= (i+1)|0;

	for(j=0|0; j<rowcnt; j=(j+1)|0)
	    if (C[j+i] < 0)
		break;
	if (j == rowcnt)
	    return 0|0;

	return 2|0; // not done
    };

    function simplex_solve() {};

    return { solve: simplex_opt };
}


SimplexModule.setup = function(f, C) {
    var sizeMult = (f.length/32)|0;
    var heap = new ArrayBuffer(4096*sizeMult);
    var h = new Float32Array(heap);
    h[0] = f.length;
    h.set(f, 1);
    for(var i=0; i<C.length; i++)
	h.set(C[i], (f.length+1)*(i+1));
    return heap;
}