# flutter-checker

A CLI tool to check if your APK is built with Flutter or not

## Installation

```bash
~$ npm install -g flutter-checker
```

Or if you prefer using npx:

```bash
~$ npx flutter-checker -f <path-to-apk>
```

## Usage

```
Usage: flutter-checker [options]

Check if an apk is built with flutter

Options:
  -v, --version              output the current version
  -f, --filename <filename>  filename to check
  -p, --package <package>    package name to check (APK will be downloaded from playstore)
  -s, --save-apk             save the downloaded apk
  -o, --output <output>      output directory to save the apk
  -h, --help                 display help for command
```

To check if an APK is built with Flutter or not, you can use the following command:

```bash
~$ flutter-checker -f "your-apk-file.apk"
```

You can also use a "Google Play Store" link or a "package name" instead of an APK file:

```bash
~$ flutter-checker -p "https://play.google.com/store/apps/details?id=com.example.app"
```

or package name:

```bash
~$ flutter-checker -p "com.example.app"
```

## How it works

An APK file is just a zip file. So, we can unzip it and check if it contains the `libflutter.so` file or not.

## Why?

I was looking for a way to automate the process of checking if an APK is built with Flutter or not. It turns out that you just need to check if the APK contains the `libflutter.so` file. If it does, then it's built with Flutter.

## Changelog

- 1.0.1
  - Add support for Google Play Store links.
- 1.0.0
  - Initial release

## Todo

- [x] Add support for Google Play Store links (e.g. `https://play.google.com/store/apps/details?id=com.example.app`)
- [ ] Add support for IPA files
- [ ] Get list of packages used in the Flutter project
- [ ] Check list of APKs instead of one APK at a time

## Author

- [Adem Kouki](https://github.com/Ademking)

## License

MIT

## Contributing

Contributions, issues and feature requests are welcome!
