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

  Future<void> _deleteId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      ids.remove(id);
      prefs.setStringList('scanned_ids', ids);
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
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () {
                            _confirmDelete(context, id);
                          },
                        ),
                        Icon(Icons.chevron_right),
                      ],
                    ),
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

  void _confirmDelete(BuildContext context, String id) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: Text("Delete Device ID"),
            content: Text("Are you sure you want to delete this ID?"),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text("Cancel"),
              ),
              TextButton(
                onPressed: () {
                  _deleteId(id);
                  Navigator.of(context).pop();
                },
                child: Text("Delete", style: TextStyle(color: Colors.red)),
              ),
            ],
          ),
    );
  }
}
