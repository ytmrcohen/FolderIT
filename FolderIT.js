const supabaseUrl = "https://owdtllwewggvaleevyvy.supabase.co";
const supabaseKey = "sb_publishable_nLFX-3uJT7Q7-GNvfzBtYw_iOkrWX6R";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

async function uploadFile() {
    const file = fileInput.files[0];
    if (!file) return alert("בחר קובץ");

    const path = `${Date.now()}_${file.name}`;

    const { error } = await supabaseClient.storage
        .from("Folders")
        .upload(path, file);

    if (error) return alert("שגיאה בהעלאה");

    const { data } = supabaseClient.storage
        .from("Folders")
        .getPublicUrl(path);

    await supabaseClient
        .from("FolderD")
        .insert({ name: file.name, url: data.publicUrl });

    loadFiles();
}

async function loadFiles() {
    const { data } = await supabaseClient
        .from("FolderD")
        .select("*")
        .order("id", { ascending: false });

    filesList.innerHTML = "";
    data.forEach(f => {
        filesList.innerHTML += `<p>${f.name} — <a href="${f.url}" target="_blank">פתח</a></p>`;
    });
}

async function searchFiles() {
    const text = search.value;

    const { data } = await supabaseClient
        .from("FolderD")
        .select("*")
        .ilike("name", `%${text}%`);

    filesList.innerHTML = "";
    data.forEach(f => {
        filesList.innerHTML += `<p>${f.name} — <a href="${f.url}" target="_blank">פתח</a></p>`;
    });
}

loadFiles();












