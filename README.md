# FCT Blueprint Compressor <a href="https://github.com/OstinUA"><img align="right" src="https://img.shields.io/badge/OstinUA-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![Factorio](https://img.shields.io/badge/Factorio-orange?style=for-the-badge&logo=factorio&logoColor=white)

A specialized web tool for optimizing and compressing Factorio blueprint strings. It decodes the blueprint data, removes redundant information, and re-compresses it to significantly reduce the string length for easier sharing on Steam, Discord, or Reddit.

## Features

* **Smart Optimization**: Parses the blueprint JSON and removes unnecessary data (empty arrays, default values, standard directions) to save space without losing functionality.
* **High Compression**: Uses the `pako` library with maximum compression settings (Level 9) to generate the smallest possible string.
* **Validation**: Includes a built-in verification tool to ensure the compressed string is valid and readable by the game.
* **Efficiency Stats**: Displays real-time statistics on character count reduction and percentage saved.

## Installation and Usage

1.  Clone the repository or download the source files.
2.  Open `index.html` in any modern web browser.
3.  Paste your original Factorio blueprint string into the input field.
4.  Click **"СЖАТЬ ЧЕРТЕЖ"** (Compress) to generate the optimized code.

## Community and Support

Project created with the support of the FCTostin community.

[![YouTube](https://img.shields.io/badge/YouTube-Channel-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@FCT-Ostin)
[![Telegram](https://img.shields.io/badge/Telegram-Join_Chat-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/FCTostin)
[![Steam](https://img.shields.io/badge/Steam-Join_Group-1b2838?style=for-the-badge&logo=steam&logoColor=white)](https://steamcommunity.com/groups/FCTgroup)

## Support the Development

[![Patreon](https://img.shields.io/badge/Patreon-Support-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://www.patreon.com/c/OstinFCT)
[![Boosty](https://img.shields.io/badge/Boosty-Donate-F15F2C?style=for-the-badge&logo=boosty&logoColor=white)](https://boosty.to/ostinfct)
