<p align="center">
	<img src="https://raw.githubusercontent.com/joaocarmo/instagram-getter/master/lib/img/getter.svg?sanitize=true" width="456" alt="getter">
</p>

## About

A Tampermonkey userscript completely written in React to provide a button for
easily getting the post's photographs or videos from the web app.

## Usage

When installed, the script will render the logo next to the web app's own logo
(that's how you'll know it's working).
A dedicated button will then be appended to every post, so you can't miss it.

## Known issues

- Doesn't support videos yet
- Doesn't support profile pictures yet
- Stops working after browsing back and forth on multiple image posts a couple
of times
- May not show until scrolling has occurred after going back to the main profile
page
- Probably a lot more I haven't noticed yet

## FAQ

#### Why this?

I questioned myself if I could, then I did it.
I took some ideas from **siefkenj**'s [repository][1].

#### Why not a browser extension?

Tampermonkey is available for many different browsers, so this automatically
works in every supported browser.

#### Who did you make it for?

Me.

#### Can I use it?

Sure.

#### Can I fork/change it?

Sure, just check the [license][2].

#### How do I install/uninstall it?

Install the [Tampermonkey][3] extension in your favorite browser, then either
click or manually add the bundled `*.user.js` file.

You can uninstall it directly from the Tampermonkey dashboard.

#### Can I contribute?

Definitely.

#### I found an bug!

Open an issue.

## Contribute

Building is very easy, just execute the command below.
Don't forget to install the dependencies.

```sh
npm run build
```

## Changelog

### Current

#### v1.0.0

- Complete refactor using React

### Legacy

#### v0.3.0

- Added support for videos

#### v0.2.2

- Minor enhancements
- Added _jQuery_

#### v0.2.1

- Added dynamically calculated position to the IGetter button

#### v0.2

- Removed the close button,
- Added a button to the top bar to show/hide the menu
- Double click reloads the menu

#### v0.1.1

- Added a close button
- Added logic to detect if the image is an avatar or a post picture
- Added download and update URLs for update checks

#### v0.1

- Initial release

[1]: https://github.com/siefkenj/react-userscripts
[2]: ./LICENSE
[3]: https://www.tampermonkey.net/
