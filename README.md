# semantica

Semantica is a browser extension and digital literacy tool to help you scrutinise and understand the media you consume better. Starting with news articles, it aims to complement the materials you read and highlight implications and suggestions beyond the literal word.

Semantica's purpose isn't to replace your own thought processes, but rather to supplement them with additional insight and perspective from a language point of view. It uses a large language model you have installed (using [Ollama](https://ollama.com)) for the analysis.

This is my first project aimed at building in public, so check out [Semantica in my digital garden](https://garden.arash.codes/works/semantica) regularly for updates! :)

## Motivation

As I've been casting a wider net of news sources to consume recently, I noticed that there were subtle differences in how media can convey a particular story. Word choices are relevant and can be critical in influencing readers' perceptions on a matter, and then popped up the challenge statement for this project:

> How might we cover our linguistic blind spots when consuming content, especially news presented as factual and reliable?

## Risks and considerations

Semantica uses local large language models that may not be as performant (accuracy-wise) to commercial models (e.g. GPT, Gemini, and Claude). These models may:

- be prone to over-scrutinising, highlighting the use of language that may, to a human, be considered neutral;
- hallucinate, as all large language models have the capability to do;
- occasionally veer off the instructions given; and
- vary widely in performance even between models of the same family (with different numbers of parameters and distillation levels, etc.).

You are cautioned to observe these models and use your own intuition when consuming and assimilating the analyses of these models.

## Getting started

> [!WARNING]
>
> The extension is still under active development, and it isn't ready at the moment, even for preliminary use. Wait a bit longer for a UI!

You will need:

- [Ollama](https://ollama.com) and a large language model of your choice installed on your system
- [Node.js](https://nodejs.org) and a package manager installed, preferably [pnpm](https://pnpm.io)

1. Clone the repository using Git or download as a ZIP file and extract:

   ```sh
   git clone https://github.com/arashnrim/semantica.git
   cd semantica
   ```

2. Install Node dependencies:

   ```sh
   pnpm install
   # or
   npm install
   ```

3. Use `wxt` to build the extension:

   ```sh
   pnpm exec wxt build -b <browser>
   # or
   npx wxt build -b <browser>
   ```

   `wxt` will then store the unpacked extension at `.output/<browser>-<manifest version>` (e.g. `.output/edge-mv3`).

4. On your browser, visit `about:extensions` (for Chromium browsers) or `about:debugging` (for Firefox-based browsers) to install the unpacked extension.
   - For Chromium browsers, select "Load unpacked" and navigate to the directory with the built extension.
   - For Firefox browsers, select "This Firefox", then "Load Temporary Add-on...". Navigate to the directory with the built extension and select any file.

## Contributing

This project is currently being actively developed, and all contributions are welcome! Feel free to create an issue to discuss anything you'd like to work on before getting started.

## License

This project is made open-source with the [MIT License](https://github.com/arashnrim/semantica/blob/main/LICENSE.md), meaning you are allowed to modify and distribute the source code as well as use it for private and commercial use, provided that the license and copyright notices are retained. For more information, visit the link above to learn what is permitted by the license.
