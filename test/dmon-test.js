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

describe('dmon', () => {
    let ali, bob;
    beforeEach(async () => {
        ali = new Dmon(new Djin(null), new Plug(10334));
        bob = new Dmon(new Djin(null), new Plug(10335));
        ali.serve()
        bob.serve()
        debug(`created nodes ali@${ali.plug.pubkey}, bob@${bob.plug.pubkey}`)
        want(ali.plug.pubkey).to.not.eql(bob.plug.pubkey)
    });
    afterEach(async () => {
        ali.plug.stop()
        bob.plug.stop()
    })


    describe('basic', () => {
        beforeEach(async () => {
            ali.plug.setPeer(bob.plug.pubkey, '127.0.0.1', 10335)
        })
        it('end', async () => {
            debug(`end @${ali.plug.pubkey} -> @${bob.plug.pubkey}`)
            await ali.plug.send([bob.plug.pubkey, 'endq29g48i', ''])
            want(ali.plug.peers[bob.plug.pubkey]).to.eql(undefined)
            want(ali.plug.actives.indexOf(bob.plug.pubkey)).to.eql(-1)
            const msg = await spin(() => bob.prev)
            want(bob.djin.nturns).to.eql(0)
        });

    })
});
