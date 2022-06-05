import {expect as want} from 'chai';
import {Dmon} from '../dmon.js';
import {Djin} from '../djin.js'
import {Plug} from '../plug.js'
import Debug from 'debug'
const debug = Debug('test::dmon')

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
    beforeEach(async () => {
        ali = new Dmon(new Djin(null), new Plug(10334));
        bob = new Dmon(new Djin(null), new Plug(10335));
        cat = new Dmon(new Djin(null), new Plug(10336));
        ali.serve()
        bob.serve()
        cat.serve()
        debug(`created nodes ali@${ali.plug.pubkey}, bob@${bob.plug.pubkey}, cat@${cat.plug.pubkey}`)
        want(ali.plug.pubkey).to.not.eql(bob.plug.pubkey)
    });
    afterEach(async () => {
        ali.plug.stop()
        bob.plug.stop()
        cat.plug.stop()
    })


    describe('basic', () => {
        beforeEach(async () => {
            ali.plug.setPeer(bob.plug.pubkey, localhost, 10335)
            ali.plug.setPeer(cat.plug.pubkey, localhost, cat.plug.port)
        })
        it('end', async () => {
            debug(`end @${ali.plug.pubkey} -> @${bob.plug.pubkey}`)
            ali.plug.send([bob.plug.pubkey, 'endq29g48i', ''])
            want(ali.plug.peers[bob.plug.pubkey]).to.eql(undefined)
            want(ali.plug.actives.indexOf(bob.plug.pubkey)).to.eql(-1)
            const msg = await spin(() => bob.prev)
            want(bob.djin.nturns).to.eql(0)
        });

        it('ann', async () => {
            // TODO ann subset
            debug(`ann ${ali.plug.pubkey} -> ${bob.plug.pubkey}, ${cat.plug.pubkey}`)
            const mail = ['', 'ann1893789wrusoilfoui89vs89', '']
            ali.plug.send(mail)
            for (const dmon of [bob, cat]) {
                want(ali.plug.peers[dmon.plug.pubkey]).to.eql([localhost, dmon.plug.port])
                const prev = await spin(() => dmon.prev)
                want(prev).to.eql(mail)
            }
        })

        it('req', async () => {
            const mail = ['', 'req/aew782i181', '']
            ali.plug.send(mail)
            for (const dmon of [bob, cat]) {
                want(ali.plug.peers[dmon.plug.pubkey]).to.eql([localhost, dmon.plug.port])
                const prev = await spin(() => dmon.prev)
                want(prev).to.eql(mail)
            }
        })

        it('res', async () => {
            const mail = [bob.plug.pubkey, 'res/aew782i181', '']
            ali.plug.send(mail)
            const prev = await spin(() => bob.prev)
            want(prev).to.eql(mail)
        })
    })
});
