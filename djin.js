// engine
import Debug from 'debug'

export class Djin {
    constructor() {
        this.log = []
    }
    turn(mail) {
        this.log.push(['i', mail])
        let back = ['ack', mail]
        this.log.push(['o', back])
        return back
    }
}
