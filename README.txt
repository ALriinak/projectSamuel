MIDIMAN — THE ROYAL MUSIC HALL
A medieval-themed music streaming website for your own music.

PUBLISHING:
1. Extract this ZIP.
2. Upload ALL contents to the ROOT of your existing GitHub repository (the same place as your current index.html).
3. If GitHub asks, replace the old index.html, style.css, and script.js.
4. Commit to main. GitHub Pages will redeploy automatically.
5. Your existing midiman.shop domain and DNS do not need to change.

ADDING YOUR MUSIC:
1. Open the music folder in your repository.
2. Upload your .mp3 or .wav file there. Example: music/my-first-song.mp3
3. Open playlist.json in the repository and click Edit.
4. Add an entry like this (replace the example values with your own):

[
  {
    "title": "The King's Ballad",
    "artist": "MIDIMAN",
    "album": "Songs from the Keep",
    "file": "music/my-first-song.mp3",
    "duration": ""
  }
]

5. For more songs, add a comma after each closing } except the last one.
6. Commit the changes. The new track will appear after deployment.

IMPORTANT:
- The file path in playlist.json must match the uploaded filename exactly, including capitalization.
- Use relative paths such as music/song.mp3.
- Keep audio files reasonably sized. GitHub has file-size and bandwidth limits; this is best for a modest personal catalogue, not a huge commercial streaming service.
- Anyone who can listen to a public track may also be able to access/download its audio file. This site is public and has no login system.
- No music is included in this starter package. Add your own recordings.
- To add album art later, we can extend the playlist format and player.
