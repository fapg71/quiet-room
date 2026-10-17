/*
 * MAKE THIS ROOM YOURS
 * Edit the text between quotes below. Keep the commas and brackets.
 * No build tools needed: save this file and refresh index.html.
 * Use a blank string ("") for a space between stanzas.
 * Full examples and GitHub Pages instructions are in README.md.
 */
window.QUIET_ROOM_CONTENT = {
  site: {
    name: "The Quiet Room",
    author: "Your name",
    description: "A small, quiet home for poems, music, and the things we feel.",
    tagline: "Poems, music & small things",
    heroLines: ["A little room", "for the things", "we feel."],
    heroNote: "Poems, quiet songs, and other small things worth keeping. Pull up a chair. Stay a little.",
    intro: "A space for the things I make.\nAnd the things that make me.",
    about: [
      "This is a small home for poems and music — for paying attention, making a little sense of things, and leaving a few beautiful things behind.",
      "Some days arrive as a line in a notebook. Others as a melody that won't quite let go. This is where they get to live."
    ],
    email: "", // Add your real email to show the contact link, e.g. "you@example.com".
    socials: [
      // { label: "Bandcamp", url: "https://your-name.bandcamp.com" },
      // { label: "Instagram", url: "https://www.instagram.com/your-name/" }
    ],
    sampleContent: true // Set false after replacing ALL sample writing, bio, and audio.
  },

  // These are original SAMPLE poems written for the template, not your work.
  // Keep each id unique. It is also used for direct links to a poem.
  poems: [
    {
      id: "the-light-we-leave-on",
      title: "The light we leave on",
      collection: "Everyday",
      date: "Sample collection",
      excerpt: "There is a kind of love\nthat looks like a kitchen\nafter everyone has gone —\n\na cup left out,\na chair turned toward the door.",
      lines: [
        "There is a kind of love",
        "that looks like a kitchen",
        "after everyone has gone —",
        "",
        "a cup left out,",
        "a chair turned toward the door.",
        "",
        "Nothing grand.",
        "Just the small, stubborn light",
        "above the stove",
        "saying: there is still room.",
        "",
        "Saying: whenever you arrive,",
        "you will not have to",
        "find the switch."
      ],
      note: "For the quiet ways we make room for one another."
    },
    {
      id: "weather-report",
      title: "Weather report",
      collection: "Becoming",
      date: "Sample collection",
      excerpt: "Today, a small clearing.\nNot the whole sky.\nEnough to hang a hope in.",
      lines: [
        "Today, a small clearing.",
        "Not the whole sky.",
        "Enough to hang a hope in.",
        "",
        "By noon, the kettle was singing",
        "its one reliable song.",
        "I stood beside it",
        "and let that count",
        "as good news."
      ],
      note: "A little forecast for beginning again."
    },
    {
      id: "where-the-time-goes",
      title: "Where the time goes",
      collection: "Longing",
      date: "Sample collection",
      excerpt: "Into the blue of a cup.\nInto a song from another summer.\nInto the long way home.",
      lines: [
        "Into the blue of a cup.",
        "Into a song from another summer.",
        "Into the long way home.",
        "",
        "I used to think it vanished.",
        "Now I find it everywhere:",
        "",
        "in the thumb-worn edge of a book,",
        "in how I still turn my head",
        "when someone laughs like you."
      ],
      note: "Some things keep their own kind of time."
    },
    {
      id: "an-inventory-of-small-things",
      title: "An inventory of small things",
      collection: "Everyday",
      date: "Sample collection",
      excerpt: "One orange, bright as an answer.\nTwo windows, open an inch.\nThe day asking for nothing.",
      lines: [
        "One orange, bright as an answer.",
        "Two windows, open an inch.",
        "The day asking for nothing.",
        "",
        "A pencil made shorter by trying.",
        "A plant leaning into the light.",
        "The comfortable weight of a blanket.",
        "",
        "And here at the end of the list:",
        "the ordinary miracle",
        "of having been here",
        "to notice."
      ],
      note: "A list that can always be made longer."
    }
  ],

  // Put your audio in assets/audio/ and change src to its relative filename.
  // Add more objects to this array for more tracks; only one plays at a time.
  tracks: [
    {
      id: "after-the-rain",
      title: "After the rain",
      subtitle: "A small instrumental sketch",
      src: "assets/audio/after-the-rain-demo.mp3",
      artwork: "assets/quiet-room-art.png",
      kind: "demo", // Your own music: use "original" (or a custom label).
      durationLabel: "0:42" // Displayed until the real audio metadata loads.
    }
  ]
};
