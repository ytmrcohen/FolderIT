// ==========================
// Supabase config
// ==========================
const supabaseUrl = "https://owdtllwewggvaleevyvy.supabase.co";
const supabaseKey = "sb_publishable_nLFX-3uJT7Q7-GNvfzBtYw_iOkrWX6R";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// ==========================
// Upload file
// ==========================

function safeFileName(originalName) {
    const ext = originalName.split('.').pop();
    return `${Date.now()}_${crypto.randomUUID()}.${ext}`;
}

async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("בחר קובץ");
        return;
    }

    // שם בטוח ל־Storage (אנגלית בלבד)
    const storagePath = safeFileName(file.name);

    // העלאה ל־Storage
    const { error: uploadError } = await supabaseClient
        .storage
        .from("Folders")
        .upload(storagePath, file);

    if (uploadError) {
        console.error(uploadError);
        alert("שגיאה בהעלאה");
        return;
    }

    // URL ציבורי
    const { data: urlData } = supabaseClient
        .storage
        .from("Folders")
        .getPublicUrl(storagePath);

    // שמירה בטבלה — השם המקורי בעברית
    const { error: insertError } = await supabaseClient
        .from("FolderD")
        .insert({
            name: file.name,          // עברית ✔
            url: urlData.publicUrl    // Storage ✔
        });

    if (insertError) {
        console.error(insertError);
        alert("שגיאה בשמירת הנתונים");
        return;
    }

    fileInput.value = "";
    loadFiles();
}


// ==========================
// Load files list
// ==========================
async function loadFiles() {
    const filesList = document.getElementById("filesList");

    const { data, error } = await supabaseClient
        .from("FolderD")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        filesList.innerHTML = "שגיאה בטעינת קבצים";
        return;
    }

    if (!data.length) {
        filesList.innerHTML = "אין קבצים";
        return;
    }

    filesList.innerHTML = "";

    data.forEach(file => {
        const date = new Date(file.created_at).toLocaleString("he-IL");

        filesList.innerHTML += `
            <div style="margin-bottom:10px;">
                <strong>${file.name}</strong><br>
                <small>הועלה בתאריך: ${date}</small><br>
                <a href="${file.url}" target="_blank">פתח</a>
                —
                <button onclick="deleteFile(${file.id}, '${file.url}')">
                    מחק
                </button>
            </div>
        `;
    });
}


// ==========================
// Search files
// ==========================
async function searchFiles() {
    const searchInput = document.getElementById("search");
    const filesList = document.getElementById("filesList");
    const text = searchInput.value.trim();

    const { data, error } = await supabaseClient
        .from("FolderD")
        .select("*")
        .ilike("name", `%${text}%`)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        filesList.innerHTML = "שגיאה בחיפוש";
        return;
    }

    filesList.innerHTML = "";

    data.forEach(file => {
        const date = file.created_at
            ? new Date(file.created_at).toLocaleString("he-IL")
            : "לא זמין";

        filesList.innerHTML += `
            <p>
                <strong>${file.name}</strong><br>
                <small>הועלה בתאריך: ${date}</small><br>
                <a href="${file.url}" target="_blank">פתח</a>
                —
                <button onclick="deleteFile(${file.id}, '${file.url}')">
                    מחק
                </button>
            </p>
        `;
    });
}

// ==========================
// Delete file (Storage + Table)
// ==========================
async function deleteFile(id, fileUrl) {
    if (!confirm("האם למחוק את הקובץ?")) return;

    const path = fileUrl.split("/Folders/")[1];

    // מחיקה מה-Storage
    const { error: storageError } = await supabaseClient
        .storage
        .from("Folders")
        .remove([path]);

    if (storageError) {
        console.error(storageError);
        alert("שגיאה במחיקת הקובץ מהאחסון");
        return;
    }

    // מחיקה מהטבלה
    const { error: dbError } = await supabaseClient
        .from("FolderD")
        .delete()
        .eq("id", id);

    if (dbError) {
        console.error(dbError);
        alert("שגיאה במחיקת הרשומה");
        return;
    }

    loadFiles();
}

// ==========================
// Initial load
// ==========================
loadFiles();



















