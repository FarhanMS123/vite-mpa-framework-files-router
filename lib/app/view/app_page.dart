import 'package:flutter/material.dart';
import 'package:playground/app/app.dart';

class AppPage extends StatefulWidget {
  const AppPage({required this.pages, super.key});

  final List<AppPageModel> pages;

  @override
  State<AppPage> createState() => _AppPageState();
}

class _AppPageState extends State<AppPage> {
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();

  int screenIndex = 0;
  late List<Widget> _destinations;

  @override
  void initState() {
    super.initState();
    _destinations = [
      const Padding(padding: .only(top: 10)),
      ...widget.pages.map(
        (page) => NavigationDrawerDestination(
          icon: const Icon(Icons.description_outlined),
          selectedIcon: const Icon(Icons.description_rounded),
          label: Text(page.label),
        ),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      drawer: NavigationDrawer(
        onDestinationSelected: (i) => setState(() => screenIndex = i),
        selectedIndex: screenIndex,
        children: _destinations,
      ),
      floatingActionButton: FloatingActionButton.small(
        onPressed: () {
          scaffoldKey.currentState!.openDrawer();
        },
        shape: const CircleBorder(),
        child: const Icon(Icons.last_page_rounded),
      ),
      floatingActionButtonLocation: .startFloat,
      body: widget.pages[screenIndex].body,
    );
  }
}
