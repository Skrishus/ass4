class Middleware {
    static async setToken(req, res, next) {
        res.locals.isAuth = req.session?.isAuthenticated;

        next();
    }

    static async ensureAuth(req, res, next) {
        if (req.session?.isAuthenticated) {
            next();
        } else {
            res.redirect("/login");
        }
    }

    static async ensureGuest(req, res, next) {
        if (!req.session?.isAuthenticated) {
            next();
        } else {
            res.redirect("/");
        }
    }

    static async ensureAdmin(req, res, next) {
        if (req.session?.isAuthenticated && req.session?.user?.role === "Admin") {
            next();
        } else {
            res.redirect("/");
        }
    }
}

module.exports = Middleware;
