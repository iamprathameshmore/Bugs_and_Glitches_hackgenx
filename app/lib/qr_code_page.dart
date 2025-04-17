import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner_plus/qr_code_scanner_plus.dart';
import 'package:http/http.dart' as http;

class QRScannerPage extends StatefulWidget {
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
        await _callApi(id);
      }
    });
  }

  String _extractId(String data) {
    if (!data.contains('/')) return data;
    Uri? uri = Uri.tryParse(data);
    return uri?.pathSegments.last ?? data;
  }

  Future<void> _callApi(String id) async {
    setState(() => isLoading = true);

    try {
      final response = await http.post(
        Uri.parse(
          'https://bugs-and-glitches-hackgenx.onrender.com/api/readings/$id',
        ),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'id': id}),
      );

      final message =
          response.statusCode == 200
              ? "✅ Success: ${jsonDecode(response.body)['message']}"
              : "❌ Failed: ${response.statusCode}";

      _showSnackBar(message);
    } catch (e) {
      _showSnackBar("⚠️ Error: $e");
    } finally {
      setState(() => isLoading = false);
      _retryScan();
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
      appBar: AppBar(title: Text("Scan QR")),
      body: Stack(
        children: [
          QRView(key: qrKey, onQRViewCreated: _onQRViewCreated),
          Align(
            alignment: Alignment.topCenter,
            child: Container(
              margin: EdgeInsets.only(top: 20),
              padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.5),
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
