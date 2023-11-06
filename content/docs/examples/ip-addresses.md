---
title: 'Example: IP addresses'
description: 'Test if a string is a valid IPv4 or IPv6 address'
excerpt: ''
date: 2022-09-10T18:16:11+00:00
lastmod: 2022-09-10T18:16:11+00:00
draft: false
images: []
menu:
  docs:
    parent: 'examples'
weight: 9005
toc: true
---

Here's a regular expression that checks if a string is a valid IPv4 or IPv6 address:

```regexp
^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}|:(:[0-9a-fA-F]{1,4}){1,7}|::|fe80:(:[0-9a-fA-F]{1,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$
```

Here's the same regexp in free-spacing mode with some comments added:

```regexp
(?x)
^(
    ( [0-9a-fA-F]{1,4} : ){7}       [0-9a-fA-F]{1,4}
  | ( [0-9a-fA-F]{1,4} : ){1,7}   :
  | ( [0-9a-fA-F]{1,4} : ){1,6}   : [0-9a-fA-F]{1,4}
  | ( [0-9a-fA-F]{1,4} : ){1,5} ( : [0-9a-fA-F]{1,4} ){1,2}
  | ( [0-9a-fA-F]{1,4} : ){1,4} ( : [0-9a-fA-F]{1,4} ){1,3}
  | ( [0-9a-fA-F]{1,4} : ){1,3} ( : [0-9a-fA-F]{1,4} ){1,4}
  | ( [0-9a-fA-F]{1,4} : ){1,2} ( : [0-9a-fA-F]{1,4} ){1,5}
  |   [0-9a-fA-F]{1,4} :        ( : [0-9a-fA-F]{1,4} ){1,6}
  |                    :        ( : [0-9a-fA-F]{1,4} ){1,7}
  | ::
  | fe80: ( : [0-9a-fA-F]{1,4} ){0,4} % [0-9a-zA-Z]+   # link-local IPv6 addresses with zone index
  | :: ( ffff ( : 0{1,4} )? : )?
    ( ( 25[0-5] | ( 2[0-4] | 1?[0-9] )? [0-9] ) \.){3}
      ( 25[0-5] | ( 2[0-4] | 1?[0-9] )? [0-9] )        # IPv4-mapped IPv6 addresses and IPv4-translated addresses
  | ( [0-9a-fA-F]{1,4} : ){1,4} :
    ( ( 25[0-5] | ( 2[0-4] | 1?[0-9] )? [0-9] ) \.){3}
      ( 25[0-5] | ( 2[0-4] | 1?[0-9] )? [0-9] )        # IPv4-Embedded IPv6 Address
  | ( ( 25[0-5] | ( 2[0-4] | 1?[0-9] )? [0-9] ) \.){3}
      ( 25[0-5] | ( 2[0-4] | 1?[0-9] )? [0-9] )        # IPv4
)$
```

And the equivalent Pomsky expression:

```pomsky
# segment in an IPv4 address
let num_v4 = range '0'-'255';

# segment in an IPv6 address
let num_v6 = [ascii_xdigit]{1,4};

# IPv4 address
let ipv4 = (num_v4 '.'){3} num_v4;

# link-local IPv6 address with zone index
# e.g. fe80::7:8%eth0   fe80::7:8%1
let link_local = 'fe80:' (':' num_v6){0,4} '%' [ascii_alnum]+;

# IPv4-Embedded IPv6 Address
# e.g. 2001:db8:3:4::192.0.2.33   64:ff9b::192.0.2.33
let ipv4_embedded = (num_v6 ':'){1,4} ':' ipv4;

# IPv4-mapped IPv6 address or IPv4-translated address
# e.g. ::255.255.255.255   ::ffff:255.255.255.255   ::ffff:0:255.255.255.255
let ipv4_mapped_translated = '::' ('ffff' (':' '0'{1,4})? ':')? ipv4;

# IPv6 address
let ipv6 = (
  | (num_v6 ':'){7}        num_v6
  | (num_v6 ':'){1,7}  ':'
  | (num_v6 ':'){1,6} (':' num_v6)
  | (num_v6 ':'){1,5} (':' num_v6){1,2}
  | (num_v6 ':'){1,4} (':' num_v6){1,3}
  | (num_v6 ':'){1,3} (':' num_v6){1,4}
  | (num_v6 ':'){1,2} (':' num_v6){1,5}
  | (num_v6 ':')      (':' num_v6){1,6}
  |         ':'       (':' num_v6){1,7}
  | '::'
  | link_local
  | ipv4_mapped_translated
  | ipv4_embedded
);

# IP address
^ (ipv6 | ipv4) $
```
