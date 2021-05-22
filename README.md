# Abitikku

> Flash Abitti to USB drives, safely and easily.

Abitikku is a powerful Abitti flasher built with web technologies to ensure flashing a USB drive is a pleasant and safe experience. It protects you from accidentally writing to your hard-drives, ensures every byte of data was written correctly and much more.

[![Current Release](https://img.shields.io/github/release/Testausserveri/abitikku.svg?style=flat-square)](https://balena.io/etcher)
[![License](https://img.shields.io/github/license/Testausserveri/abitikku.svg?style=flat-square)](https://github.com/balena-io/etcher/blob/master/LICENSE)
[![Testausserveri Discord](https://img.shields.io/discord/697710787636101202?label=Testausserveri%20Discord&style=flat-square)](https://discord.testausserveri.fi)

---

## Supported Operating Systems

- Linux (most distros)
- macOS 10.10 (Yosemite) and later
- Microsoft Windows 7 and later

## Installing

Refer to the [releases page](https://github.com/Testausserveri/abitikku/releases) for the latest pre-made
binaries/installers for all supported operating systems.

## Developing
Clone this repository with recursive submodules, and run `make electron-develop`.
To start electron, run `npm run start`.

After changes, run `npm run webpack` to generate new code under generated/ directory.

## Support

If you're having any problem, please [raise an issue][newissue] on GitHub, and Testausserveri will be happy to help.

## License

Abitikku is free software and may be redistributed under the terms specified in
the [license].

[newissue]: https://github.com/Testausserveri/abitikku/issues/new
[license]: https://github.com/Testausserveri/abitikku/blob/master/LICENSE
