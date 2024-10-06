# flat-project

`flat-project` is a command-line tool that generates a flat structure of your project and creates a tree view. It's useful for getting a quick overview of your project structure or for creating a simplified version of your project directory.

## Installation

You can install `flat-project` globally using npm:

```bash
npm install -g flat-project
```

## Usage

After installation, you can use `flat-project` in any directory by running:

```bash
flat-project
```

This will:
1. Create a `.flat` directory in your current project
2. Generate a `flat.txt` file inside `.flat` with a tree view of your project structure
3. Copy all non-ignored files into the `.flat` directory
4. Update your `.gitignore` to include the `.flat` directory (if a `.gitignore` file exists)

## Configuration

`flat-project` uses a `.flatignore` file to determine which files and directories to ignore. If this file doesn't exist, it will be created with default ignore patterns. You can modify this file to customize which files and directories are ignored.

Default ignore patterns include:
- `flat-project.js`
- `.git`
- `.flatignore`
- `node_modules`
- `*.log`
- `.vscode`
- `.gitignore`
- `.firebase`
- `.flat`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you find a bug or have a suggestion for improvement, please open an issue on the GitHub repository.