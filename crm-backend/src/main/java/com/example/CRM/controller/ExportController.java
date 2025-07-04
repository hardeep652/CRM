package com.example.CRM.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    @PostMapping(value = "/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generatePdf(@RequestBody Map<String, String> request) throws IOException, InterruptedException {
        String latexContent = request.get("latex");
        if (latexContent == null || latexContent.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Create temporary files
        File tempDir = new File(System.getProperty("java.io.tmpdir"));
        File texFile = new File(tempDir, "report.tex");
        File pdfFile = new File(tempDir, "report.pdf");

        // Write LaTeX content to file
        try (FileOutputStream fos = new FileOutputStream(texFile)) {
            fos.write(latexContent.getBytes());
        }

        // Run latexmk to compile LaTeX to PDF
        ProcessBuilder pb = new ProcessBuilder("latexmk", "-pdf", "-interaction=nonstopmode", texFile.getAbsolutePath());
        pb.directory(tempDir);
        Process process = pb.start();
        int exitCode = process.waitFor();

        if (exitCode != 0 || !pdfFile.exists()) {
            throw new IOException("Failed to compile LaTeX to PDF");
        }

        // Read the PDF file
        byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());

        // Clean up temporary files
        texFile.delete();
        pdfFile.delete();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=crm_dashboard_report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}