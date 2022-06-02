// daemon

// new Dmon(cash.djin, http)
// dmon.task(cash.sync)
// await dmon.serve()

class Dmon {
    constructor(djin, plug) {
        this.djin = djin
        this.plug = plug
    }
    serve() {
        this.plug.when(mail => {
            this.djin._turn(mail)
        })
    }
    async task(f) {
        while (await f()) {}
    }
}
