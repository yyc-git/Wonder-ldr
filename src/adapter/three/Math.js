let createVector3 = (x, y, z) => {
    return new THREE.Vector3(x, y, z);
};

let createMatrix3 = (a1, a2, a3, a4, a5, a6, a7, a8, a9) => {
    let rotation = new THREE.Matrix3();
    rotation.set(a1, a2, a3, a4, a5, a6, a7, a8, a9);

    return rotation;
};

let THREEMathAdapter = {
    createVector3,
    createMatrix3
};