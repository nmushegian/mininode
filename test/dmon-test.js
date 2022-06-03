import {expect as want} from 'chai';
import {Dmon} from '../dmon.js';
import {Djin} from '../djin.js'
import {Plug} from '../plug.js'

describe('dmon', () => {
    let ali, bob;
    beforeEach(async () => {
        ali = new Dmon(new Djin(null), new Plug(10334));
        bob = new Dmon(new Djin(null), new Plug(10335));
        ali.serve()
        bob.serve()
        want(ali.plug.pubkey).to.not.eql(bob.plug.pubkey)
    });
    afterEach(async () => {
        ali.plug.stop()
        bob.plug.stop()
    })

    it('basic', async () => {
        ali.plug.setPeer(bob.plug.pubkey, '127.0.0.1', 10334)
        ali.plug.send([bob.plug.pubkey, 'endq29g48i', ''])
        want(ali.plug.peers[bob.plug.pubkey]).to.eql(undefined)
        want(ali.plug.actives.indexOf(bob.plug.pubkey)).to.eql(-1)
        want(bob.djin.nturns).to.eql(0)
    });
});
