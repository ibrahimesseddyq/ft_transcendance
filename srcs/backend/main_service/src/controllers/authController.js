const logout = (req, res) => {
    req.logout((err) => {
        if (err) 
          return res.status(500).json({ message: "Logout failed" });
        res.redirect('http://localhost:5173/');
    });
};

const getAuthStatus = (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ loggedIn: true, user: req.user });
    } else {
        res.status(401).json({ loggedIn: false });
    }
};

const googleCallback = (req, res) => {
    res.redirect('http://localhost:5173/dashboard');
};

export default {
    logout,
    getAuthStatus,
    googleCallback
};