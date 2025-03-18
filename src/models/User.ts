// import mongoose, { Document, Schema } from "mongoose";

// export interface IUser extends Document {
//     username: string;
//     password: string;
//     email: string
// }


// const UserSchema =new Schema<IUser>({
//     username: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true }
// })

// export default mongoose.model<IUser>('user',UserSchema)






import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    password?: string; // Make password optional in TypeScript
    email: string;
    googleId?: string; // Add googleId for OAuth users
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: function () { return !this.googleId; } // Password required only if not using Google 
    },
    googleId: { type: String, unique: true, sparse: true } // Allow users without googleId
});

export default mongoose.model<IUser>('User', UserSchema);
