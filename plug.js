// network plugin

import * as hapi from '@hapi/hapi'

export { Plug, HapiPlug }

class Plug {
    // resolve when connection has been closed
    async kill() {
        console.log(`plug.kill()`)
    }
    // resolve when handler is wired up and active
    // when : (what:(mail:blob -> back:blob))
    async when(what) {
        console.log(`plug.when(..., ...)`)
    }
    async send(peer, mail) {
        console.log(`plug.send(${peer}, ${mail})`)
    }
}


class HapiPlug extends Plug {
    constructor({ host, port }) {
        super()
        this.host = host
        this.port = port
    }
    async when(what) {
        process.on('unhandledRejection', err => {
            console.log(err); process.exit(1)
        })
        this.serv = hapi.server({
            host: this.host, port: this.port
        })
        this.serv.route({
            method: '*',
            path: '/{any*}',
            handler: (request) => {
                console.log(request)
                let data = request.payload
                let back = what(data)
                return back
            }
        })
        await this.serv.start()
        console.log(`listening on ${this.serv.info.uri}`)
    }
    async send() {
    }
}

