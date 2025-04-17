import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ReadingDetailsPage extends StatefulWidget {
  final String deviceId;

  const ReadingDetailsPage({super.key, required this.deviceId});

  @override
  State<ReadingDetailsPage> createState() => _ReadingDetailsPageState();
}

class _ReadingDetailsPageState extends State<ReadingDetailsPage> {
  List<dynamic> readings = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchReadings();
  }

  Future<void> _fetchReadings() async {
    setState(() => isLoading = true);

    try {
      final response = await http.get(
        Uri.parse(
          'https://bugs-and-glitches-hackgenx.onrender.com/api/readings/${widget.deviceId}',
        ),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          readings = data['readings'];
        });
      } else {
        _showSnackBar("❌ Failed: ${response.statusCode}");
      }
    } catch (e) {
      _showSnackBar("⚠️ Error: $e");
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _showSnackBar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Device Readings")),
      body:
          isLoading
              ? Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                onRefresh: _fetchReadings,
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: readings.length,
                  itemBuilder: (context, index) {
                    final reading = readings[index];
                    return Card(
                      elevation: 4,
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        title: Text("🌡️ Temp: ${reading['temperature']}°C"),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("💧 Humidity: ${reading['humidity']}%"),
                            Text("🌫️ Air Quality: ${reading['airQuality']}"),
                            Text("🕒 Time: ${reading['timestamp']}"),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
    );
  }
}
