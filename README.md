# HF quakejs

This is a fork of an old ioq3 that has support for networking. Why so old? Well, at time of writing, the main ioq3 project does not support networking when compiled for the browser.

Getting the code:

```
git clone https://github.com/Forklifts-For-Great-Justice/quakejs
git submodule update --init

Running:

```
docker compose up --build
```

# Shenanigans

# rcon judge

`judge` is an rcon command that can manipulate the game. Subcommands:

Syntax: `judge <target> <command ...args>`

Valid targets: `all`, `red`, `blue`, or a numeric player id.

Subcommands:

* `hurt num` - cause _num_ amount of damage to the target(s)
* `give weapons` - give all weapons and ammo
* `take ammo` - set all ammo values to zero.
* `god on|off` - set god mode on or off

