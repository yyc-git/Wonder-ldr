let LDRPartType = function () {
    this.name; // The value for '0 FILE' and '0 Name:'.
    this.ID = null; // this.name, but lower case and with backslashes replaced with forward slashes.
    this.modelDescription;
    this.author;
    this.license;
    this.steps = [];
    this.headerLines = [];
    // this.lastRotation = null;
    // this.replacement;
    this.inlined;
    this.ldraw_org;
    // this.geometry;
    // this.cnt = -1;
    // this.cleanSteps = false;
    // this.certifiedBFC;
    // this.CCW;
    this.consistentFileAndName;

    this.preferredColor;

    // // To support early cleanup:
    // this.referencedFrom = {};
    // this.references = 0;
}

LDRPartType.prototype.addStep = function (step) {
    if (step.isEmpty() && this.steps.length === 0) {
        return; // Totally illegal step.
    }

    // Update rotation in case of ADD;
    // if (step.rotation && step.rotation.type === "ADD") {
    //     if (!this.lastRotation) {
    //         step.rotation.type = "REL";
    //     }
    //     else {
    //         step.rotation = new LDRStepRotation(step.rotation.x + this.lastRotation.x,
    //             step.rotation.y + this.lastRotation.y,
    //             step.rotation.z + this.lastRotation.z,
    //             this.lastRotation.type);
    //     }
    // }

    // let sameRotation = LDRStepRotation.equals(step.rotation, this.lastRotation);
    // if (step.isEmpty() && sameRotation) {
    //     return; // No change.
    // }
    // if (this.steps.length > 0) {
    //     let prevStep = this.steps[this.steps.length - 1];
    //     if (prevStep.isEmpty() && sameRotation) {
    //         // Special case: Merge into previous step:
    //         this.steps[this.steps.length - 1] = step;
    //         return;
    //     }
    // }
    this.steps.push(step);
    // this.lastRotation = step.rotation;
}

LDRPartType.prototype.isPrimitive = function () {
    if (!this.ldraw_ord) {
        return false;
    }
    let lo = this.ldraw_org.split(' ')[0]; // First token.
    return lo === 'Primitive' || lo === 'Subpart' || lo === '8_Primitive' || lo === '48_Primitive';
}

LDRPartType.prototype.computeIsPart = function (loader) {
    // Simple checks:
    if (this.steps.length !== 1) {
        return false; // No steps in parts.
    }
    let s = this.steps[0];
    if (s.hasPrimitives) {
        return true; // Contains line, triangle or quad primitives.
    }

    // LDRAW_ORG checks:
    if (this.isOfficialLDraw()) {
        return true;
    }

    // Check sub-models. If any is a primitive or subpart, then this is a part:
    for (let i = 0; i < s.subModels.length; i++) {
        let t = loader.getPartType(s.subModels[i].ID);
        if (t) {
            if (t.isPrimitive()) {
                return true;
            }
            if (t.steps.length !== 1) {
                return false; // Sub model is not a part.
            }
        }
    }

    return this.ID.endsWith('.dat'); // Unsafe check as some old models used 'dat' for non-parts, but what can we do?
}


// Official LDraw part types: https://www.ldraw.org/article/398.html
LDRPartType.prototype.isOfficialLDraw = function () {
    if (!this.ldraw_org) {
        return false;
    }
    let lo = this.ldraw_org.split(' ')[0]; // First token.
    return lo === 'Part' || lo === 'Primitive' || lo === 'Subpart' ||
        lo === '8_Primitive' || lo === '48_Primitive' || lo === 'Shortcut';
}