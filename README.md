# flutter-checker

A CLI tool to check if your APK is built with Flutter or not

## Installation

```bash
npm install -g flutter-checker
```

Or if you prefer using npx:

```bash
npx flutter-checker -f <path-to-apk>
```

## Usage

```bash
flutter-checker -f <path-to-apk>
```

## Why?

I was looking for a way to automate the process of checking if an APK is built with Flutter or not. It turns out that you just need to check if the APK contains the `libflutter.so` file. If it does, then it's built with Flutter.

## Todo

- [ ] Add support for AAB / IPA files
- [ ] Add support for Google Play Store links (e.g. `https://play.google.com/store/apps/details?id=com.example.app`)
- [ ] Get list of packages used in the Flutter project

## Author

- [Adem Kouki](https://github.com/Ademking)

## License

MIT

## Contributing

Contributions, issues and feature requests are welcome!
