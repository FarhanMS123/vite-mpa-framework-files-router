import 'package:flutter/material.dart';

class StackPositionPage extends StatelessWidget {
  const StackPositionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: FilledButton(
            onPressed: () {},
            child: const Text('Filled'),
          ),
        ),
      ],
    );
  }
}
