(async function () {
    "use strict";

    const LOGIN_PAGE = "admin-login.html";

    function redirectToLogin() {
        window.location.replace(LOGIN_PAGE);
    }

    try {
        const supabaseUrl =
            "https://oaxmnfnaqhdvnykawvyh.supabase.co";

        const supabaseKey =
            "sb_publishable_I6B4jSPL1L88rYKbhpitzw_8erhz3L7";

        if (!window.supabase) {
            redirectToLogin();
            return;
        }

        const db = window.supabase.createClient(
            supabaseUrl,
            supabaseKey
        );

        const {
            data: { session },
            error: sessionError
        } = await db.auth.getSession();

        if (sessionError || !session) {
            redirectToLogin();
            return;
        }

        const {
            data: isAdmin,
            error: adminError
        } = await db.rpc("is_school_admin");

        if (adminError || isAdmin !== true) {
            await db.auth.signOut();
            redirectToLogin();
            return;
        }

        document.documentElement.dataset.adminVerified = "true";

        window.schoolAdminClient = db;

    } catch (error) {
        console.error("Admin verification failed:", error);
        redirectToLogin();
    }
})();
