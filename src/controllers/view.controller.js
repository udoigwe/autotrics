module.exports = {
    /* home: async (req, res) => {
        res.render("index", { title: "Home" });
    }, */
    signIn: async (req, res) => {
        res.render("signIn", { title: "Sign In | Autotrics" });
    },
    signUp: async (req, res) => {
        res.render("signUp", { title: "Sign Up" });
    },
    verifyAccount: async (req, res) => {
        res.render("accountVerification", {
            title: "Verify Account | Autotrics",
        });
    },
    forgotPassword: async (req, res) => {
        res.render("forgot-password", { title: "Forgot Password | Autotrics" });
    },
    passwordRecovery: async (req, res) => {
        res.render("password-recovery", {
            title: "Password Recovery | Autotrics",
        });
    },

    /* Protected pages */
    dashboard: async (req, res) => {
        res.render("dashboard", {
            title: "Dashboard | Autotrics",
        });
    },
    comingSoon: async (req, res) => {
        res.render("comingSoon", {
            title: "Under Construction | Autotrics",
        });
    },
    myCars: async (req, res) => {
        res.render("myCars", {
            title: "My Cars | Autotrics",
        });
    },
    profile: async (req, res) => {
        res.render("profile", {
            title: "My Profile | Autotrics",
        });
    },
    smartAssistant: async (req, res) => {
        res.render("smart-assistant", {
            title: "Vehicle Smart Assistant | Autotrics",
        });
    },
    mechanicFinder: async (req, res) => {
        res.render("mechanic-finder", {
            title: "Mechanic Finder | Autotrics",
        });
    },
    faq: async (req, res) => {
        res.render("faq", {
            title: "FAQs | Autotrics",
        });
    },
};
