(function() {
    // 1. זיהוי אוטומטי של המפתח מתוך התג שהלקוח הדביק
    const currentScript = document.currentScript || document.querySelector('script[data-key]');
    const LICENSE_KEY = currentScript ? currentScript.getAttribute('data-key') : null;

    if (!LICENSE_KEY) {
        console.error("GishaShava: Missing License Key");
        return;
    }

    // 2. כתובת השרת המעודכנת ב-PythonAnywhere
    const API_URL = "https://gishashava.pythonanywhere.com/api/licenses/validate/";

    // 3. פנייה לשרת לאימות (כולל מניעת Cache כדי לוודא בדיקה בזמן אמת)
    fetch(`${API_URL}?key=${LICENSE_KEY}&_=${new Date().getTime()}`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
        if (data && data.valid) {
            // הזרקת הווידג'ט המלא (הקובץ המעורפל) מ-GitHub Pages של הארגון
            const widgetScript = document.createElement('script');

            // שים לב: הנתיב כולל את תיקיית js כפי שסידרנו במבנה החדש
            widgetScript.src = "https://gishashava.github.io/gishashava-demo_site/js/bundle.js";
            widgetScript.async = true;

            // העברת הגדרות מהשרת ללוח הבקרה של התוסף (צבעים, מיקום וכו')
            window.GishaShavaConfig = data.config;

            document.body.appendChild(widgetScript);
            console.log("GishaShava: License validated, loading widget...");
        } else {
            console.warn("GishaShava: Invalid license key.");
        }
    })
    .catch((err) => {
        console.error("GishaShava: Connection error", err);
    });
})();