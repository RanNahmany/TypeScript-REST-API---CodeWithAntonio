import mongoose from "mongoose";

// Define the schema for the User model in the MongoDB database.
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "user" },

  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
    },
});

// Export the User model so that it can be used in other modules.
export const UserModel = mongoose.model("User", UserSchema);


// User Model Actions (CRUD)
export const getUsers = async () => {
    return await UserModel.find();
    }

export const getUserByEmail = async (email: string, fieldsToInclude: any = null) => {
    return await UserModel.findOne({ email }).select(fieldsToInclude);
    }

export const getUserBySessionToken = async (sessionToken: string) => {
    return await UserModel.findOne({ "authentication.sessionToken": sessionToken });
    }

export const getUserById = async (id: string) => {
    return await UserModel.findById(id);
    }

export const createUser2 = async (user: any) => {
    return await UserModel.create(user);
    }

export const createUser = async (values: Record<string, any>) => {
    try {
        const user = await new UserModel(values).save();
        return user.toObject();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create user');
    }
}

export const deleteUserById = async (id: string) => {
    return await UserModel.findByIdAndDelete(id);
}

export const updateUserById = async (id: string, values: any, returnNew: boolean = true) => {
    return await UserModel.findByIdAndUpdate(id, values, { new: returnNew })
}

export const updateUserById2 = async (id: string, values: Record<string, any>) => {
    return await UserModel.findByIdAndUpdate(id, values)
}
