const supabaseUrl = "https://owdtllwewggvaleevyvy.supabase.co";
const supabaseKey = "sb_publishable_nLFX-3uJT7Q7-GNvfzBtYw_iOkrWX6R";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (!file) return alert("בחר קובץ");

    const filePath = `${Date.now()}_${file.name}`;

    // העלאה ל-Bucket
    const { data, error } = await supabase.storage
        .from("Folders")
        .upload(filePath, file);

    if (error) {
        console.error(error);
        alert("שגיאה בהעלאה");
        return;
    }

    // קבלת URL ציבורי
    const { data: publicUrl } = supabase.storage
        .from("Folders")
        .getPublicUrl(filePath);

    // שמירת הרשומה בטבלה
    const { error: insertError } = await supabase
        .from("FolderD")
        .insert({
            name: file.name,
            url: publicUrl.publicUrl
        });

    if (insertError) {
        console.error(insertError);
        alert("שגיאה בשמירת הרשומה");
        return;
    }

    alert("הקובץ הועלה ונשמר!");
    loadFiles();
}
loadFiles();
    
async function loadFiles() {
    const { data, error } = await supabase
        .from("FolderD")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById("filesList");
    container.innerHTML = "";

    data.forEach(file => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${file.name}</p>
            <a href="${file.url}" target="_blank">הורדה</a>
            <hr>
        `;
        container.appendChild(div);
    });
}

async function searchFiles() {
    const text = document.getElementById("search").value;

    const { data, error } = await supabase
        .from("FolderD")
        .select("*")
        .ilike("name", `%${text}%`);

    if (error) return console.error(error);

    const container = document.getElementById("filesList");
    container.innerHTML = "";

    data.forEach(file => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${file.name}</p>
            <a href="${file.url}" target="_blank">הורדה</a>
            <hr>
        `;
        container.appendChild(div);
    });
}

const signLogSave = document.getElementById("signLogSave");
const saveButtonSign = document.getElementById("saveButtonSign");
const signUp = document.getElementById("passwordInputSign");

const saveButtonLog = document.getElementById("saveButtonLog");
const logIn = document.getElementById("passwordInputLog");

const result = document.getElementById("result");
const showBoxSign = document.getElementById("showBoxSign");
const showBoxLog = document.getElementById("showBoxLog");

const overlay = document.getElementById("overlay");
const signUpBox = document.getElementById("signUpBox");
const logInBox = document.getElementById("logInBox");

showBoxSign.addEventListener("click", () => {
    signLogSave.style.display = "none";
    overlay.style.display = "block";
    signUpBox.style.display = "flex";
});

showBoxLog.addEventListener("click", () => {
    signLogSave.style.display = "none";
    overlay.style.display = "block";
    logInBox.style.display = "flex";
});

let userPassword = "";

saveButtonSign.addEventListener("click", function() {
    userPassword = signUp.value.trim();
    signLogSave.style.display = "block";
    overlay.style.display = "none";
    signUpBox.style.display = "none";
});

saveButtonLog.addEventListener("click", function() {
    const signinValue = logIn.value.trim();
    overlay.style.display = "none";
    logInBox.style.display = "none";

    if (signinValue === userPassword) {
        signLogSave.style.display = "block";
        signLogSave.textContent = "You are loged in";

    } else {
        signLogSave.style.display = "block";
        signLogSave.textContent = "Wrong Username or Password";
    }
});








