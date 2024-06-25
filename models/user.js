import mongoose from "mongoose";
import { format } from "date-fns";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registration_date: {
        type: String,
        default: () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
    },
    last_login_date: {
        type: String,
        default: null
    }
});

const User = mongoose.model("User", userSchema);
export default User;