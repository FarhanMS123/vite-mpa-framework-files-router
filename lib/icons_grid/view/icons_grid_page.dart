import 'package:flutter/material.dart';
import 'package:playground/icons_grid/icons_grid.dart';

class IconsGridPage extends StatelessWidget {
  const IconsGridPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const IconsGridView();
  }
}

class IconsGridView extends StatefulWidget {
  const IconsGridView({
    super.key,
  });

  @override
  State<IconsGridView> createState() => _IconsGridViewState();
}

class _IconsGridViewState extends State<IconsGridView> {
  String selectedType = 'other';

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            iconType('other'),
            iconType('_sharp'),
            iconType('_rounded'),
            iconType('_outlined'),
          ],
        ),
        Expanded(
          child: GridView.count(
            crossAxisCount: 12,
            children: [
              for (final icon in kIcons)
                if (icon.$1.endsWith(selectedType) ||
                    (selectedType == 'other' &&
                        !(icon.$1.endsWith('_sharp') ||
                            icon.$1.endsWith('_rounded') ||
                            icon.$1.endsWith('_outlined'))))
                  Column(
                    children: [
                      Icon(
                        icon.$2,
                        size: 64,
                      ),
                      Text(icon.$1),
                    ],
                  ),
            ],
          ),
        ),
      ],
    );
  }

  ChoiceChip iconType(String label) {
    return ChoiceChip(
      label: Text(label),
      selected: selectedType == label,
      onSelected: (value) => setState(() {
        selectedType = label;
      }),
    );
  }
}
