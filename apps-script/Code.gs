// Hilario sign crew photo receiver.
// Saves photos sent from hdmaps26.github.io into the route folders in Drive.
const KEY = 'hilario26';
const FOLDERS = {
  r1: '1bRZt8iZ49qBWo_ZVxm84ascHMH-2w9_r', // 1 · Lake Shore Drive
  r3: '1uUw_3luI33WaKQBoY2DewvfgTsfyZD9V', // 2 · Red Line (backup)
  r2: '1cdwxGl3n0TIgolZWPNKdGtcagUWP8US3'  // 3 · Irving–Addison (backup)
};
const ROOT = '1rqxm-jQnNBJ1Th2Ozc7wlGE2awMTZheB';

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.key !== KEY) return out({ ok: false, error: 'bad key' });
    if (!d.image || d.image.length > 8e6) return out({ ok: false, error: 'missing or too large' });
    const folder = DriveApp.getFolderById(FOLDERS[d.run] || ROOT);
    const name = String(d.name || 'sign photo').replace(/[\\/:*?"<>|]/g, '-').slice(0, 180);
    const existing = folder.getFilesByName(name);
    if (existing.hasNext()) return out({ ok: true, id: existing.next().getId(), dup: true });
    const bytes = Utilities.base64Decode(d.image.split(',').pop());
    const file = folder.createFile(Utilities.newBlob(bytes, 'image/jpeg', name));
    file.setDescription(String(d.desc || ''));
    return out({ ok: true, id: file.getId() });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}
function doGet() { return out({ ok: true, ready: true }); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
