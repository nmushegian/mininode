// transport plugin

import * as uws from 'uWebSockets.js'
export { Plug }

class Plug {
    constructor() {
        this.map = {}
        this.net = uws.App({})
    }
    open(port, mailbox) {
        this._when(mailbox)
        this._hear(port)
    }
    // when( mailbox : (mail,echo) -> () )
    _when(mailbox) {
        this.net.ws('/*', {
            message: (ws, mail) => {
                mailbox(mail, res => {
                    ws.send(res)
                })
            }
        })
    }
    _hear(port) {
        this.net.listen(port, console.log)
    }
}
