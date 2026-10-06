"use client";
import { Download } from "lucide-react";
import { useStudy } from "./study-provider";

export function ExportStudyData() {
  const { ready, exportBackup } = useStudy();
  return (
    <button
      type="button"
      className="text-button"
      disabled={!ready}
      onClick={exportBackup}
    >
      <Download size={15} /> Export study data
    </button>
  );
}

export function StorageNotice() {
  const { storageStatus, exportOriginal, exportBackup } = useStudy();
  if (storageStatus !== "invalid" && storageStatus !== "unavailable")
    return null;
  const invalid = storageStatus === "invalid";
  return (
    <aside className="storage-notice" aria-label="Study data recovery">
      <p role="status">
        {invalid
          ? "Your saved data could not be opened. The original is preserved; this temporary workspace will not overwrite it."
          : "Your browser could not save your study data."}{" "}
        Changes in this visit are temporary. Download a backup before closing
        this page.
      </p>
      <div>
        {invalid && (
          <button
            type="button"
            className="button secondary"
            onClick={exportOriginal}
          >
            Download original data
          </button>
        )}
        <button
          type="button"
          className="button secondary"
          onClick={exportBackup}
        >
          Export current workspace
        </button>
      </div>
    </aside>
  );
}
