import {expect as want} from 'chai';
import {Dmon} from '../dmon.js';
import {Djin} from '../djin.js'
import {Plug} from '../plug.js'
import Debug from 'debug'
const debug = Debug('test::dmon')
import rlp from 'rlp'

const spin = async (f, ...args) => {
    while (true) {
        await (new Promise(resolve => setTimeout(resolve, 0)))
        const res = f(...args)
        if (res != null) {
            return res
        }
    }
}

const localhost = '127.0.0.1'
describe('dmon', () => {
    let ali, bob, cat
    let ALI, BOB, CAT
    beforeEach(async () => {
        ali = new Dmon(new Djin(null), new Plug(10334));
        bob = new Dmon(new Djin(null), new Plug(10335));
        cat = new Dmon(new Djin(null), new Plug(10336));
        ALI = ali.plug.pubkey
        BOB = bob.plug.pubkey
        CAT = cat.plug.pubkey
        ali.serve()
        bob.serve()
        cat.serve()
        debug(`created nodes ali@${ALI}, bob@${BOB}, cat@${CAT}`)
        want(ALI).to.not.eql(BOB)
    });
    afterEach(async () => {
        ali.plug.stop()
        bob.plug.stop()
        cat.plug.stop()
    })

    const decode = (mail) => {
        return [mail[0], mail[1], rlp.decode(mail[3])]
    }

    describe('basic', () => {
        beforeEach(async () => {
            ali.plug.setPeer(BOB, localhost, 10335)
            ali.plug.setPeer(CAT, localhost, cat.plug.port)
        })
        it('end', async () => {
            debug(`end @${ALI} -> @${BOB}`)
            const mail = [BOB, 'endq29g48i', '']
            ali.plug.send(mail)
            want(ali.plug.peers[BOB]).to.eql(undefined)
            want(ali.plug.actives.indexOf(BOB)).to.eql(-1)
            const prev = await spin(() => bob.prev)
            want(prev).to.eql(mail)
            want(bob.turnt).to.eql(undefined)
        });

        it('ann', async () => {
            // TODO ann subset
            debug(`ann ${ALI} -> ${BOB}, ${CAT}`)
            const mail = ['', 'ann1893789wrusoilfoui89vs89', '']
            ali.plug.send(mail)
            for (const dmon of [bob, cat]) {
                want(ali.plug.peers[dmon.plug.pubkey]).to.eql([localhost, dmon.plug.port])
                const prev = await spin(() => dmon.prev)
                want(prev).to.eql(mail)
                want(dmon.turnt).to.eql(decode(mail))
            }
        })

        it('req', async () => {
            const mail = ['', 'req/aew782i181', '']
            ali.plug.send(mail)
            for (const dmon of [bob, cat]) {
                want(ali.plug.peers[dmon.plug.pubkey]).to.eql([localhost, dmon.plug.port])
                const prev = await spin(() => dmon.prev)
                want(prev).to.eql(mail)
                want(dmon.turnt).to.eql(undefined)
            }
        })

        it('res', async () => {
            const mail = [BOB, 'res/aew782i181', '']
            ali.plug.send(mail)
            const prev = await spin(() => bob.prev)
            want(prev).to.eql(mail)
            want(bob.turnt).to.eql(decode(mail))
        })
    })
});
