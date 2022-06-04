// daemon

// new Dmon(cash.djin, http)
// dmon.task(cash.sync)
// await dmon.serve()
import http from 'http'
import Debug from 'debug'
const debug = Debug('test::dmon')

export class Dmon {
    constructor(djin, plug) {
        this.djin = djin
        this.plug = plug
        this.nmsgs = 0
    }
    serve() {
        this.plug.when((mail) => {
            debug(`msg @${this.plug.pubkey}, nmsgs=${this.nmsgs++}`)
            if (mail.length != 3) {
                console.error('mailbox: bad mail length')
            }
            const ty = mail[1].slice(0, 3)
            if (ty == 'res' || ty == 'ann') {
                this.djin._turn(mail)
            }
            this.prev = mail
        })
    }
    async task(f) {
        while (await f()) {}
    }
}
