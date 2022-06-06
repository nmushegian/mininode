// daemon

export class Dmon {
    constructor(djin, plug) {
        this.djin = djin
        this.plug = plug
    }
    async play() {
        await this.plug.when(mail => this.djin.turn(mail))
    }
    async send(peer, mail) {
        return await this.plug.send(peer, mail)
    }
    async stop() {
        return await this.plug.stop()
    }
}
