import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:playground/app/app.dart';
import 'package:playground/counter/counter.dart';
import 'package:playground/icons_grid/view/icons_grid_page.dart';
import 'package:playground/l10n/l10n.dart';
import 'package:playground/rainbow/view/raindow_page.dart';
import 'package:playground/stack_position/view/stack_position_page.dart';
import 'package:playground/stateless_statefull_demo/view/stateless_statefull_demo_page.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        appBarTheme: AppBarTheme(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        ),
        useMaterial3: true,
      ),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
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
      home: AppPage(
        pages: [
          AppPageModel(
            label: 'Baka',
            body: const Center(child: Text('Dummy')),
          ),
          AppPageModel(
            label: 'Counter',
            body: const CounterPage(),
          ),
          AppPageModel(
            label: 'Rainbow Showcase',
            body: const RainbowPage(),
          ),
          AppPageModel(
            label: 'Stateless Stateful Showcase',
            body: const StatelessStatefullDemoPage(),
          ),
          AppPageModel(
            label: 'Icons Grid',
            body: const IconsGridPage(),
          ),
          AppPageModel(
            label: 'Stack Position',
            body: const StackPositionPage(),
          ),
        ],
      ),
    );
  }
}
