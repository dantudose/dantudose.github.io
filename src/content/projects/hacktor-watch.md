---
title: Hacktor Watch
description: An open hardware smartwatch with firmware you can shape. Build it, program it, wear it.
status: active
cover: ../../assets/hacktor-watch/on-wrist.jpg
coverAlt: A Hacktor Watch with a red strap on a wrist, its round screen showing the word Hello.
links:
  - label: hacktorwatch.com
    href: https://hacktorwatch.com
  - label: Source on GitHub
    href: https://github.com/hacktorwatch/Hacktor-Watch-2.0
  - label: NuttX port
    href: https://github.com/radupascale/hectorwatch-nuttx
---

Hacktor Watch is an open hardware smartwatch with firmware you can shape. Start from the hardware design, or boot into Arduino, NuttX or Zephyr to prototype your own apps.

The project has its own website at [hacktorwatch.com](https://hacktorwatch.com), and the design files and firmware are on GitHub at [hacktorwatch/Hacktor-Watch-2.0](https://github.com/hacktorwatch/Hacktor-Watch-2.0).

## At a glance

| Subsystem | Spec |
| --- | --- |
| Processor | ESP32-S3, dual-core 240 MHz, Wi-Fi and BLE |
| Display | 1.28" color LCD, 240 × 240, capacitive touch |
| Memory | 32 MB external SPI flash, 8 MB PSRAM |
| Sensors | 6-axis IMU, microphone |
| Output | I2S amplifier and speaker, haptic driver |
| Power | 250 mAh LiPo, USB-C charging, fuel gauge |
| Software | Arduino, NuttX, Zephyr |

![Block diagram of the watch: an ESP32-S3 connected to the LCD and touch panel, microphone, audio amplifier, PSRAM, NOR flash, IMU, haptic driver, fuel gauge, battery charger and two DC/DC converters.](../../assets/hacktor-watch/block-diagram.svg "Hardware block diagram.")

## Project areas

- **[Hardware](https://github.com/hacktorwatch/Hacktor-Watch-2.0/tree/main/Hardware)** — schematics and PCB design.
- **[Mechanical](https://github.com/hacktorwatch/Hacktor-Watch-2.0/tree/main/Mechanical)** — enclosure and assembly files.
- **[Arduino](https://github.com/hacktorwatch/Hacktor-Watch-2.0/tree/main/Software/Arduino)** — Arduino-compatible APIs to prototype quickly and teach.
- **[Zephyr](https://github.com/hacktorwatch/Hacktor-Watch-2.0/tree/main/Software/Zephyr)** — an RTOS application configured with Devicetree and Kconfig.
- **[NuttX](https://github.com/radupascale/hectorwatch-nuttx)** — a POSIX-friendly RTOS on the watch for real-time apps.
