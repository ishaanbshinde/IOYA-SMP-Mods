# IOYA SMP Mods Portal

A custom modpack distribution website built for **IOYA SMP**, allowing players to browse Minecraft mods, select the ones they need, and generate a downloadable modpack ZIP directly from their browser.

## Features

- **Mod catalog** — Browse the available Minecraft mods.
- **Search system** — Quickly find mods by name.
- **Category filters** — Filter mods by their category.
- **Mod selection** — Select individual mods or multiple mods.
- **Recommended mods** — Quickly select the recommended modpack configuration.
- **Select all / Clear selection** — Manage your selections easily.
- **Automatic ZIP builder** — Download selected mods and package them automatically.
- **Organized ZIP structure** — Mods are automatically placed inside a `mods/` folder.
- **Progress tracking** — Monitor the mod downloads and ZIP generation process.
- **Error detection** — Failed mod downloads are reported instead of silently generating an incomplete modpack.
- **Installation tutorial** — Guides players through installing the modpack.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- JSZip
- GitHub for mod file hosting

## How It Works

1. Browse the mod catalog.
2. Select the mods you want.
3. Choose recommended mods or manually customize your selection.
4. Click **Build Modpack ZIP**.
5. The website fetches the selected mod files.
6. JSZip packages the downloaded files into a ZIP archive.
7. Download your modpack.
8. Extract the ZIP and place its `mods` folder into your Minecraft Fabric installation.

## Project Structure

```text
IOYA-SMP-Mods/
│
├── html/
│   ├── index.html
│   ├── downloads.html
│   └── tutorial.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── README.md
```

## Mod Hosting

The mod files are hosted through GitHub and retrieved dynamically when a user builds their modpack.

The website does not need to store a separate copy of every mod locally.

## Requirements

- Minecraft version compatible with the selected mods
- Fabric Loader
- Java compatible with your Minecraft version
- Internet connection to download the selected mod files

## Installation

1. Open the IOYA SMP Mods website.
2. Select your desired mods.
3. Generate your modpack ZIP.
4. Extract the downloaded ZIP.
5. Copy the `mods` folder into your Fabric Minecraft installation directory.
6. Launch Minecraft and verify the mods load correctly.

## Purpose

This project was created to make setting up IOYA SMP easier for players, especially those who don't want to manually search for, download, and install every mod individually.

Instead of manually assembling a modpack, players can use a single website to build their own mod ZIP.

---

**Made for IOYA SMP.**  
Built by Shin.
