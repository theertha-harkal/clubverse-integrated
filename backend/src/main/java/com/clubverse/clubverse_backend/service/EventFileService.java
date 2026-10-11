package com.clubverse.clubverse_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class EventFileService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String uploadPoster(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/jpeg") ||
                  contentType.equals("image/png") ||
                  contentType.equals("image/webp"))) {
            throw new IllegalArgumentException(
                    "Only JPEG, PNG, and WEBP images are allowed");
        }

        String originalName = file.getOriginalFilename();
        String extension = originalName != null &&
                originalName.lastIndexOf('.') >= 0
                ? originalName.substring(originalName.lastIndexOf('.'))
                : "";

        String filename = UUID.randomUUID() + extension;
        Path directory = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(directory);

        Path destination = directory.resolve(filename).normalize();
        if (!destination.startsWith(directory)) {
            throw new IllegalArgumentException("Invalid filename");
        }

        Files.copy(file.getInputStream(), destination,
                StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + filename;
    }
}
