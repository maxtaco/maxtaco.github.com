---
layout: page
title: About Me
---
{% include JB/setup %}

Hi, I'm Max Krohn.  I like to build software.  Previously, I was
the co-founder and CTO of TheSpark.com, [SparkNotes](http://www.sparknotes.com)
and [OkCupid](http://okcupid.com).  I built the [Ok Web Server](http://okws.org)
for OkCupid while pursing a [PhD](http://pdos.csail.mit.edu/~max/docs/krohn-thesis.pdf)
at [MIT advised by Frank Kaashoek](http://pdos.csail.mit.edu). Since leaving MIT
and OkCupid, I've been working on the [IcedCoffeeScript](https://maxtaco.github.com/coffee-script)
extention to CoffeeScript, the [OneShallPass](https://oneshallpass.com) password
management system, and [Keybase.io](https://keybase.io) with [Chris Coyne](http://malgorithms.com).

## Follow Me

* [max](https://keybase.io/max) on Keybase
* [@maxtaco](https://twitter.com/maxtaco) on Twutter
* [maxtaco](https://github.com/maxtaco) on GitHub


## Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

