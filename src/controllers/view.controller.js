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
};
