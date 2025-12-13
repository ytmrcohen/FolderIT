const supabaseUrl = "https://owdtllwewggvaleevyvy.supabase.co";
const supabaseKey = "PASTE_YOUR_PUBLIC_KEY_HERE";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

const overlay = document.getElementById("overlay");
const signUpBox = document.getElementById("signUpBox");
const logInBox = document.getElementById("logInBox");
const signLogSave = document.getElementById("signLogSave");

let userPassword = "";

// פתיחת חלונות
showBoxSign.onclick = () => {
    overlay.style.display = "flex";
    signUpBox.style.display = "flex";
};

showBoxLog.onclick = () => {
    overlay.style.display = "flex";
    logInBox.style.display = "flex";
};

saveButtonSign.onclick = () => {
    userPassword = passwordInputSign.value.trim();
    overlay.style.display = "none";
    signUpBox.style.display = "none";
    signLogSave.textContent = "נרשמת בהצלחה";
    signLogSave.style.display = "block";
};

saveButtonLog.onclick = () => {
    overlay.style.display = "none";
    logInBox.style.display = "none";

    if (passwordInputLog.value === userPassword) {
        signLogSave.textContent = "התחברת בהצלחה";
    } else {
        signLogSave.textContent = "סיסמה שגויה";
    }
    signLogSave.style.display = "block";
};

overlay.onclick = () => {
    overlay.style.display = "none";
    signUpBox.style.display = "none";
    logInBox.style.display = "none";
};

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










