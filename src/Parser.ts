import Turtle from './Turtle';
import Tree from './geometry/Tree';
import {vec3, vec4, mat4} from 'gl-matrix';

class Parser {
    turtles: Turtle[] = []; // Stack of Turtles
    branchPos: number[] = Tree.createBranchPos(); // these two hold the default positions/normals for a single branch
    branchNor: number[] = Tree.createBranchNor();
    positions: number[] = []; // Holds all the position data for the final vbo
    normals: number[] = []; // Holds all the normals for the final vbo

    constructor() {}

    parse(s: string[]) {
        console.log(s);
        let t = new Turtle(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), 1);
        for (let i = 0; i < s.length; i++) {
            let c = s[i];
            if (c == '[') {
                let temp = new Turtle(vec3.clone(t.location), vec3.clone(t.direction), 1);
                this.turtles.push(temp);
            }
            else if (c == ']') {
                t = this.turtles.pop();
            }
            else {
                t.move(c);
                if (c == 'A') {
                    this.addBranch(t.getTransform());
                }
            }
        }

    }

    addBranch(transform: mat4) { // Transforms the base branch and adds it to the list of positions and normals
        let invTransp = mat4.clone(transform);
        mat4.invert(invTransp, invTransp);
        mat4.transpose(invTransp, invTransp);
        for (let i = 0; i < this.branchPos.length; i = i + 4) {
            let pos = vec4.fromValues(this.branchPos[i], this.branchPos[i + 1], this.branchPos[i + 2], this.branchPos[i + 3]);
            vec4.transformMat4(pos, pos, transform);
            let nor = vec4.fromValues(this.branchNor[i], this.branchNor[i + 1], this.branchNor[i + 2], this.branchNor[i + 3]);
            vec4.transformMat4(nor, nor, invTransp);
            for(let j = 0; j < 4; j++) {
                this.positions.push(pos[j]);
                this.normals.push(nor[j]);
            }
        }
        //console.log(this.positions);
        //console.log(this.normals);
    }

};

export default Parser;