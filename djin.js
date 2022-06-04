// engine

export class Djin {
    constructor(tree) {
        this.tree = tree
        this.nonc = 0
    }
    turn(mail) {
        let outs = []
        this.tree.edit(this.nonc, this.nonc++, db => {
            // do stuff
        })
        return outs
    }
}
