# Variables
VERSION ?= $(shell git describe --tags --always --dirty)
BINARY_NAME=noStrudel
BUILD_DIR=bin
RESOURCES_DIR=resources

# Build flags
LDFLAGS=-ldflags="-X 'main.Version=${VERSION}'"

# Windows resource file (create this at build time)
WINDOWS_SYSO=${BUILD_DIR}/windows_amd64.syso

# Ensure builds directory exists
$(shell mkdir -p ${BUILD_DIR})

.PHONY: all clean windows linux darwin windows-syso

all: copy windows linux darwin

# Build source
copy: source
	cp -r ../dist/* web

source:
	cd ../ && \
	pnpm install && \
	VITE_COMMIT_HASH=$(shell git rev-parse --short HEAD) \
	VITE_APP_VERSION=$(shell jq -r .version ../package.json) \
	pnpm build

# Generate Windows resource file with icon
windows-syso:
	go install github.com/akavel/rsrc@latest
	rsrc -ico ${RESOURCES_DIR}/icon.ico -o ${WINDOWS_SYSO}

# Windows builds
windows: windows-syso windows-amd64 windows-arm64

windows-amd64:
	GOOS=windows GOARCH=amd64 go build ${LDFLAGS} -o ${BUILD_DIR}/${BINARY_NAME}-windows-amd64.exe

windows-arm64:
	GOOS=windows GOARCH=arm64 go build ${LDFLAGS} -o ${BUILD_DIR}/${BINARY_NAME}-windows-arm64.exe

# Linux builds
linux: linux-amd64 linux-arm64

linux-amd64:
	GOOS=linux GOARCH=amd64 go build ${LDFLAGS} -o ${BUILD_DIR}/${BINARY_NAME}-linux-amd64

linux-arm64:
	GOOS=linux GOARCH=arm64 go build ${LDFLAGS} -o ${BUILD_DIR}/${BINARY_NAME}-linux-arm64

# macOS builds
darwin: darwin-amd64 darwin-arm64

darwin-amd64:
	GOOS=darwin GOARCH=amd64 go build ${LDFLAGS} -o ${BUILD_DIR}/${BINARY_NAME}-darwin-amd64
	# Create macOS app bundle for amd64
	mkdir -p ${BUILD_DIR}/${BINARY_NAME}-darwin-amd64.app/Contents/MacOS
	mkdir -p ${BUILD_DIR}/${BINARY_NAME}-darwin-amd64.app/Contents/Resources
	cp ${BUILD_DIR}/${BINARY_NAME}-darwin-amd64 ${BUILD_DIR}/${BINARY_NAME}-darwin-amd64.app/Contents/MacOS/${BINARY_NAME}
	cp ${RESOURCES_DIR}/icon.icns ${BUILD_DIR}/${BINARY_NAME}-darwin-amd64.app/Contents/Resources/
	cp Info.plist ${BUILD_DIR}/${BINARY_NAME}-darwin-amd64.app/Contents/

darwin-arm64:
	GOOS=darwin GOARCH=arm64 go build ${LDFLAGS} -o ${BUILD_DIR}/${BINARY_NAME}-darwin-arm64
	# Create macOS app bundle for arm64
	mkdir -p ${BUILD_DIR}/${BINARY_NAME}-darwin-arm64.app/Contents/MacOS
	mkdir -p ${BUILD_DIR}/${BINARY_NAME}-darwin-arm64.app/Contents/Resources
	cp ${BUILD_DIR}/${BINARY_NAME}-darwin-arm64 ${BUILD_DIR}/${BINARY_NAME}-darwin-arm64.app/Contents/MacOS/${BINARY_NAME}
	cp ${RESOURCES_DIR}/icon.icns ${BUILD_DIR}/${BINARY_NAME}-darwin-arm64.app/Contents/Resources/
	cp Info.plist ${BUILD_DIR}/${BINARY_NAME}-darwin-arm64.app/Contents/

# Clean build directory
clean:
	rm -rf ${BUILD_DIR}/*
