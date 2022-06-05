
// transport plugin
import { Server } from "socket.io"
import { io } from "socket.io-client"
import Debug from 'debug'
const debug = Debug('test::plug')

export class Plug {
    constructor(port) {
        this.port = port
        this.peers = {}
        this.actives = []
        this.pubkey = String(Math.floor(Math.random() * 1000000000))
        debug(`created plug with pubkey ${this.pubkey}`)
    }
    setPeer(pk, addr, port) { this.peers[pk] = [addr, port] }
    drop(p) {
        this.peers[p] = undefined
        this.actives = this.actives.filter(p => p != peer)
    }
    setServers(actives) { this.actives = actives }
    stop() {
        if (this.server == undefined) {
            console.error('stop: no listener open')
        }
        this.server.close()
    }
    // when( mailbox : msg -> () )
    when(mailbox) {
        this.server = new Server(this.port)
        this.server.on("connection", (socket) => {
            socket.once("minicash", (mail) => {
                mailbox(mail)
                socket.disconnect()
            })
        })
    }
    send(mail) {
        const json = JSON.stringify(mail)
        const post = (addr, port) => {
            const socket = io('http://'+addr + ':' + port)
            socket.timeout(5000).emit('minicash', mail)
        }

        const peer = mail[0]
        const type = mail[1]
        switch(type.slice(0, 3)) {
            case 'end': {
                let [addr, port] = this.peers[peer]

                if (peer.indexOf(',') != -1) {
                    console.error('end: can only drop one peer at a time')
                }
                post(addr, port)
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
                    const [addr, port] = this.peers[pk]
                    post(addr, port)
                }
                break
            }
            case 'res': {
                let [addr, port] = this.peers[peer]

                if (peer.indexOf(',') != -1) {
                    console.error('res: can only drop one peer at a time')
                }
                post(addr, port)
            }
        }
    }
}
