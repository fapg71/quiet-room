# The Quiet Room

A cozy home for poems and music, with warm paper colors, expressive typography, original artwork, and space to slow down. The website uses plain HTML, CSS, and JavaScript. You can edit the included files and publish them directly with GitHub Pages; there is no installation or build step.

**Start here:** unzip the download, open `index.html` in your browser, then edit `content.js` to make the site yours.

## What to personalize first

1. Open `content.js` in a plain-text editor, such as VS Code or Notepad. On a Mac, use TextEdit in plain-text mode.
2. Replace `Your name`, the biography, and the sample poems with your own words.
3. Put your recordings in `assets/audio/` and update the track entries.
4. Once you have replaced **all** the sample poems and demo music, change `sampleContent: true` to `sampleContent: false`. Until then, keep the template disclosure visible.
5. Save your changes and refresh `index.html` to check the result.

The included poems and **After the rain** instrumental are original generated examples for this template. The demo is not presented as your work. The recording is a 42-second synthesized instrumental with no borrowed audio or samples. Replace it with your own recording before presenting the collection as yours.

## Publish on GitHub Pages

### 1. Create a repository

Sign in to [GitHub](https://github.com/new) and create a repository. A name such as `poems-and-music` works well. Choose **Public** if you use GitHub Free. Adding a README during creation makes the initial branch available immediately. [GitHub's site creation guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

### 2. Upload the website files

Open the repository, select **Add file → Upload files**, then drag in the **contents of the unzipped website folder**, including the `assets` folder. Keep `index.html`, `content.js`, `styles.css`, and `app.js` together at the repository's top level. Do not upload only the ZIP, and do not place everything inside another `quiet-room` folder. Review the upload, enter a short commit message, and save the changes to `main`. If you use a new branch, merge it into `main` before enabling Pages. [GitHub's upload instructions](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)

The included `.nojekyll` file tells GitHub to serve the static files without Jekyll processing. Some file browsers hide that file. If it was skipped, you can create it at the repository root using **Add file → Create new file**, name it `.nojekyll`, leave it empty, and commit it.

### 3. Enable Pages

In the repository, open **Settings → Pages**. Under **Build and deployment**, set:

| Setting | Value |
| --- | --- |
| Source | **Deploy from a branch** |
| Branch | **main** |
| Folder | **/(root)** |

Select **Save**. Use your actual branch name if it is different from `main`. GitHub then publishes changes committed to that branch and folder. [GitHub's publishing settings guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

### 4. Open your website

When deployment completes, return to **Settings → Pages** and select **Visit site**. For a project named `poems-and-music`, the address is usually:

```text
https://YOUR-USERNAME.github.io/poems-and-music/
```

If you name the repository `YOUR-USERNAME.github.io`, its site lives at `https://YOUR-USERNAME.github.io/`. Publishing can take up to 10 minutes. Later, editing or replacing files on `main` updates the site automatically. [GitHub's site creation guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## Edit your name, welcome, and biography

Your collection, identity, welcome, and biography fields live inside `window.QUIET_ROOM_CONTENT` in `content.js`. Keep the surrounding braces, brackets, and commas; replace the text between quotation marks.

| Field inside `site` | What to put there |
| --- | --- |
| `name` | Your website's title. |
| `author` | Your name or pen name. |
| `description` | A brief description for page metadata. |
| `tagline` | The small line introducing your collection. |
| `heroLines` | The main welcome heading, split into short lines. |
| `heroNote` | The short invitation below the welcome heading. |
| `intro` | Your about section's short introduction. |
| `about` | An array of biography paragraphs; each quoted string becomes a paragraph. |
| `email` | A public contact address, or `""` to omit the email link. |
| `socials` | Your links, or `[]` to omit them. |
| `sampleContent` | Keep `true` while any included demo writing or recording remains. |

For example, your links can look like this:

```js
socials: [
  { label: "Bandcamp", url: "https://YOUR-NAME.bandcamp.com" },
  { label: "Instagram", url: "https://www.instagram.com/YOUR-NAME/" }
],
```

Use full `https://` addresses for external links. The email link opens a visitor's email app; it is not a website inbox or contact form. Anything you publish in these fields is visible on the public site.

## Add or replace a poem

The `poems` array contains the individual poems. Replace an existing entry or copy one complete `{ ... }` entry into the array. Put a comma between entries and give every poem a unique `id` made of lowercase letters, numbers, and hyphens.

```js
{
  id: "your-poem-title",
  title: "Your poem title",
  collection: "Small observations",
  date: "October 2026",
  excerpt: "A short opening line or description for the poem card.",
  lines: [
    "Your first line goes here.",
    "Your second line goes here.",
    "",
    "An empty string starts a new stanza.",
    "Keep each deliberate line break in its own string."
  ],
  note: "An optional note about this poem."
},
```

Set `note: ""` if you do not want an author's note. `date` is display text, so you can use a month and year or another short label. Reusing a collection name groups poems together in the collection filter. Entries appear in the order you list them, so put your featured or newest poems first.

Use ordinary text rather than HTML. If you need a quotation mark inside a string, escape it with a backslash, for example `"She said \"stay\"."`. Apostrophes can be used normally inside double-quoted strings.

## Add your music

1. Copy your recording into `assets/audio/`. An MP3 with a short, lowercase filename such as `kitchen-window.mp3` is a convenient choice.
2. Add or replace an entry in the `tracks` array in `content.js`.
3. Set `src` to the recording's path, beginning with `assets/`, and upload both the edited `content.js` and the recording to GitHub.

```js
{
  id: "kitchen-window",
  title: "Kitchen window",
  subtitle: "A home recording · 2026",
  src: "assets/audio/kitchen-window.mp3",
  artwork: "assets/quiet-room-art.png",
  kind: "original",
  durationLabel: "3:12"
},
```

`durationLabel` is an optional display hint; the player reads the recording's actual duration when it loads. `kind: "demo"` is shown as **Template demo**, and `kind: "original"` is shown as **Original recording**. Use a different short string if another label better describes a recording you are authorized to share.

For your own cover art, upload an image such as `assets/kitchen-window-cover.jpg` and change `artwork` to that relative path. You can reuse the included art while setting up your site. MP3 is the simplest choice for broad browser support. Audio starts only after a visitor presses play.

Keep local paths relative: use `assets/audio/song.mp3`, without a leading slash. This lets the site work both under a GitHub project address and when you open it on your computer. Filenames and letter case must match exactly.

### A practical note on audio size

GitHub's browser uploader accepts files up to **25 MiB each**, with up to **100 files per upload**. Compress large WAV masters to MP3 before uploading. [GitHub upload limits](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)

Published GitHub Pages sites have a **1 GB** size limit and a soft **100 GB/month** bandwidth limit. A small poetry and music portfolio with compressed recordings should be straightforward to maintain; an extensive audio catalog is better served from a dedicated audio host. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

## Change the look

Open `styles.css` and edit the color variables in the `:root` block near the top:

| Variable | Purpose |
| --- | --- |
| `--paper` | Main page background. |
| `--paper-raised` | Cards and reading surfaces. |
| `--ink` | Main text. |
| `--muted` | Secondary text. |
| `--rust` | Warm accent color. |
| `--sage` | Soft green accent. |
| `--line` | Borders and dividers. |

The **Lamplight** button switches to a second palette. To customize that palette too, edit the matching variables in the `[data-theme="dark"]` block. Keep good contrast between text and paper colors. The site uses fonts already available on visitors' devices and includes its own artwork and demo audio, so it does not depend on external font services, tracking scripts, or asset CDNs.

## Files you will work with

| File or folder | What it does |
| --- | --- |
| `index.html` | Page structure and initial metadata. |
| `content.js` | Your poems, music list, welcome, biography, and contact details. |
| `styles.css` | Colors, typography, spacing, and responsive layout. |
| `app.js` | Reading, filtering, and audio-player behavior. |
| `assets/` | Artwork and music files served with the site. |

The app updates the browser title and description from `content.js`. For services that read only the original HTML when making a link preview, also personalize the `<title>` and description fields in `index.html`.

This is a static portfolio. You manage content by editing and uploading the files. Visitors can read and listen; there is no visitor upload form, account system, database, server, or administrative dashboard to configure.

## If something looks wrong

- **GitHub shows the README instead of the site:** check that `index.html` is at the top level of the chosen publishing folder, then verify **main / (root)** in Pages settings.
- **Artwork or audio is missing:** check the exact spelling and capitalization in `content.js`, confirm the files were uploaded, and remove any leading `/` from local asset paths.
- **The page is empty after editing:** check for a missing quotation mark, comma, bracket, or brace in `content.js`. Plain-text editors can highlight these mistakes. Undo your last edit, then try a smaller change.
- **A recent update is missing:** wait for the Pages deployment to finish, then refresh the page. The repository's **Actions** tab shows deployment status.
- **The player does not start:** press play, check your device volume, and confirm the recording is a valid MP3 at the configured path. Playback is never automatic.

GitHub instructions above were checked against the official documentation on October 17, 2026 (UTC).
