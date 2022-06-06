
// daemon

export class Dmon {
    constructor(djin, plug) {
        this.djin = djin
        this.plug = plug
    }
    async init() {
        process.on('unhandledRejection', err => {
            console.log(err); process.exit(1)
        })
        await this.plug.when(mail => this.djin.turn(mail))
    }
    async play() {
        await this.plug.play()
    }
    async send(peer, mail) {
        return await this.plug.send(peer, mail)
    }
    async stop() {
        return await this.plug.stop()
    }
}
