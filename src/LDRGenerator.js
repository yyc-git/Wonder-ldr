'use strict';

import { adapter } from "./adapter/Adapter"
import { LDRStep } from "./LDRStep"
import { LDRPartType } from "./LDRPartType"
import { LDRPartDescription } from "./LDRPartDescription"



export let make = function (id) {
    if (map.hasOwnProperty(id)) {
        return map[id]();
    }
    else {
        return null;
    }
}

export let makeP = function (desc, name) {
    let pt = new LDRPartType();

    pt.name = pt.ID = name;
    pt.modelDescription = desc;
    pt.author = 'LDRGenerator.js';
    pt.license = 'Redistributable under CCAL version 2.0 : see CAreadme.txt';
    pt.inlined = 'GENERATED';
    pt.ldraw_org = 'Primitive';
    pt.cleanSteps = pt.certifiedBFC = pt.CCW = pt.consistentFileAndName = true;
    pt.isPart = true;

    return pt;
}

export let makeR = function (a, b) {
    let ret = adapter.Matrix3.create(a, 0, 0, 0, b, 0, 0, 0, a);
    return ret;
}

export let addLinesToStep = function (step, lines) {
    for (let i = 0; i < lines.length; i += 6) {
        step.addLine(24,
            adapter.Vector3.create(lines[i], lines[i + 1], lines[i + 2]),
            adapter.Vector3.create(lines[i + 3], lines[i + 4], lines[i + 5])
        );
    }
}

export let addConditionalLinesToStep = function (step, lines) {
    for (let i = 0; i < lines.length; i += 12) {
        step.addConditionalLine(24,
            adapter.Vector3.create(lines[i], lines[i + 1], lines[i + 2]),
            adapter.Vector3.create(lines[i + 3], lines[i + 4], lines[i + 5]),
            adapter.Vector3.create(lines[i + 6], lines[i + 7], lines[i + 8]),
            adapter.Vector3.create(lines[i + 9], lines[i + 10], lines[i + 11])
        );
    }
}

export let addTrianglesToStep = function (step, triangles, color = 16) {
    for (let i = 0; i < triangles.length; i += 9) {
        step.addTriangle(color,
            adapter.Vector3.create(triangles[i], triangles[i + 1], triangles[i + 2]),
            adapter.Vector3.create(triangles[i + 3], triangles[i + 4], triangles[i + 5]),
            adapter.Vector3.create(triangles[i + 6], triangles[i + 7], triangles[i + 8])
        );
    }
}

export let addQuadsToStep = function (step, quads, color = 16) {
    for (let i = 0; i < quads.length; i += 12) {
        step.addQuad(color,
            adapter.Vector3.create(quads[i], quads[i + 1], quads[i + 2]),
            adapter.Vector3.create(quads[i + 3], quads[i + 4], quads[i + 5]),
            adapter.Vector3.create(quads[i + 6], quads[i + 7], quads[i + 8]),
            adapter.Vector3.create(quads[i + 9], quads[i + 10], quads[i + 11])
        );
    }
}

// export let makeEmpty = function(id = 'empty.dat') {
//     let pt = makeP(id, id);
//     pt.steps.push(new THREE.LDRStep());
//     return pt;
// }

export let makeCylinderClosed = function (sections) {
    let pt = makeP('Cylinder Closed ' + (sections * 0.25),
        sections + '-4cylc.dat');
    // let step = new THREE.LDRStep();
    let step = new LDRStep();

    let p0 = adapter.Vector3.create();
    let p1 = adapter.Vector3.create(0, 1, 0);
    let r = makeR(1, 1);

    // step.addSubModel(new LDRPartDescription(16, p0, r, sections + '-4edge.dat', true, false));
    // step.addSubModel(new LDRPartDescription(16, p1, r, sections + '-4edge.dat', true, false));
    // step.addSubModel(new LDRPartDescription(16, p0, r, sections + '-4disc.dat', true, false));
    // step.addSubModel(new LDRPartDescription(16, p0, r, sections + '-4cyli.dat', true, false));
    step.addSubModel(new LDRPartDescription(16, p0, r, sections + '-4edge.dat'));
    step.addSubModel(new LDRPartDescription(16, p1, r, sections + '-4edge.dat'));
    step.addSubModel(new LDRPartDescription(16, p0, r, sections + '-4disc.dat'));
    step.addSubModel(new LDRPartDescription(16, p0, r, sections + '-4cyli.dat'));

    pt.steps.push(step); // No need to user 'addStep()' for primitives.
    return pt;
}

export let makeCircle4 = function (sections) {
    let pt = makeP('Circle ' + (sections * 0.25),
        sections + '-4edge.dat');
    let step = new LDRStep();
    let prev = adapter.Vector3.create(1, 0, 0);
    for (let i = 1; i <= 4 * sections; i++) {
        let angle = i * Math.PI / 8;
        let c = Math.cos(angle), s = Math.sin(angle);
        let p = adapter.Vector3.create(c, 0, s);
        step.addLine(24, prev, p);
        prev = p;
    }
    pt.steps.push(step); // No need to user 'addStep()' for primitives.
    return pt;
}

export let makeCylinder = function (cond, sections) {
    let desc = 'Cylinder ' + (sections * 0.25);
    if (!cond) {
        desc += ' without Conditional Lines';
    }
    let pt = makeP(desc,
        sections + (cond ? '-4cyli.dat' : '-4cyli2.dat'));
    let step = new LDRStep();

    let p0 = adapter.Vector3.create(1, 0, 0), p1 = adapter.Vector3.create(1, 1, 0);
    let angle = Math.PI / 8;
    let c = Math.cos(angle), s = Math.sin(angle);
    let next0 = adapter.Vector3.create(c, 0, s);
    let next1 = adapter.Vector3.create(c, 1, s);

    for (let i = 2; i < 4 * sections + 2; i++) {
        let prev0 = p0, prev1 = p1;
        p0 = next0;
        p1 = next1;
        angle = i * Math.PI / 8;
        c = Math.cos(angle);
        s = Math.sin(angle);
        next0 = adapter.Vector3.create(c, 0, s);
        next1 = adapter.Vector3.create(c, 1, s);

        step.addQuad(16, prev1, p1, p0, prev0, true);
        if (cond) {
            step.addConditionalLine(24, p0, p1, prev0, next0);
        }
    }
    pt.steps.push(step); // No need to user 'addStep()' for primitives.
    return pt;
}

export let makeCylinderSloped = function (sections) {
    let desc = 'Cylinder Sloped ' + (sections * 0.25);
    let pt = makeP(desc, sections + '-4cyls.dat');
    let step = new LDRStep();

    let p0 = adapter.Vector3.create(1, 0, 0), p1 = adapter.Vector3.create(1, 0, 0);
    let angle = Math.PI / 8;
    let c = Math.cos(angle), s = Math.sin(angle);
    let next0 = adapter.Vector3.create(c, 0, s);
    let next1 = adapter.Vector3.create(c, 1 - c, s);

    for (let i = 2; i < 4 * sections + 2; i++) {
        let prev0 = p0, prev1 = p1;
        p0 = next0;
        p1 = next1;
        angle = i * Math.PI / 8;
        c = Math.cos(angle);
        s = Math.sin(angle);
        next0 = adapter.Vector3.create(c, 0, s);
        next1 = adapter.Vector3.create(c, 1 - c, s);

        if (i === 2) {
            step.addTriangle(16, prev1, p1, p0, true);
        }
        else if (i === 17) {
            step.addTriangle(16, prev1, p1, prev0, true);
        }
        else {
            step.addQuad(16, prev1, p1, p0, prev0, true);
        }
        step.addConditionalLine(24, p0, p1, prev0, next0);
    }
    pt.steps.push(step); // No need to user 'addStep()' for primitives.
    return pt;
}

export let makeDisc = function (sections) {
    let pt = makeP('Disc ' + (sections * 0.25),
        sections + '-4disc.dat');
    let step = new LDRStep();
    let zero = adapter.Vector3.create(0, 0, 0);
    let prev = adapter.Vector3.create(1, 0, 0);
    for (let i = 1; i <= 4 * sections; i++) {
        let angle = i * Math.PI / 8;
        let c = Math.cos(angle), s = Math.sin(angle);
        let p = adapter.Vector3.create(c, 0, s);
        step.addTriangle(16, zero, prev, p, true);
        prev = p;
    }
    pt.steps.push(step); // No need to user 'addStep()' for primitives.
    return pt;
}

export let makeRing = function (sections, size) {
    let pt = makeP('Ring ' + size + ' x ' + (0.25 * sections),
        sections + '-4ring' + size + '.dat');
    let step = new LDRStep();
    let SIZE = size + 1;
    let prev1 = adapter.Vector3.create(size, 0, 0);
    let prev2 = adapter.Vector3.create(SIZE, 0, 0);
    for (let i = 1; i <= 4 * sections; i++) {
        let angle = i * Math.PI / 8;
        let c = Math.cos(angle), s = Math.sin(angle);
        let p1 = adapter.Vector3.create(SIZE * c, 0, SIZE * s);
        let p2 = adapter.Vector3.create(size * c, 0, size * s);
        step.addQuad(16, p1, p2, prev1, prev2, true);
        prev1 = p2;
        prev2 = p1;
    }
    pt.steps.push(step); // No need to user 'addStep()' for primitives.
    return pt;
}

//// Content below copied from logo.dat by Paul Easter [pneaster]
// logoPositions = [[-2, -4, 2, -5, 2, -3.5] // L
//     ,
// [-2, 0, -2, -2, 2, -3, 2, -1], [0, -1, 0, -2.5], // E (Divided due to middle line)
//     ,
// [-1.5, 2.25, -2, 2, -2, 1, -1.5, 0.5, 1.5, -0.25, 2, 0, 2, 1, 1.5, 1.5, 0, 2, 0, 1] //G
//     ,
// [-1.5, 4.75, -2, 4.5, -2, 3.5, -1.5, 3, 1.5, 2.25, 2, 2.5, 2, 3.5, 1.5, 4, -1.5, 4.75] // O
// ];

// makeLogo1 = function() {
//     let pt = makeP('LEGO Logo for Studs - Non-3D Thin Lines', 'logo.dat');
//     pt.ldraw_org = 'Unofficial_Primitive';
//     let step = new THREE.LDRStep();

//     logoPositions.forEach(letter => {
// 	for(let i = 2; i < letter.length; i+=2) {
//             let p1 = new THREE.Vector3(letter[i-2], 0, letter[i-1]);
//             let p2 = new THREE.Vector3(letter[i], 0, letter[i+1]);
// 	    step.addLine(24, p1, p2);
// 	}
//     });

//     pt.steps.push(step); // No need to user 'addStep()' for primitives.
//     return pt;
// }



export let map = {
    '1-4edge.dat': () => makeCircle4(1),
    '2-4edge.dat': () => makeCircle4(2),
    '4-4edge.dat': () => makeCircle4(4),
    '1-4cyli.dat': () => makeCylinder(true, 1),
    '1-4cyli2.dat': () => makeCylinder(false, 1),
    '2-4cyli.dat': () => makeCylinder(true, 2),
    '2-4cyli2.dat': () => makeCylinder(false, 2),
    '4-4cyli.dat': () => makeCylinder(true, 4),
    '4-4cyli2.dat': () => makeCylinder(false, 4),
    '1-4cylc.dat': () => makeCylinderClosed(1),
    '2-4cylc.dat': () => makeCylinderClosed(2),
    '4-4cylc.dat': () => makeCylinderClosed(4),
    '1-4cyls.dat': () => makeCylinderSloped(1),
    '2-4cyls.dat': () => makeCylinderSloped(2),
    '4-4cyls.dat': () => makeCylinderSloped(4),
    '1-4disc.dat': () => makeDisc(1),
    '2-4disc.dat': () => makeDisc(2),
    //'3-4disc.dat': () => makeDisc(3), // TODO Check that this is correct!
    '4-4disc.dat': () => makeDisc(4),
    '2-4ring1.dat': () => makeRing(2, 1),
    '4-4ring2.dat': () => makeRing(4, 2),
    '4-4ring3.dat': () => makeRing(4, 3),
    '4-4ring5.dat': () => makeRing(4, 5),
    '4-4ring6.dat': () => makeRing(4, 6),
    // 'logo.dat': () => makeLogo1(),
    // 'empty.dat': () => makeEmpty()
};