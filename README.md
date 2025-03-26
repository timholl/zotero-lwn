> [!IMPORTANT]
> This translator was successfully [upstreamed](https://github.com/zotero/translators/pull/3431) into the [`zotero/translators`](https://github.com/zotero/translators/) repository and is therefore available in future zotero installations by default.

# LWN.net translator for Zotero

Allows to easily import LWN.net articles into Zotero, including a Snapshot and the article EPUB.

~~I have not found the time to submit this into the [upstream translators repository](https://github.com/zotero/translators) yet.~~

## Installation

 - Simply drop (or symlink) the `LWN.net.js` file into your `{Zotero Data Directory}/translators` directory while Zotero is not running.
 - Start Zotero, then open the Browser Plugin's settings and hit "Advanced -> Translators -> Reset Translators" to trigger a reload of available translators.

## Usage

 - On supported LWN pages (news items, featured articles and guest articles), the Zotero plugin will turn into a little "newspaper" icon.
 - A single click on it will create a Zotero newspaper article entry for the current item, store a snapshot of the page and download the article in EPUB format (requires being logged in as subscriber).
