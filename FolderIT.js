const supabaseUrl = "https://owdtllwewggvaleevyvy.supabase.co";
const supabaseKey = "sb_publishable_nLFX-3uJT7Q7-GNvfzBtYw_iOkrWX6R";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// חיבור לאלמנטים ב־HTML
const fileInput = document.getElementById("fileInput");
const filesList = document.getElementById("filesList");
const searchInput = document.getElementById("search");

// העלאת קובץ
async function uploadFile() {
  const file = fileInput.files[0];
  if (!file) {
    alert("בחר קובץ");
    return;
  }

  const filePath = `${Date.now()}_${file.name}`;

  // 1. העלאה ל־Storage
  const { error: uploadError } = await supabase.storage
    .from("Folders")
    .upload(filePath, file, {
      contentType: file.type
    });

  if (uploadError) {
    console.error(uploadError);
    alert("שגיאה בהעלאה ל-Storage");
    return;
  }

  // 2. קבלת URL ציבורי
  const { data } = supabase.storage
    .from("Folders")
    .getPublicUrl(filePath);

  // 3. שמירה בטבלה
  const { error: insertError } = await supabase
    .from("FolderD")
    .insert({
      name: file.name,
      url: data.publicUrl
    });

  if (insertError) {
    console.error(insertError);
    alert("שגיאה בשמירת הנתונים בטבלה");
    return;
  }

  // 4. רענון הרשימה
  loadFiles();
}

// טעינת קבצים מהטבלה
async function loadFiles() {
  const { data, error } = await supabase
    .from("FolderD")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    filesList.innerHTML = "שגיאה בטעינת קבצים";
    return;
  }

  filesList.innerHTML = "";

  if (data.length === 0) {
    filesList.innerHTML = "אין קבצים";
    return;
  }

  data.forEach(file => {
    const p = document.createElement("p");
    p.innerHTML = `
      ${file.name} —
      <a href="${file.url}" target="_blank">פתח</a>
    `;
    filesList.appendChild(p);
  });
}

// חיפוש
async function searchFiles() {
  const text = searchInput.value;

  const { data, error } = await supabase
    .from("FolderD")
    .select("*")
    .ilike("name", `%${text}%`);

  if (error) {
    console.error(error);
    return;
  }

  filesList.innerHTML = "";

  data.forEach(file => {
    filesList.innerHTML += `
      <p>${file.name} —
      <a href="${file.url}" target="_blank">פתח</a></p>
    `;
  });
}

// טעינה אוטומטית כשהדף עולה
loadFiles();














