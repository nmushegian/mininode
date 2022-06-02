// engine

class Djin {
    let _tree
    let desk
    constructor(datadesk) {
        _tree = datadesk
    }
    // override
    // desk is a purely functional set handle mutable handle
    // you have access to _tree if you want to switch branches
    // just load, modify, and return the new system state you want
    // without fear
    turn(desk, mail) {
        throw new Error(`unimplemented override`)
    }
    // called by dmon
    _turn(mail) {
        let [desk, outs] = turn(this.desk, mail)
        this.desk = _tree.save(desk)
        return outs
    }
}
