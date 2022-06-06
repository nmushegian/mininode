// daemon

// new Dmon(cash.djin, http)
// dmon.task(cash.sync)
// await dmon.serve()
import http from 'http'
import Debug from 'debug'
const debug = Debug('test::dmon')
import rlp from 'rlp'

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
                const decoded = [mail[0], mail[1], rlp.decode(mail[3])]
                this.djin._turn(decoded)
                this.turnt = decoded
            }
            this.prev = mail
        })
    }
    async task(f) {
        while (await f()) {}
    }
}
