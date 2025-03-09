#!/bin/bash

set -e

BASE_URL="https://github.com/mistweaverco/kimbia/releases/download/latest"

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
    Linux)
        case "$ARCH" in
            x86_64) FILE="kimbia-linux-x64" ;;
            aarch64) FILE="kimbia-linux-arm64" ;;
            *) echo "Unsupported architecture: $ARCH" && exit 1 ;;
        esac
        DEST="$HOME/bin"
        FINAL_NAME="kimbia"
        ;;
    Darwin)
        case "$ARCH" in
            x86_64) FILE="kimbia-macos-x64" ;;
            arm64) FILE="kimbia-macos-arm64" ;;
            *) echo "Unsupported architecture: $ARCH" && exit 1 ;;
        esac
        DEST="$HOME/bin"
        FINAL_NAME="kimbia"
        ;;
    CYGWIN*|MINGW*|MSYS*)
        FILE="kimbia-x64.exe"
        DEST="$HOME/.local/bin"
        FINAL_NAME="kimbia.exe"
        ;;
    *)
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac

# Ensure destination directory exists
mkdir -p "$DEST"

DOWNLOAD_URL="$BASE_URL/$FILE"

# Download the file
echo "Downloading $DOWNLOAD_URL..."
curl -L -o "$DEST/$FINAL_NAME" "$DOWNLOAD_URL" || wget -O "$DEST/$FINAL_NAME" "$DOWNLOAD_URL"

# Make executable if not Windows
if [[ "$FINAL_NAME" != *".exe" ]]; then
    chmod +x "$DEST/$FINAL_NAME"
    echo "Installation complete. The binary is located in $DEST/$FINAL_NAME."
else
    echo "Download complete. The binary is located in $DEST/$FINAL_NAME."
fi

# Check if $DEST is in PATH
if ! echo "$PATH" | grep -q "$DEST"; then
    echo "Warning: $DEST is not in your PATH. Consider adding it to your shell profile."
    echo "You can do this by adding the following line to your ~/.bashrc or ~/.zshrc:"
    echo "export PATH=\"$DEST:\$PATH\""
fi
