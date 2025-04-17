import 'package:app/readings_details.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StoredIDsPage extends StatefulWidget {
  const StoredIDsPage({super.key});

  @override
  _StoredIDsPageState createState() => _StoredIDsPageState();
}

class _StoredIDsPageState extends State<StoredIDsPage> {
  List<String> ids = [];

  @override
  void initState() {
    super.initState();
    _loadIds();
  }

  Future<void> _loadIds() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      ids = prefs.getStringList('scanned_ids') ?? [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Scanned Device IDs")),
      body:
          ids.isEmpty
              ? Center(child: Text("No IDs scanned yet."))
              : ListView.builder(
                itemCount: ids.length,
                itemBuilder: (context, index) {
                  final id = ids[index];
                  return ListTile(
                    title: Text("Device ID: $id"),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ReadingDetailsPage(deviceId: id),
                        ),
                      );
                    },
                  );
                },
              ),
    );
  }
}
