// network plugin
import { roll, unroll, rmap } from './deps/coreword/dist/word.js'
import * as hapi from '@hapi/hapi'
import fetch from 'node-fetch'
import assert from 'assert'
import Debug from 'debug'
const debug = Debug('test::plug')

export { Plug, SockPlug, HapiPlug, PureHttpPlug }

class Plug {
    constructor(host, port) {
        this.point = {host, port}
        this.peers = {}
        this.actives = []
        this.pubkey = String(Math.floor(Math.random() * 1000000000))
        debug(`created plug with pubkey ${this.pubkey}`)
    }

    setPeer(pk, host, port) {
        this.peers[pk] = {host, port}
    }

    drop(p) {
        this.peers[p] = undefined
        this.actives = this.actives.filter(p => p != peer)
    }

    setActives(actives) {
        this.actives = actives
    }


    async play() {
        console.error('play: unimplemented')
        assert(false)
    }

    // resolve when handler is wired up and active
    // when : (what:(mail:blob -> back:blob))
    async when(what) {
        console.error('when: unimplemented')
        assert(false)
    }

    async when_(mailbox_) {
        const mailbox = (mail_) => {
            const mail = JSON.parse(mail_)
            if (mail.length != 2) {
                console.error('when_: bad mail length')
                return
            }
            const type = mail[0]
            const body = mail[1]
            const decoded = unroll(new Uint8Array(body.data))
            const res = mailbox_([type, decoded])
            this.prev = mail_
            return res
        }
        await this.when(mailbox)
    }

    async post(host, port, mail) {
        console.error('post: unimplemented')
        assert(false)
    }

    async send(peer, mail) {
        if (mail.length != 2) {
            console.error(`send: bad mail length`)
            return
        }

        const type = mail[0]
        const json = JSON.stringify([type, roll(mail[1])])
        switch (type.slice(0, 3)) {
            case 'end': {
                let {host, port} = this.peers[peer]

                if (peer.indexOf(',') != -1) {
                    console.error('end: can only drop one peer at a time')
                }
                await this.post(host, port, json)
                // drop peer
                this.drop(peer)
                break
            }
            case 'req':
            case 'ann': {
                if (peer != '') {
                    console.error('ann / req: peer should be empty string')
                    break
                }
                for (let pk of Object.keys(this.peers)) {
                    const {host, port} = this.peers[pk]
                    await this.post(host, port, json)
                }
                break
            }
            case 'res': {
                let {host, port} = this.peers[peer]

                if (peer.indexOf(',') != -1) {
                    console.error('res: can only drop one peer at a time')
                }
                await this.post(host, port, json)
            }
        }
    }

    async stop() {
        console.error('stop: unimplemented')
        assert(false)
    }
}

import {Server} from 'socket.io'
import {io} from 'socket.io-client'
class SockPlug extends Plug {

    async post(host, port, mail) {
        const socket = io('http://' + host + ':' + port)
        socket.timeout(5000).emit('minicash', mail)
        debug(`post ${host} ${port} ${mail}`)
    }

    stop() {
        if (this.server == undefined) {
            console.error('stop: no listener open')
        }
        this.server.close()
    }

    async play() {
        debug(`server @${this.point.port}`)
        this.server = new Server(this.point.port)
    }

    // when( mailbox : msg -> () )
    when(mailbox) {
        this.server.on("connection", (socket) => {
            socket.once("minicash", (mail) => {
                mailbox(mail)
                socket.disconnect()
            })
        })
    }
}


class HapiPlug extends Plug {
    async when(what) {
        this.serv.route({
            method: '*',
            path: '/{any*}',
            handler: (request) => {
                let data = JSON.parse(request.payload)
                let back = what(data)
                return back
            }
        })
    }
    async post(host, port, mail) {
        let post = JSON.stringify(mail)
        const url = 'http://'+host+':'+port
        let res = await fetch(url, { method: 'POST', body: post } )
        let body = await res.json()
        console.log('body', body)
        return body
    }
    async play() {
        this.serv = hapi.server(this.point)
        await this.serv.start()
        console.log(`listening on ${this.serv.info.uri}`)
    }
    async stop() {
        await this.serv.stop()
    }
}

import purehttp from 'pure-http'
import { raw, text } from 'milliparsec'

class PureHttpPlug extends Plug {
    async when(what) {
        await this.serv.all('/', (req, res) => {
            const parsed = JSON.parse(req.body)
            const unrolled = unroll(Buffer.from(parsed[1], 'hex'))
            let body = [parsed[0], unrolled]
            let back = what(req.body)
            let rollhex = roll(back).toString('hex')
            res.send(rollhex)
        })
    }
    async play() {
        this.serv = purehttp()
        await this.serv.listen(this.point.port)
        await this.serv.use(text())
    }
    async stop() {
        await this.serv.close()
    }
    async post(host, port, mail) {
        const url = 'http://'+host+':'+port
        let res = await fetch(url, { method: 'POST', body: mail } )
        let body = await res.text()
        let r = unroll(Buffer.from(body, 'hex'))
        return r
    }
}
