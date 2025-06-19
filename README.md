# Warhammer: The Old World Roleplaying Game (ALPHA)
The **work-in-progress** system for playing *Warhammer: The Old World Roleplaying  Game* on [Foundry VTT](https://foundryvtt.com/). Created by Moo Man.

<!-- ![](https://img.shields.io/github/v/release/moo-man/OldWorld-FoundryVTT?label=Latest%20Version)

![](https://img.shields.io/github/downloads/moo-man/OldWorld-FoundryVTT/latest/whtow.zip?label=Downloads%20%28Latest%20Version%29)

![](https://img.shields.io/badge/FoundryVTT%20Compatibility-V13-orange) -->

## Install
1. Go to the setup page and choose **Game Systems**.
2. Click the **Install System** button, find Old World in the search feature, and click install
3. Create a Game World using the Old World system.

See **Environment Setup** for instructions on how to build the project for development purposes.

## Official Modules
- In Progress!

## Special Thanks
- Cubicle 7
- Games Workshop

## Environment Setup

If you want to contribute to system development, clone the project to any folder to begin setting up your environment

### 1. Install Dependencies

```
npm install
```
### 2. Configure your Foundry Data Path

Copy and rename `example.foundryconfig.json` to `foundryconfig.json` and change the `path` property to your Foundry's Data location

### 3. Build the project

```
npm run build
```
This will build the project into the location specified by the path property in step 2, which provides a working system that Foundry can use.

## Related Websites
- [Foundry Virtual Tabletop](https://foundryvtt.com)
- [Warhammer: The Old World](https://cubicle7games.com/our-games/warhammer-the-old-world-roleplaying-game)

## Join the community
If you want to be more involved in development, test latest features, or provide more feedback, you can always join my [Moohammer Discord Server](https://discord.gg/GrMcdeDHh8). Alternatively, I'm very active on the [Foundry Discord Server](https://discord.gg/foundryvtt), just stop by the `#warhammer` channel!

## Licence
[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)
