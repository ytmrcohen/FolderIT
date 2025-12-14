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
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("בחר קובץ");
        return;
    }

    const filePath = `${Date.now()}_${file.name}`;

    // העלאה ל-Storage
    const { error: uploadError } = await supabaseClient
        .storage
        .from("Folders")
        .upload(filePath, file);

    if (uploadError) {
        console.error(uploadError);
        alert("שגיאה בהעלאת הקובץ");
        return;
    }

    // קבלת URL ציבורי
    const { data: urlData } = supabaseClient
        .storage
        .from("Folders")
        .getPublicUrl(filePath);

    // שמירה בטבלה
    const { error: insertError } = await supabaseClient
        .from("FolderD")
        .insert({
            name: file.name,
            url: urlData.publicUrl
        });

    if (insertError) {
        console.error(insertError);
        alert("שגיאה בשמירת נתוני הקובץ");
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


















