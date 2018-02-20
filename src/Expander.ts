
class Expander {
    seed: string[];
    tree: string[];

    constructor(s: string[]) {
        this.seed = s;
    }

    expandSeed(iters: number) { // Expands the seed of the tree to some # of iterations. Stored in tree
        let exp = this.seed; 
        for(let i = 0; i < iters; i++) { // For each iteration make a temp array
            let temp: string[] = [];
            for (let j = 0; j < exp.length; j++) { // Expand each current character/string
                let s = this.expandRule(exp[j]);
                for (let k = 0; k < s.length; k++) {// Add the expanded string to temp
                    temp.push(s[k]);
                }
            }
            exp = temp; // Replace exp with the expanded string
        }
        this.tree = exp; // Store the final expanded string in tree
        console.log(this.tree);
    }

    expandRule(s: string): string[] { // Holds the rules for expanding a character
        if (s == 'R') {
            return ['A', '[', 'z', 'R', ']', '[', 'Z', 'R', ']'];
        }
        return [s]; // error
    }


};

export default Expander;