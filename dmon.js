// daemon

export class Dmon {
    constructor(djin, plug) {
        this.djin = djin
        this.plug = plug
    }
    async play() {
        this.plug.when(mail => this.djin.turn(mail))
    }
    async send(peer, mail) {
        this.plug.send(peer, mail)
    }
}
