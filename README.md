# Bingo

A collection of general-purpose tools for playing bingo — currently featuring a live number-draw display that shows the current ball and keeps a running history of the session. Built with React, Next.js, Tailwind CSS, and shadcn/ui.

The app runs entirely client-side (no server or database required), but is structured to support extra features on top of that foundation as more tools are added.

## Running the app

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the project
npm test        # run tests
```

## Using the app

- Type a number between 1 and 75 and submit to draw it — the ball updates with the matching B-I-N-G-O letter and color.
- Drawing the same number twice shows a warning instead of duplicating it.
- The last 10 draws are listed below the ball, most recent first.
- Click **"Mostrar todos"** to open the full history of every number drawn so far.
