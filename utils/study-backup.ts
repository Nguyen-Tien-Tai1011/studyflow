/** Download either a workspace snapshot or the exact original recovery text. */
export function downloadStudyBackup(text: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Let the browser start the download before releasing its source.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
