import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export class AuthController {
    constructor(env) {
        this.env = env;
    }

    login = (_req, res) => {
        console.log("Login");
        res.oidc.login({
            returnTo: `${this.env.BASE_URL}/api/auth/set-user-data`,
            authorizationParams: { prompt: "login" },
        });
    };

    logout = (_req, res) => {
        console.log("Logout");
        res.oidc.logout({
            returnTo: `${this.env.FE_BASE_URL}`,
        });
    };

    setUserData = async (req, res) => {
        try {
            const oauthUser = req.oidc.user;

            if (!oauthUser?.email) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Email not found in OAuth user data",
                });
                return;
            }

            // Tìm user hoặc tạo mới
            let user = await User.findOne({ email: oauthUser.email });

            if (!user) {
                user = new User({
                    name: oauthUser.name,
                    email: oauthUser.email,
                    avatar: oauthUser.picture
                });
                await user.save();
            } else {
                // Update avatar if it changed
                if (user.avatar !== oauthUser.picture) {
                    user.avatar = oauthUser.picture;
                    await user.save();
                }
            }

            // Tạo JWT token
            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                    restaurant: user.restaurant
                },
                this.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Prepare user data (loại bỏ password)
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                restaurant: user.restaurant,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            // Redirect về frontend với token và user data
            const encodedUserData = encodeURIComponent(JSON.stringify(userData));
            res.redirect(`${this.env.FE_BASE_URL}/auth/callback?token=${token}&user=${encodedUserData}`);

        } catch (error) {
            console.error("Error in setUserData:", error);
            res.redirect(`${this.env.FE_BASE_URL}/auth/callback?error=${encodeURIComponent(error.message)}`);
        }
    };
}