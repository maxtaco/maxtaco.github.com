---
layout: post
title: "How to Store your Bitcoin"
description: "Keep your bitcoin safe from theft and loss; directions how"
category: bitcoin
tags: [bitcoin, warpwallet, security]
---
{% include JB/setup %}

# The Problem

I've recently come across some folks who want to hold onto bitcoin for the long haul.  The question on our
minds is how to hold onto bitcoin cheaply, simply and securely.  Everyone has their own ideas on this, but I've
put together some instructions that make sense to me and my colleagues.

## What's Wrong with Coinbase?

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
One of the coolest parts of bitcoin is that it allows you to take your
security into your own hands.  Why not grab this opportunity by the balls
(bits)?

## What Does a Solution Look Like?

A good long-term storage coin solution has the following properties:

1. Resilience to theft
1. Resilience to loss and other forms of user error
1. Low-expense
1. Global accessibility (in case you need to flee or wash up inexplicably naked
on a foreign shore).

Of course, the first two are by far the most important, but in the interest of being
thorough, let's consider the full list and see how different coin storage methods fare:

#### Online wallet services (like Coinbase, BitStamp, etc)

Online wallets, as argued above, are vulnerable to online attacks, 
[financial fraud](http://www.zerohedge.com/news/2013-07-23/texan-charged-bitcoin-denominated-ponzi-scheme),
"honest" [programmer](http://arstechnica.com/business/2013/04/bitfloor-number-four-bitcoin-based-exchange-shuts-down-for-good/) 
[error](https://bitcointalk.org/index.php?topic=83794.0#post_bitomatpl_loss)
or business errors.  So some combination of malice and carelessness can threaten your savings.

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

## Enter WarpWallet

But [WarpWallet](https://keybase.io/warp) is a brain wallet  that raises the
security bar substantially with two improvements: first, warp wallets are
salted, forcing attackers to target individual users; and second, passphrases
are run through [scrypt](http://www.tarsnap.com/scrypt.html), and then
through the standard brain wallet algorithm, adding significant computational
difficulty to constructing a giant lookup table.




