---
layout: post
title: "How to Store your Bitcoin for the Long Haul"
description: "Keep your bitcoin safe from theft and loss; directions how"
category: bitcoin
tags: [bitcoin, warpwallet, security]
page:
  comments : false
---
{% include JB/setup %}

<script>

var params = {
	difficulty : 3891,
	block_reward : 50,
	scrypt_c : {
		litecoin : Math.pow(2,10),
		warp : Math.pow(2,18)
	}
};
function expected_hashes_per_block (params) {
	return ((params.difficulty / 0xffff) * Math.pow(2,48));
}
function expected_ltc_per_hash (params) {
	return params.block_reward/expected_hashes_per_block(params);
};

</script>


### Abstract

We discuss how to store bitcoin reliably and securely for the long-haul.

#### What you'll need:

1. One networked machine
1. One "air-gapped" old laptop, preferably without any wireless capabilities.
1. A smartphone with a barcode scanner.

### Intro

If you want to invest in bitcoin for the long-haul, you should address the thorny
issue of how best to store them.  Since people love stealing bitcoins
from others more than just about anything else in this world, all storage
systems must first and foremost:

     1. Prevent others from stealing your coin

The easiest way to achieve this goal is simply to destroy your private keys.
So there must be a yin to requirement #1's yang, which is to:

     2. Avoid accidental loss

Storing bitcoin shouldn't rob them of their best properties.  So in
addition, good bitcoin storage should:

     3. Be low-cost

And in case you need to leave the country in a hurry, or if you inexplicably
wash up naked on a foreign shore, your coin should:

     4. Be globally accessible

We realize #4 is ridiculous, but still, it's fun to think about.

Achieving all four of these goals simultaneously is challenging, and most systems we
looked at fell short on at least one of these axes.  We'll cover those later in this
article, but first, we recommend a scheme to store your retirement coin, which is:

### A Brainwallet

A brainwallet is an open algorithm that deterministically and statelessly
converts a secret passphrase into public/private key pair.  Typically, brainwallet 
algorithms are quite simple:

1. Use SHA-256 to hash a passphrase into a 256-bit string that appears random
to those who do not know the passphrase.
1. Interpret this output as a secret key
1. Use standard EC crypto to map this secret key to a public key.

[Brainwallets](https://www.bitaddress.org) score highly on criteria 2 through 4, but have a
a reputation for 
[being](http://www.reddit.com/r/Bitcoin/comments/1c13ld/i_invested_all_of_my_bitcoin_to_a_brain_wallet/)
[insecure](http://www.reddit.com/r/Bitcoin/comments/1ptuf3/). The classic attack against
a brainwallet is to:

1. Generate a huge dictionary of possible passphrases, pulled from literature, popular password
databases, movie lines, song lyrics, etc.
1. For each phrase in the corpus, generate a brain wallet key pair using the above algorithm.
1. Watch the block chain for transfers sent to public addresses in the precomputed database.
1. On a hit, use the corresponding private key to transfer the coin.

This attack should look familiar; it's nearly the same attack used to crack
compromised password databases.  And indeed, brainwallets are insecure for the
same reason that unsalted, unhashed password databases are insecure.  Therefore,
brainwallets ought to employ the same security measures as pasword databases:

### A Security-Enhanced *Brainwallet*

We built [WarpWallet](https://keybase.io/warp), a security-enhanced brainwallet
implemented as a standalone Web page. WarpWallet is more secure that standard 
brainwallets for two simple reasons: (1) it requests that each user picks a unique "salt"
so that an adversary needs to crack each user's brainwallet individually; and (2),
it hashes secret passphrases using a [computationally expensive algorithm](http://www.tarsnap.com/scrypt.html),
so that each guess by the adversary is expensive to compute.

With this WarpWallet primitive, here is the full algorithm for storing wealth:

1. Buy your retirement coins on [Coinbase](https://coinbase.com) or the exchange of
your choosing.
1. Visit [WarpWallet](https://keybase.io/warp) and note the SHA-256 sum in the URL after the redirect
1. Boot up your air-gapped machine (AGM), preferably from a Linux live disk.
1. Copy the HTML to your AGM using a USB-stick.
1. Run `sha256sum warp.html` on the AGM to verify that the sum matches the sum you observed in step 2.
1. Open the HTML as a local file with Chrome or Firefox.  
    1. Test the configuration with a few temporary passphrases and small transfers (see below for more details).
    1. Pick a good passphrase. For example: `vicar formal lubbers errata mutton`.  More on this later.
    1. Run the configuration in "production", with your real passphrase. Use your email address as your "salt".  You'll get a public/private key pair out.
1. Use your phone to scan the public key, and transfer it to your networked machine (via email, for example). When scanning, be careful to resize your browser window so that only the public QR code is visible.
1. Turn off the air-gapped machine.
1. On your networked machine, transfer coin from Coinbase to the WarpWallet-generated address.
1. Leave little cryptic notes around your house and office to remind you of what your passphrase is in case you ever forget

To redeem your coin, repeat the process, but transfer over the private key.  Once you redeem a WarpWallet, never use it again. (Alternatively, you can use Bitcoin libraries to sign an transaction on your airgapped machine,
transfer it to your networked machine, and [inject it](https://blockchain.info/pushtx) into the blockchain; we have yet to implement this.)

### Security Analysis

There are four main attacks an adversary can attempt to steal your coin: (1) infiltrate your 
machines; (2) break WarpWallet's cryptography; (3) brute-force your password; or (4)
guess your passphrase from your little "reminder" notes.  Let's look at
all four:

For the first attack, assume the worst case, that the attacker has compromised
all three machines. An attacker who has compromised your air-gapped machine
knows your private key, but has no way to communicate it back (you should make
sure to never connect your AGM back to the network).  A compromise of your
phone or your networked machine gives the attacker access to your public key,
but that won't allow a theft of your coin as long as the Bitcoin protocol
holds.  Of course, an attacker who controls your networked machine can also
move your coin out of a Coinbase to an account of his choosing, but assuming
you can transfer your coin to a WarpWallet before him, you are in the clear.
If you lose the race, we of course can't help, welcome to the brotherhood of
the burgled. Similarly, if the attacker controls all code running on all of
your machines, you might not be able to run the real version of WarpWallet and
instead might have trojaned version that only outputs keys that the attacker
knows.  We don't have a great answer to this attack other than to check your
version of WarpWallet against other machines, either by cryptographic hash, or
by checking known input/output pairs.

The next attack to consider is a break of WarpWallet's cryptography.  WarpWallet works as follows:

1. Generate `s1`	= scrypt(key=`passphrase||0x1`, salt=`salt||0x1`, N=2<sup>18</sup>, r=8, p=1, dkLen=32)
1. Generate `s2`	= PBKDF2(key=`passphrase||0x2`, salt=`salt||0x2`, c=2<sup>16</sup>, dkLen=32, prf=HMAC_SHA256)
1. Assign `private_key` = `s1` ⊕ `s2`
1. Generate `public_key` from `private_key` using standing Bitcoin EC crypto.
1. Output `keypair` = (`private_key`, `public_key`)

A crypto break would allow an adversary to compute `keypair` from a candidate
`passphrase` and `salt` more efficiently than running `scrypt` and `PBKDF2` in
the forward-direction.  In other words, it would make his brute-force  attack
more efficient.

We can quantify security under the assumption that `scrypt` is secure, and the `PBKDF2`
step is free.  Note that WarpWallet uses security parameter 2<sup>18</sup>, and the Litecoin
system [uses](https://litecoin.info/Comparison_between_Litecoin_and_Bitcoin) 2<sup>10</sup>.
At the time of writing, the maximally observed [hashing rate](https://litecoin.info/Mining_hardware_comparison)
for Litecoin is 1.5MH/s with a [$900 graphics card](http://www.newegg.com/Product/Product.aspx?Item=N82E16814127735).
Such a setup could compute WarpWallet addresses at 2<sup>20.53-8-9.81</sup> = 2<sup>2.72</sup> hashes/second/dollar, assuming
energy and supporting hardware is free.  So an adversary who buys $134 million worth of high-end graphics cards could compute 
2<sup>29.72</sup> hashes per second, and could guess a passphrase with 72 bits of entropy (such as the one above) in about
84,667 years.  That's a comfortable security margin for now.  If there's a news report
that scrypt is broken, or of a significant reduction in hardware cost, you still have the 
cushion of PBKDF2 while you change to a different scheme.

Practically speaking, there's an outstanding public challenge to test the
security of  WarpWallet. When the site was announced, we included 4 challenges
that we knew to be solvable in short order, to prove that people would take
the challenges seriously.  They did. The remaining challenge is to guess an
address with only 48 bits of entropy, and is 
[uncracked](https://blockchain.info/address/1AdU3EcimMFN7JLJtceSyrmFYE3gF5ZnGj) 
since November 2013.

Finally, there is a risk that people who you physically interact with will find one of your reminder
notes, recover your passphrase and steal your coin.  The best defense agaist this attack
is first, to make your reminder cryptic enough so that anyone who finds it won't know what it is;
and second, to not hang out with dicks who would steal your money.

#### What's a Good Passphrase?

When generating a passphrase, it's nice to use an algorithm that produces a
passphrase with quantifiable entropy. For instance, [this
page](https://oneshallpass.com/pp.html) picks *N* words at random from the
dictionary, and gives you more passphrase entropy for higher values of *N*.
One can memorize passphrases like these if used them regularly, but since
WarpWallets are used a couple of times per decade, you're at risk of forgetting.
We internally discussed easier-to-remember password systems, like
interwoven lines from famous poems, words you made up when you were a kid,
etc. Here, you are into the realm of security-by-obscurity, which for this
application is probably OK.  Just whichever system you pick should look like
the concatenation of random words to an attacker who doesn't know your secret
algorithm. For instance, picking a single line from an obscure poem isn't
a great idea, since words 3 through 10 probably supply almost no entropy.  Concatenating
the 13th word of eight of your favorite poems will look a lot more random.

### Why This System Has the Other Three Properties

The WarpWallet protocol described above should be secure. It is certainly free
and accessible from anywhere in the world with internet in a bind. The biggest question is will 
you mess it up.  The mistakes we can think of are:

1. You forget your passphrase
1. You mistakenly publish your secret key or your passphrase.
1. The WarpWallet code disappears or becomes unexecutable.
1. Your browser has some sort of bug and you get the wrong answer

We've covered passphrase forgetting and reminders above.  And you do need to work slowly to avoid careless mistakes
in the coin transfer protocol.  There will be a self-contained, public, and self-ceritifed version of 
WarpWallet [available](https://github.com/keybase/warpwallet/tree/master/web) as long as GitHub is running
or you have a checkout of our repository.  We'll sign all subsequent releases with our
[PGP key](https://keybase.io/warp/keybase-code-signing-key-2013.asc) (ID: <tt>4748 4E50 656D 16C7</tt>).

Software bugs are interesting to consider.  When we built WarpWallet, we
implemented the algorithm twice, with two different software stacks, and
checked that we got the same answers.  To run our tests, check out [the
repository](https://github.com/keybase/warpwallet) and run `npm install -d;
make test`.

Still, you should take further precautions.  After transfering the HTML to
your air-gapped machine in Step 3 above, run some tests.  Pick some throw-away
passwords and hash them both on your  networked machine and your air-gapped
machine.  If that checks out, and the results match, then generate a temporary
password, transfer a small amount of coin to WarpWallet, and then the
following day, transfer the coin back.  Run these tests as many times as you
need to feel comfortable, and then  pull the trigger.

### Survey of Other Systems

Above we asserted that our system is better than other competitors.  Let's take a deeper a look.


#### Coinbase, and other online wallets

Many of us buy our coin from [Coinbase](https://coinbase.com) since it's a
great company, with [great engineers](http://www.craighammell.com/) and they
claim to take some [serious security measures](https://coinbase.com/security).
But maybe you shouldn't keep your coin there indefinitely. Coinbase is
at best as secure as a non-FDIC-insured bank, and maybe less secure.  Meaning,
like banks it is susceptible to physical burglaries, ledger errors, and,
though we shudder to think of it, personal extortion of key employees. Even
more so than banks, Coinbase will magnetically attract XSS, CSRF, and phishing
attacks. Though their security has been good to-date, it is an ongoing fight
against determined, well-motivated adversaries. Finally, neither the FDIC nor
any other body insures Coinbase, so unlike bank deposits, your coin at
Coinbase disappears in the case of a "bank run" or a sudden business failure.

With other online banks and wallets, we've seen cases of
[financial fraud](http://www.zerohedge.com/news/2013-07-23/texan-charged-bitcoin-denominated-ponzi-scheme) and
"honest" [programmer](http://arstechnica.com/business/2013/04/bitfloor-number-four-bitcoin-based-exchange-shuts-down-for-good/) 
[error](https://bitcointalk.org/index.php?topic=83794.0#post_bitomatpl_loss) robbing
customers of their savings.

#### Running Your Own Wallet 

Anyone with a cable modem and some extra storage space can run their own
wallet (either [full](http://bitcoin.org/en/download) or
[thin](https://electrum.org/)). Running your own wallet makes sense if you
transact frequently, but leaves your long-term storage vulnerable, since your
coin is susceptible to both theft and loss. Unencrypted backups trade-off
loss-resilience for theft-resilience. Perhaps the sweet-spot here is
encrypted backups. We came close to advocating that system before we
realized we'd only feel comfortable with encrypted backups if
they were copied to many different places. At that point, it's the
encryption---and not possession of the encrypted file ----that keeps your
coin safe. So in other words, you'd still have to remember a good passphrase,
and in addition choose a good encryption system, manage files properly, and
convince yourself that you'll be able to decrypt when necessary.  This felt
like a lot of extra machinery that might eventually hinder recoverability
without providing additional security.


#### Paper Wallets and Offline USB Sticks

Paper wallets and offline USB sticks are more secure against theft, assuming
the machine you used to generate the wallet or store to USB wasn't
compromised.  However, offline storage is vulnerable to loss.  You can lose
them in a fire; you can throw them out by accident. Some store offline wallets
in safety-deposit boxes, but vault storage is expensive, inconvenient and can
be confiscated in certain cases. 

#### Secret-sharing

Using [cryptographic secret-sharing](http://en.wikipedia.org/wiki/Shamir's_Secret_Sharing), you
can, for instance, split your wallet up into 7 pieces, any 4 of which can be reassembled to
recreate the wallet.  Imagine keeping some shares for yourself, storing some in your office, and
leaving some with your family or mates.  Such solutions seem elegant in priniciple but 
error-prone in practice. 

## Summary

Use WarpWallet and follow our step-by-step directions above to store your
coin for the long haul.
