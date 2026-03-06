import 'package:flutter/material.dart';

class StatelessStatefullDemoPage extends StatefulWidget {
  const StatelessStatefullDemoPage({super.key});

  @override
  State<StatelessStatefullDemoPage> createState() =>
      _StatelessStatefullDemoPageState();
}

class _StatelessStatefullDemoPageState
    extends State<StatelessStatefullDemoPage> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          SizedBox(
            height: 25,
          ),
          FilledButton(
            onPressed: () => setState(() {}),
            child: const Text('Update Page'),
          ),
          StatefulView(),
        ],
      ),
    );
  }
}

class StatefulView extends StatefulWidget {
  StatefulView({super.key});

  final String now = DateTime.now().toString();
  int count = 0;

  @override
  State<StatefulView> createState() {
    count += 1;
    return StateView();
  }
}

class StateView extends State<StatefulView> {
  final String now = DateTime.now().toString();
  int count = 0;

  @override
  Widget build(BuildContext context) {
    count += 1;

    return Column(
      children: [
        Text('StatefulView: ${widget.now} ${widget.count}'),
        Text('StateView: $now $count'),
        FilledButton(
          onPressed: () => setState(() {}),
          child: const Text('Update StateView'),
        ),
        StatelessView(),
      ],
    );
  }
}

class StatelessView extends StatelessWidget {
  StatelessView({super.key});

  final String now = DateTime.now().toString();
  int count = 0;

  @override
  Widget build(BuildContext context) {
    count += 1;

    return Text('StatelessView: $now $count');
  }
}
