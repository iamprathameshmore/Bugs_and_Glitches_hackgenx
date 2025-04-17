import 'package:app/readings_details.dart';
import 'package:app/store_devices.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner_plus/qr_code_scanner_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

class QRScannerPage extends StatefulWidget {
  const QRScannerPage({super.key});

  @override
  State<QRScannerPage> createState() => _QRScannerPageState();
}

class _QRScannerPageState extends State<QRScannerPage> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  bool scanned = false;
  bool isLoading = false;

  @override
  void reassemble() {
    super.reassemble();
    controller?.pauseCamera();
    controller?.resumeCamera();
  }

  void _onQRViewCreated(QRViewController ctrl) {
    controller = ctrl;
    controller!.scannedDataStream.listen((scanData) async {
      if (!scanned) {
        scanned = true;
        controller?.pauseCamera();

        String? rawData = scanData.code;

        if (rawData == null || rawData.isEmpty) {
          _showSnackBar("⚠️ Invalid QR Code. Retrying...");
          _retryScan();
          return;
        }

        String id = _extractId(rawData);
        await _storeId(id);
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ReadingDetailsPage(deviceId: id),
          ),
        );
      }
    });
  }

  String _extractId(String data) {
    if (!data.contains('/')) return data;
    Uri? uri = Uri.tryParse(data);
    return uri?.pathSegments.last ?? data;
  }

  Future<void> _storeId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final ids = prefs.getStringList('scanned_ids') ?? [];

    if (!ids.contains(id)) {
      ids.add(id);
      await prefs.setStringList('scanned_ids', ids);
    }
  }

  void _retryScan() {
    Future.delayed(Duration(seconds: 2), () {
      if (!mounted) return;
      scanned = false;
      controller?.resumeCamera();
    });
  }

  void _showSnackBar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), duration: Duration(seconds: 2)),
    );
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Scan QR"),
        actions: [
          IconButton(
            icon: Icon(Icons.list),
            tooltip: "View Scanned IDs",
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => StoredIDsPage()),
              );
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          QRView(key: qrKey, onQRViewCreated: _onQRViewCreated),
          Align(
            alignment: Alignment.topCenter,
            child: Container(
              margin: EdgeInsets.only(top: 20),
              padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.black12,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                "Align the QR code within the frame",
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
            ),
          ),
          Align(
            alignment: Alignment.center,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white, width: 2),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
          if (isLoading)
            Container(
              color: Colors.black.withOpacity(0.5),
              child: Center(
                child: CircularProgressIndicator(color: Colors.white),
              ),
            ),
        ],
      ),
    );
  }
}
