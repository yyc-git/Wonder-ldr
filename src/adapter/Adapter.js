let adapter = {
};

let setAdapter = (mathAdapter, rendererAdapter) => {
    let _adapter = {
        createVector3: mathAdapter.createVector3,
        createMatrix3: mathAdapter.createMatrix3,
    }

    adapter = _adapter;
}