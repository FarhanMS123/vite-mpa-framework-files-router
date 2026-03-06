import 'package:flutter/material.dart';
import 'package:playground/app/app.dart';

class RainbowPage extends StatelessWidget {
  const RainbowPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: kThemeDarkVideoPlayer,
      // data: Theme.of(context).copyWith(),
      child: const RainbowView(),
    );
  }
}

class RainbowView extends StatelessWidget {
  const RainbowView({super.key});

  @override
  Widget build(BuildContext context) {
    return const RainbowShowcase();
  }
}
