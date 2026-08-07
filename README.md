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

# Gameplay/General

* Client crash safety: A player that quits/crashes can, in most cases, have their score restored if they rejoin the same team when they reconnect.
* Screen flips when using a portal
* `g_friendlyFire 1` - nobody sees color anymore (greyscale, etc).
* `bot_skynet 1` - bots will work  to eliminate humans including teammates. Player deaths are attributed to MOD_SKYNET.
* `g_acme_jumppad 1` - jumppad trajectories deviate slightly
* `g_acme_weapons 1` - grenades and rockets explode more quickly (random) and have a larger blast radius
* On death, players leave behind a gift (a rocket that hovers and explodes shortly after)


## Teleporter Malfunctions

* Enabled per team, off by default: `g_blu_teleporter_malfunction` and `g_red_teleporter_malfunction`
* Probability, 50% by default: `g_teleporter_malfunction_rate`

## Easter eggs? Oddities?

* Pickup quad damage plays "Bow to my firewall!" sound plus a banner w/ bruce potter yelling into a microphone
* Bighead (heads are 2x the size)

# rcon judge commands

`judge` is an rcon command that can manipulate the game. Subcommands:

Syntax: `judge <target> <command ...args>`

Valid targets: `all`, `red`, `blue`, or a numeric player id.

Subcommands:

* `hurt num` - cause _num_ amount of damage to the target(s)
* `burn duration` - cause burn damage for the given duration (in milliseconds)
* `nudge` - tf2 admin slap? Bumps the player in a random direction.
* `give weapons` - give all weapons and ammo
* `take ammo` - set all ammo values to zero.
* `god on|off` - set god mode on or off
* `noclip on|off` - set noclip on or off
* `js ...` - execute javascript on the client

Javascript Shenanigans:

using `rcon judge <target> js <code>` where _code_ is below:

* `q3.Mirror(duration)` - horizontal flip of client's screen for the given _duration_ in milliseconds
* `q3.Hack()` - hack the client. Temporarily disrupt human input and causing player demise.
* `q3.Crash(duration)` - Windows BSOD for _duration_ milliseconds. Disables human inputs while active.
* `q3.Visual.Blur(duration)` - Blurs the game screen for _duration_ milliseconds.
