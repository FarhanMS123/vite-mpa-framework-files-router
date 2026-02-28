import 'package:playground/app/app.dart';
import 'package:playground/bootstrap.dart';

Future<void> main() async {
  await bootstrap(() => const App());
}
