import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

final ThemeData kThemeDarkVideoPlayer =
    ThemeData.dark(
      useMaterial3: true,
    ).copyWith(
      colorScheme: .fromSeed(
        brightness: .dark,
        seedColor: Colors.black,
        primary: Colors.white,
        onSurface: Colors.white,
        onSurfaceVariant: Colors.white,
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: Colors.white,
        ),
      ),
      iconTheme: const IconThemeData(color: Colors.white),
    );

class RainbowShowcaseView extends StatelessWidget {
  const RainbowShowcaseView({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      themeMode: .dark,
      darkTheme: kThemeDarkVideoPlayer,
      debugShowCheckedModeBanner: false,
      scrollBehavior: const MaterialScrollBehavior().copyWith(
        dragDevices: {
          PointerDeviceKind.mouse,
          PointerDeviceKind.touch,
          PointerDeviceKind.stylus,
          PointerDeviceKind.unknown,
          PointerDeviceKind.trackpad,
        },
      ),
      home: const Material(
        type: .transparency,
        child: RainbowShowcase(),
      ),
    );
  }
}

class RainbowShowcase extends StatelessWidget {
  const RainbowShowcase({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    final Map<String, Color> colorDictionary = {
      'primary': colorScheme.primary,
      'onPrimary': colorScheme.onPrimary,
      'primaryContainer': colorScheme.primaryContainer,
      'onPrimaryContainer': colorScheme.onPrimaryContainer,
      'primaryFixed': colorScheme.primaryFixed,
      'primaryFixedDim': colorScheme.primaryFixedDim,
      'onPrimaryFixed': colorScheme.onPrimaryFixed,
      'onPrimaryFixedVariant': colorScheme.onPrimaryFixedVariant,
      'secondary': colorScheme.secondary,
      'onSecondary': colorScheme.onSecondary,
      'secondaryContainer': colorScheme.secondaryContainer,
      'onSecondaryContainer': colorScheme.onSecondaryContainer,
      'secondaryFixed': colorScheme.secondaryFixed,
      'secondaryFixedDim': colorScheme.secondaryFixedDim,
      'onSecondaryFixed': colorScheme.onSecondaryFixed,
      'onSecondaryFixedVariant': colorScheme.onSecondaryFixedVariant,
      'tertiary': colorScheme.tertiary,
      'onTertiary': colorScheme.onTertiary,
      'tertiaryContainer': colorScheme.tertiaryContainer,
      'onTertiaryContainer': colorScheme.onTertiaryContainer,
      'tertiaryFixed': colorScheme.tertiaryFixed,
      'tertiaryFixedDim': colorScheme.tertiaryFixedDim,
      'onTertiaryFixed': colorScheme.onTertiaryFixed,
      'onTertiaryFixedVariant': colorScheme.onTertiaryFixedVariant,
      'error': colorScheme.error,
      'onError': colorScheme.onError,
      'errorContainer': colorScheme.errorContainer,
      'onErrorContainer': colorScheme.onErrorContainer,
      'surface': colorScheme.surface,
      'onSurface': colorScheme.onSurface,
      'surfaceDim': colorScheme.surfaceDim,
      'surfaceBright': colorScheme.surfaceBright,
      'surfaceContainerLowest': colorScheme.surfaceContainerLowest,
      'surfaceContainerLow': colorScheme.surfaceContainerLow,
      'surfaceContainer': colorScheme.surfaceContainer,
      'surfaceContainerHigh': colorScheme.surfaceContainerHigh,
      'surfaceContainerHighest': colorScheme.surfaceContainerHighest,
      'onSurfaceVariant': colorScheme.onSurfaceVariant,
      'outline': colorScheme.outline,
      'outlineVariant': colorScheme.outlineVariant,
      'inverseSurface': colorScheme.inverseSurface,
      'onInverseSurface': colorScheme.onInverseSurface,
      'inversePrimary': colorScheme.inversePrimary,
      'surfaceTint': colorScheme.surfaceTint,
      'background': colorScheme.background,
      'onBackground': colorScheme.onBackground,
      'surfaceVariant': colorScheme.surfaceVariant,
    };

    final List<String> colorKeys = colorDictionary.keys.toList();

    return ListView.builder(
      itemCount: colorKeys.length,
      itemBuilder: (context, index) {
        final String key = colorKeys[index];
        final Color backgroundColor = colorDictionary[key]!;

        final Color textColor = backgroundColor.computeLuminance() > 0.5
            ? Colors.black
            : Colors.white;

        return Container(
          height: 100,
          width: double.infinity,
          color: backgroundColor,
          child: Center(
            child: Text(
              key,
              style: TextStyle(
                color: textColor,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        );
      },
    );
  }
}
