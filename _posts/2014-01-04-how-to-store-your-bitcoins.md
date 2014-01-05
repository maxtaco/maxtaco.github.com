---
layout: post
title: "How to Store your Bitcoin"
description: "Keep your bitcoin safe from theft and loss; directions how"
category: bitcoin
tags: [bitcoin, warpwallet, security]
---
{% include JB/setup %}

### Abstract

We discuss how to store bitcoin reliably and securely for the long-haul.

#### What you'll need:

1. One networked machine
1. One "air-gapped" old laptop, preferably without any wireless capabilities.
1. A smartphone with a barcode scanner.

### Intro

If you want to store bitcoin for the long-haul, you should address the thorny
problem of how best to store them.  Since people love stealing bitcoins
from others more than just about anything else in this world, all storage
systems must first and foremost:

     1. Prevent others from stealing your coin

The easiest way to achieve this goal is simply to destroy your private keys.
So there must be a yin to requirement #1's yang, which is to:

     2. Avoid accidental loss

Storing bitcoin shouldn't rob them of their best properties.  So in
addition, good bitcoin storage should be:

     3. Low-cost

and in case you need to leave the country in a hurry, or if you inexplicably
wash up naked on a foreign shore:

     4. Globally accessible

We realize #4 is ridiculous, but still, it's fun to think about.

Achieving all four of these goals simultaneously is challenging, and most systems we
looked at fell short on at least one of these axes.  We'll cover those later in this
article, but first, we suggest a prefered method to store your retirement coin, which is:

### A Security-Enhanced *Brain Wallet*

A brain wallet is an open algorithm that deterministically converts a
secret passphrase into public/private key pair.  We found existing
brainwallets lacking, so we built [WarpWallet](https://keybase.io/warp), a
security-enhanced brain wallet implemented as a standalone Web page.  Here is
the system, at a high level (we present a detailed step-by-step checklist below):

1. Buy your retirement coins on [Coinbase](https://coinbase.com) or the exchange of
your choosing.
1. Copy the [WarpWallet HTML](https://keybase.io/warp) to an air-gapped machine.
1. Pick a good passphrase. For example: `vicar formal lubbers errata veriest mutton`.  More on this later.
1. Run WarpWallet on the air-gapped machine to convert your passphrase to a public/private key pair.  Use your
email address as your "salt"
1. Use your phone to scan the public key, and email it to yourself.
1. On your networked machine, transfer coin from Coinbase to the WarpWallet-generated address.
1. Turn off the air-gapped machine.
1. Leave little notes around your house and office to remind you of what your passphrase is in case you ever forget

### Security Analysis

There are three main attacks an adversary can attempt to steal your coin: (1) infiltrate your 
machines; (2) break WarpWallet's cryptography; or (3) brute-force your password.  Let's look at
all three.

For the first attack, assume the worst case, that the attacker has compromised all three machines.
An attacker who has compromised your air-gapped machine knows your private key, but has no
way to communicate it back.  A compromise of your phone or your networked machine gives
the attacker access to your public key, but that won't allow a theft of your coin as long
as the Bitcoin protocol holds.  Of course, an attacker who controls your networked machine
can also move your coin out of a Coinbase to an account of his choosing, but assuming you can
transfer your coin to a WarpWallet before him, you are in the clear.  If you lose the race,
we of course can't help, welcome to the brotherhood of the burgled.

The next attack to consider is a break of WarpWallet's cryptography.  WarpWallet works as follows:

1. Generate `s1`	= scrypt(key=`passphrase||0x1`, salt=`salt||0x1`, N=2<sup>18</sup>, r=8, p=1, dkLen=32)
1. Generate `s2`	= pbkdf2(key=`passphrase||0x2`, salt=`salt||0x2`, c=2<sup>16</sup>, dkLen=32, prf=HMAC_SHA256)
1. Generate `keypair`	= generate_bitcoin_keypair(`s1` ⊕ `s2`)

A crypto break would allow an adversary to compute `keypair` from a candidate
`passphrase` and `salt` more efficiently than running `scrypt` and `PBKDF2` in
the forward-direction.  In other words, it would make his brute-force  attack
more efficient. So the remaining question to consider is how feasible a brute-
force attack is. The attack works as follows:

1. Generate a huge dictionary of possible passphrases, pulled from literature, popular password
databases, movie lines, song lyrics, etc.
1. For each phrase in the corpus, generate a brain wallet key pair.
1. Watch the block chain for transfers sent to public addresses in the precomputed database.
1. On a hit, use the corresponding private key to transfer the coin to a safe address.

The first observation about a brute-force attack on WarpWallet is that it has to be tailored
to a particular e-mail address.  So a traditional "Rainbow Table" won't fly here.  In the end,
the adversary's ability to generate keypairs from passphrases limits the success of his attack.
If he finds a break in both `scrypt` and `PBKDF2`, he can generate millions a second.  If 
one or both schemes remains secure, the generation rate plummets.

We can quantify security under the assumption that `scrypt` is secure, and the `PBKDF2`
step is free.  Note that WarpWallet uses security parameter 2<sup>18</sup>, and the Litecoin
system [uses](https://litecoin.info/Comparison_between_Litecoin_and_Bitcoin) 2<sup>10</sup>.
At the time of writing, the maximally observed [hashing rate](https://litecoin.info/Mining_hardware_comparison)
for Litecoin is 1.5MH/s with a [$900 graphics card](http://www.newegg.com/Product/Product.aspx?Item=N82E16814127735).
Such a setup could compute WarpWallet addresses at 2<sup>20.53-8-9.81</sup> = 2<sup>2.72</sup> hashes/second/dollar, assuming
energy is free.  So an adversary who buys $8 million worth of hardware could compute 
2<sup>25.72</sup> hashes per second, and could guess a passphrase with 60 bits of entropy in about
330 years.  That's a comfortable security margin for now.  If there's a news report
that scrypt is broken, you still have the cushion of PBKDF2 while you change to a different scheme.





### What's a Good Passphrase?

### What You'll Need

### Step-By-Step Checklist

### Survey of Other Systems

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

With other online systems, we've seen cases of
[financial fraud](http://www.zerohedge.com/news/2013-07-23/texan-charged-bitcoin-denominated-ponzi-scheme) and
"honest" [programmer](http://arstechnica.com/business/2013/04/bitfloor-number-four-bitcoin-based-exchange-shuts-down-for-good/) 
[error](https://bitcointalk.org/index.php?topic=83794.0#post_bitomatpl_loss) robbing
customers of their savings.

#### Running Your Own Wallet 

Anyone with a cable modem and some extra storage space can run their own
wallet (either [full](http://bitcoin.org/en/download) or
[thin](https://electrum.org/)). Running your own wallet makes sense if you
transact frequently, but leaves your vulnerable for long-term storage.
It's susceptible to both theft and loss.  With backups and encrypted backups,
you can at best trade-off loss-resilience for theft-resilience.

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

#### The "Brain Wallet"

The "Brain Wallet" seems the most compelling solution.  This technique works as follows:
you come up with a long and hard-to-guess passphrase; you hash this passphrase to a 256-bit
string, which becomes the bitcoin private key; you apply basic bitcoin cryptography to generate
a corresponding public key; you send coins from Coinbase to your public key.  To access
your coin from "storage", remember the passphrase and regenerate the secret key; use that
secret key to transfer coin back to Coinbase. 

The Brain Wallet scores perfectly on the last two properties.  It is slightly vulnerable to loss
if you forget your passphrase (which to be fair, you will use infrequently but needs to be 
long).  Some implementations are [scams](http://www.reddit.com/r/Bitcoin/comments/1c13ld/i_invested_all_of_my_bitcoin_to_a_brain_wallet/);
[others](https://www.bitaddress.org) are honest but when combined with [guessible passphrases](http://www.reddit.com/r/Bitcoin/comments/1ptuf3/)
insecure.  The attack works as follows:


#### Enter WarpWallet

But [WarpWallet](https://keybase.io/warp) is a brain wallet  that raises the
security bar substantially with two improvements: first, warp wallets are
salted, forcing attackers to target individual users; and second, passphrases
are run through [scrypt](http://www.tarsnap.com/scrypt.html), and then
through the standard brain wallet algorithm, adding significant computational
difficulty to constructing a giant lookup table.




