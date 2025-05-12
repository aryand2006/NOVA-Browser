# Contributing to NOVA Browser

Thank you for your interest in contributing to NOVA Browser! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Bug reports help us improve NOVA Browser. To report a bug, create an issue using the bug report template and include:

1. A clear, descriptive title
2. Detailed steps to reproduce the issue
3. Expected behavior vs. actual behavior
4. Screenshots if applicable
5. System information (OS, browser version, etc.)

### Suggesting Features

We love new ideas! To suggest a feature:

1. Check existing issues to see if your idea has been suggested
2. Create a new issue using the feature request template
3. Describe the feature in detail and explain its benefits
4. Provide examples of how it would be used

### Pull Requests

We welcome code contributions! Here's how to submit a pull request:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a pull request

## Development Setup

### For JavaScript Implementation

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/yourusername/nova-browser.git
cd nova-browser

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm start
```

### For C++ Implementation

To compile and run the NOVA Browser C++ implementation:

```bash
# Navigate to the project directory
cd /Users/aryandaga/Downloads/VSC/LearningShit/BrowserByAryan

# Compile the code with g++
g++ main.cpp -o nova -std=c++17

# Run the compiled binary
./nova
```

## Building a GUI Version

To create an actual browser with a graphical user interface rather than just a console simulation, additional libraries and components are needed:

```bash
# For building with a Chromium Embedded Framework (CEF)
git clone https://github.com/chromiumembedded/cef.git
cd cef

# Build CEF (see CEF documentation for detailed instructions)
# This process is complex and varies by platform

# Then compile your NOVA browser with CEF integration
g++ main.cpp gui_integration.cpp -o nova_gui -std=c++17 -I/path/to/cef/include `pkg-config --cflags --libs gtk+-3.0` -lcef
```

Alternatively, you can use Qt for a cross-platform UI:

```bash
# Using Qt for the GUI layer
qmake nova_browser.pro
make
./nova_browser
```

For development with more advanced features:
```bash
# Compile with debugging information
g++ main.cpp -o nova -std=c++17 -g -Wall -Wextra

# Use clang++ instead of g++ (often has better error messages)
clang++ main.cpp -o nova -std=c++17 -g -Wall -Wextra
```

## Coding Standards

### C++ Style Guide

- Use 4 spaces for indentation
- Follow the [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

## Testing

Before submitting a pull request, run all tests:

```bash
npm test
```

Add tests for new features to ensure they work as expected and to prevent regressions.

## Documentation

Update documentation when changing functionality. This includes:

- README.md
- Code comments
- Wiki pages (if applicable)
- API documentation

## Review Process

All submissions require review. We use GitHub pull requests for this purpose:

1. A maintainer will review your code for quality and conformity
2. You may receive feedback requesting changes
3. Once approved, a maintainer will merge your contribution

## Recognition

All contributors are recognized in our [CONTRIBUTORS.md](CONTRIBUTORS.md) file. 

## Questions?

If you have questions, feel free to create an issue labeled "question" or contact the project maintainers directly.

Thank you for contributing to NOVA Browser!
