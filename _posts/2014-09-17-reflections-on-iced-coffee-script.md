---
layout: post
title: "Handling Errors in IcedCoffeeScript"
description: ""
category: programming
tags: [CoffeeSript, JavaScript, IcedCoffeeScript]
page:
  comments : false
---
{% include JB/setup %}

<link href="/assets/css/blog.css" rel="stylesheet" media="screen" />

[Chris Coyne](https://keybase.io/chris) and [I](https://keybase.io/max) 
wrote [IcedCoffeeScript](https://github.com/maxtaco/coffee-script) about 2 year ago, 
and have been developing with it almost exclusively since.  Our current project, 
[Keybase.io](https://keybase.io), uses ICS
in three distinct places: on the Web front-end, in our [node command-line client](https://github.com/keybase/node-client),
and on the server back-end.  As client code becomes more complex, we find the
features of ICS more crucial to getting our job done.  I thought I'd summarize
what makes it a nice system for those who haven't checked it out.

## Background

IcedCoffeeScript is a fork of [CoffeeScript](https://github.com/jashkenas/coffee-script) that introduced two new keywords
--- `await` and `defer`.  Internally, it augments the CoffeeScript compiler
with a [Continutation-Passing Style (CPS)](http://en.wikipedia.org/wiki/Continuation-passing_style) code rewriter.
So the compiler outputs "pyramid-of-death" style spaghetti JavaScript code, while the
programmer sees clean straightline CoffeeScript-like code.

For instance, consider this common pattern in node.js.  I want to make two serial
HTTP requests, and the first depends on the second.  When it's all done, I want
a callback to fire with the results, or to describe that an error happened:

{% highlight coffeescript %}
get2 = (cb) ->
  request "https://x.io/", (err, res, body) ->
    if err? then cb err
    else 
      request "https://x.io/?q=#{body.hash}", (err, res, body) ->
        if err? then cb err
        else cb null, body
{% endhighlight %}

This is not a contrived example, it was literally the first example that I thought of.
I hate this code for several reasons; it's hard to read; it's hard refactor; there are
repeated calls to `cb`, any one of which might be forgotten and can break the program;
it's brittle and won't compose well with standard language features, like `if` and `for`.

## Cool that Coffee Down

The first part of the solution came intentionally with IcedCoffeeScript; use
CPS conversion to achieve the illusion of threads:

{% highlight coffeescript %}
get2 = (cb) ->
  await request "https://x.io/", defer(err, res, body)
  unless err?
    await request "https://x.io/?q=#{body.hash}", defer(err, res, body)
  cb err, body
{% endhighlight %}

It's not crucial to understand the finer points of `await` and `defer` here, but the
salient aspects are that the function `get2` will block until `request` completes,
at which point `err, res, body` will get the three values that `request` called back with.
Then, control continues at `unless err?`.

Already, this code is much cleaner.  There's only one call to `cb`; the code doesn't
veer off the page the right; adding conditionals and iteration would be straightforward.
But there's still an issue: errors are ugly to handle.  If we had 4 steps in this
request pipeline, we'd need three checks of `err?` to make sure there wasn't an error.
Or something equally gross:

{% highlight coffeescript %}
get2 = (cb) ->
  await request "https://x.io/", defer(err, res, body)
  return cb err if err?
  await request "https://x.io/?q=#{body.hash}", defer(err, res, body)
  return cb err if err?
  # etc...
  cb null, res
{% endhighlight %}

<br/>

## An Elegant Solution that Exploits the CPS-conversion

The elegant solution only [came to us](https://github.com/maxtaco/coffee-script/issues/35) a year into writing code with IcedCoffeeScript.
In the above example, the language feature `defer(err, res, body)` creates a callback that
`request` calls when it's done.  That callback represents *the rest of the `get2` function*!
Meaning, if there's an error, it can be thrown away, since the rest of the function should
not be executed.  Instead, the outer callback, `cb`, should be called with an error.

We can accomplish this pattern without any additions to the language, just with library help:

{% highlight coffeescript %}
{make_esc} = require 'iced-error'
get2 = (cb) ->
  esc = make_esc cb # 'ESC' stands for Error Short Circuiter
  await request "https://x.io/", esc(defer(res, body))
  await request "https://x.io/?q=#{body.hash}", esc(defer(res, body))
  cb null, res
{% endhighlight %}

If the first call to `request` calls back with an error, then `cb` is called with the error, and the function is over.
The function `make_esc` seems like magic, but it's not, it's doing something quite simple:

{% highlight coffeescript %}
make_esc = (cb1) -> (cb2) -> (err, args...) ->
  if err? then cb1(err) else cb2(args...)
{% endhighlight %}

It takes the original callback, and returns a function that we've called `esc`.  In turn,
`esc` takes the local callback, and returns a third callback.  This third callback is what
`request` calls when it's done.  If the result is an error, then fire the outer callback
with the error, throwing away `cb2`, which represents the rest of the function. If the result
is not an error, then forge ahead.  Call `cb2` which executes the rest of the function.

This `make_esc` function is extremely useful and I use it in almost *every function that I write*.
But because it's a library function, you can write your own to work around the weird error
semantics of your particular library, without having to fiddle with the IcedCoffeeScript
compiler. Or, you can write an `make_esc` that first releases a lock, and then calls `cb`
(also quite useful).

## In Sum...

IcedCoffeeScript plus the "Error Short-Circuiter" library is powerful and succint
way to clean up your JavaScript-based applications.  We're been writing code this
way for a year now, and can't imagine going back to the old toolset.

