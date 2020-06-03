let LDRStepIdx = 0;

let LDRStep = function () {
    // this.idx = LDRStepIdx++;
    this.hasPrimitives = false;
    this.subModels = []; // LDRPartDescription
    this.lines = []; // LDR.Line2
    this.conditionalLines = []; // LDR.Line5
    this.triangles = []; // LDR.Line3
    this.quads = []; // LDR.Line4
    // this.rotation = null; // LDRStepRotation
    // this.cnt = -1;
    // this.original; // LDRStep
}


LDRStep.prototype.isEmpty = function () {
    return this.subModels.length === 0 && !this.hasPrimitives;
}

LDRStep.prototype.addSubModel = function (subModel) {
    this.subModels.push(subModel);
}

// LDRStep.prototype.addLine = function (c, p1, p2, texmapPlacement) {
LDRStep.prototype.addLine = function (c, p1, p2) {
    this.hasPrimitives = true;
    // this.lines.push(new LDR.Line2(c, p1, p2, texmapPlacement));
    this.lines.push(new LDR.Line2(c, p1, p2));
    // texmapPlacement && texmapPlacement.use();
}

// LDRStep.prototype.addTriangle = function (c, p1, p2, p3, cull, invert, texmapPlacement) {
LDRStep.prototype.addTriangle = function (c, p1, p2, p3) {
    this.hasPrimitives = true;
    // this.triangles.push(new LDR.Line3(c, p1, p2, p3, cull, invert, texmapPlacement));
    this.triangles.push(new LDR.Line3(c, p1, p2, p3));
    // texmapPlacement && texmapPlacement.use();
}

// LDRStep.prototype.addQuad = function (c, p1, p2, p3, p4, cull, invert, texmapPlacement) {
LDRStep.prototype.addQuad = function (c, p1, p2, p3, p4) {
    this.hasPrimitives = true;
    // this.quads.push(new LDR.Line4(c, p1, p2, p3, p4, cull, invert, texmapPlacement));
    this.quads.push(new LDR.Line4(c, p1, p2, p3, p4));
    // texmapPlacement && texmapPlacement.use();
}

// LDRStep.prototype.addConditionalLine = function (c, p1, p2, p3, p4, texmapPlacement) {
LDRStep.prototype.addConditionalLine = function (c, p1, p2, p3, p4) {
    this.hasPrimitives = true;
    // this.conditionalLines.push(new LDR.Line5(c, p1, p2, p3, p4, texmapPlacement));
    this.conditionalLines.push(new LDR.Line5(c, p1, p2, p3, p4));
    // texmapPlacement && texmapPlacement.use();
}

/*
  Split all color/partType into separate steps with one step containing only parts.
  
  this.subModels = [];
  this.rotation = null;
 */
LDRStep.prototype.cleanUp = function (loader, newSteps) {
    if (this.isEmpty() || this.hasPrimitives) {
        newSteps.push(this);
        return; // Primitive-containing or empty step - just keep existing.
    }

    // Collect info:
    let self = this;
    let parts = [];
    let subModelsByTypeAndColor = {};

    function handleSubModel(subModelDesc) {
        let subModel = loader.getPartType(subModelDesc.ID);
        if (!subModel || subModel.isPart) {
            parts.push(subModelDesc);
        }
        else { // Not a part:
            subModel.cleanUp(loader);
            let key = subModelDesc.c + '_' + subModel.ID;
            if (subModelsByTypeAndColor.hasOwnProperty(key)) {
                subModelsByTypeAndColor[key].push(subModelDesc);
            }
            else {
                subModelsByTypeAndColor[key] = [subModelDesc];
            }
        }
    }
    this.subModels.forEach(handleSubModel);

    function push(subModels) {
        let newStep = new LDRStep();
        newStep.subModels = subModels;
        // newStep.rotation = self.rotation ? self.rotation.clone() : null;
        newSteps.push(newStep);
    }

    // Split into separate steps if necessary:
    for (let key in subModelsByTypeAndColor) {
        if (subModelsByTypeAndColor.hasOwnProperty(key)) {
            push(subModelsByTypeAndColor[key]);
        }
    }

    // Finally add step for just the parts:
    if (parts.length > 0) {
        push(parts);
    }
}