// engine
import Debug from 'debug'
const debug = Debug('test::djin')

export class Djin {
    constructor(datadesk) {
        this._tree = datadesk
        this.desk  = datadesk
        this.nturns = 0
    }

    // override
    // desk is a purely functional set handle mutable handle
    // you have access to _tree if you want to switch branches
    // just load, modify, and return the new system state you want
    // without fear

    turn(desk, mail) {
        debug(`turn (nturns=${this.nturns++}`)
        return [[], []]
        //throw new Error(`unimplemented override`)
    }

    // called by dmon
    _turn(mail) {
        let [desk, outs] = this.turn(this.desk, mail)
        //this.desk = this._tree.save(desk)
        return outs
    }
}
