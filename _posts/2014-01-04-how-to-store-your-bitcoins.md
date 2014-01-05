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
1. Run WarpWallet on the air-gapped machine to convert your passphrase to a public/private key pair.
1. Use your phone to scan the public key, and email it to yourself.
1. On your networked machine, transfer coin from Coinbase to the WarpWallet-generated address.
1. Turn off the air-gapped machine.
1. Leave little notes around your house and office to remind you of what your passphrase is in case you ever forget

### Security Analysis

There are three main attacks an adversary can attempt to steal your coin: (1) infiltrate your 
machines; (2) break WarpWallet's cryptography; or (3) brute-force your password.  Let's look at
all three.

For the first attack, assume the worst case, that the attacker has compromised all three machines.




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

1. An adversary generates a huge dictionary of possible passphrases, pulled from literature, popular password
databases, movie lines, song lyrics, etc.
1. For each phrase in the corpus, generate a brain wallet key pair.
1. Watch the block chain for transfers sent to public addresses in the precomputed database.
1. On a hit, use the corresponding private key to transfer the coin to a safe address.

#### Enter WarpWallet

But [WarpWallet](https://keybase.io/warp) is a brain wallet  that raises the
security bar substantially with two improvements: first, warp wallets are
salted, forcing attackers to target individual users; and second, passphrases
are run through [scrypt](http://www.tarsnap.com/scrypt.html), and then
through the standard brain wallet algorithm, adding significant computational
difficulty to constructing a giant lookup table.




