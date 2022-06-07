// engine
import Debug from 'debug'
const debug = Debug('test::djin')

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
