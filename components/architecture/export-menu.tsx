"use client";

import { useState } from "react";
import { ChevronDown, Download, FileJson, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { ArchitectureResponse } from "@/types/architecture";

interface ExportMenuProps {
  architecture: ArchitectureResponse;
  onExportPng: () => Promise<void>;
  onExportPdf: () => void;
  onExportTerraform: () => void;
  onExportJson: () => void;
}

export function ExportMenu({
  architecture,
  onExportPng,
  onExportPdf,
  onExportTerraform,
  onExportJson
}: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExportPng() {
    setIsExporting(true);
    try {
      await onExportPng();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" disabled={isExporting}>
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportPng}>
          <ImageIcon className="h-4 w-4" />
          Export Diagram as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportPdf}>
          <FileText className="h-4 w-4" />
          Export Report as PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExportTerraform}>
          <FileText className="h-4 w-4" />
          Export Terraform (.tf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportJson}>
          <FileJson className="h-4 w-4" />
          Export Architecture JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
