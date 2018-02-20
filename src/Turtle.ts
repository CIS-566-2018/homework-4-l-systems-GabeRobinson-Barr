import {vec3, vec4, mat3, mat4} from 'gl-matrix';

const PI = 3.14159;

class Turtle {
    location: vec3;
    direction: vec3;
    scale: vec3;
    depth: number = 0;

    constructor(pos: vec3, dir: vec3, scl: number) {
        this.location = pos;
        this.direction = dir;
        this.scale = vec3.scale(vec3.create(), vec3.fromValues(0.2, 0.2, 1.0), scl);
    }

    move(s: string) { // Takes in the next movement command to update position/direction
        if (s == 'A') {
            this.depth += 1;
            vec3.add(this.location, this.location, this.direction);
        }
        else if (s == 'a') {
            this.depth += 0.5;
            vec3.add(this.location, this.location, vec3.scale(vec3.create(), this.direction, 0.5));
        }
        else if (s == 'X') {
            vec3.rotateX(this.direction, this.direction, vec3.fromValues(0,0,0), PI/4);
        }
        else if (s == 'x') {
            vec3.rotateX(this.direction, this.direction, vec3.fromValues(0,0,0), -PI/4);
        }
        else if (s == 'Y') {
            vec3.rotateY(this.direction, this.direction, vec3.fromValues(0,0,0), PI/4);
        }
        else if (s == 'y') {
            vec3.rotateY(this.direction, this.direction, vec3.fromValues(0,0,0), -PI/4);
        }
        else if (s == 'Z') {
            vec3.transformMat4(this.direction, this.direction, mat4.fromZRotation(mat4.create(), PI/4));
        }
        else if (s == 'z') {
            vec3.transformMat4(this.direction, this.direction, mat4.fromZRotation(mat4.create(), -PI/4));
        }


    }

    getTransform(): mat4 {
        let bit = vec3.fromValues(this.direction[1], this.direction[2], -this.direction[0]);
        let tan = vec3.cross(vec3.create(), bit, this.direction);
        vec3.cross(bit, tan, this.direction); // Get nor,tan,bit for rotation
        vec3.normalize(this.direction, this.direction);
        vec3.normalize(bit, bit);
        vec3.normalize(tan, tan);

        let trans = mat4.fromValues(-tan[0], -tan[1], -tan[2], 0.0,
                                    -bit[0], -bit[1], -bit[2], 0.0,
                                    this.direction[0], this.direction[1], this.direction[2], 0.0,
                                    this.location[0], this.location[1], this.location[2], 1.0); // Translate/rotate matrix
        // let trans = mat4.fromValues(tan[0], this.direction[0], bit[0], 0,
        //                             tan[1], this.direction[1], bit[1], 0,
        //                             tan[2], this.direction[2], bit[2], 0,
        //                             this.location[0],this.location[1],this.location[2],1);
        mat4.scale(trans, trans, this.scale); // Scale by our scale
        // let trans = mat4.fromTranslation(mat4.create(), this.location);
        // mat4.multiply(trans, mat4.fromXRotation(mat4.create(), this.direction[0]), trans);
        // mat4.multiply(trans, mat4.fromYRotation(mat4.create(), this.direction[1]), trans);
        // mat4.multiply(trans, mat4.fromZRotation(mat4.create(), this.direction[2]), trans);

        return trans;
    }

};

export default Turtle;