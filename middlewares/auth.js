function isAuth(req, res, next) { 
    if (req.session.user) 
        return next(); 
        req.flash('error', 'Vui lòng đăng nhập để tiếp tục'); 
        res.redirect('/login'); 
} 
function isAdmin(req, res, next) { 
    if (req.session.user?.role === 'admin') 
        return next(); res.status(403).render('error', { message: 'Không có quyền truy cập' }); 
} 
module.exports = { isAuth, isAdmin };