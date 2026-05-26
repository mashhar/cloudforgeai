"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileJson, FileCode, Image } from "lucide-react";
import type { UploadedFile } from "@/lib/review-schema";

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  files: UploadedFile[];
}

export function FileUpload({ onFilesChange, files }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const processFile = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      const fileName = file.name.toLowerCase();

      // Determine file type
      let fileType: UploadedFile["type"];
      if (fileName.endsWith(".json")) {
        fileType = "json";
      } else if (fileName.endsWith(".tf") || fileName.endsWith(".hcl")) {
        fileType = "terraform";
      } else if (
        file.type.startsWith("image/") ||
        fileName.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)
      ) {
        // Check if it's likely a diagram or screenshot based on name
        if (
          fileName.includes("diagram") ||
          fileName.includes("architecture")
        ) {
          fileType = "diagram";
        } else {
          fileType = "screenshot";
        }
      } else {
        return null; // Unsupported file type
      }

      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target?.result as string;

          if (fileType === "json" || fileType === "terraform") {
            resolve({
              type: fileType,
              name: file.name,
              content,
              mimeType: file.type,
            });
          } else {
            // For images, store as base64
            resolve({
              type: fileType,
              name: file.name,
              content: content.split(",")[1] || content, // Remove data:image/... prefix
              mimeType: file.type,
            });
          }
        };

        reader.onerror = () => resolve(null);

        if (fileType === "json" || fileType === "terraform") {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }
      });
    },
    []
  );

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const fileArray = Array.from(fileList);
      const processedFiles: UploadedFile[] = [];

      for (const file of fileArray) {
        const processed = await processFile(file);
        if (processed) {
          processedFiles.push(processed);
        }
      }

      if (processedFiles.length > 0) {
        onFilesChange([...files, ...processedFiles]);
      }
    },
    [files, onFilesChange, processFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange]
  );

  const getFileIcon = (type: UploadedFile["type"]) => {
    switch (type) {
      case "json":
        return <FileJson className="h-5 w-5" />;
      case "terraform":
        return <FileCode className="h-5 w-5" />;
      case "screenshot":
      case "diagram":
        return <Image className="h-5 w-5" />;
    }
  };

  const getFileTypeLabel = (type: UploadedFile["type"]) => {
    switch (type) {
      case "json":
        return "JSON";
      case "terraform":
        return "Terraform";
      case "screenshot":
        return "Screenshot";
      case "diagram":
        return "Diagram";
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          multiple
          accept=".json,.tf,.hcl,image/*"
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <label
              htmlFor="file-upload"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Click to upload
            </label>{" "}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            JSON, Terraform (.tf), Screenshots, or Diagram images
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-gray-600 dark:text-gray-400">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {getFileTypeLabel(file.type)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
