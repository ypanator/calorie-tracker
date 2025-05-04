import { DataTypes, Model, ModelStatic, Transaction } from "sequelize";
import { SequelizeData } from "../db/db.js";
import UserProvider from "./user-provider.js";
import { Auth, AuthModel } from "../types/auth-type.js";

/**
 * Provider class handling user authentication data persistence
 */
export default class AuthProvider {
    /** Sequelize model for authentication records */
    authModelStatic: ModelStatic<AuthModel>;

    constructor(private sequelizeData: SequelizeData, private userProvider: UserProvider) {
        this.authModelStatic = sequelizeData.define("auth", {
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: { len: [1, 100] }
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: { len: [1, 255] }
            }
        });

        this.authModelStatic.belongsTo(userProvider.userModelStatic);
    }

    /**
     * Creates a new authentication record
     * @param auth The authentication data to create
     * @param transaction Optional transaction to use for the creation
     * @returns Promise resolving to the created authentication model
     */
    create(auth: Auth, transaction?: Transaction): Promise<AuthModel> {
        return this.authModelStatic.create(auth, { transaction, validate: true });
    }

    /**
     * Finds user credentials by username
     * @param username The username to search for
     * @returns Promise resolving to the authentication model if found, null otherwise
     */
    findCredentialsByUsername(username: string): Promise<AuthModel | null> {
        return this.authModelStatic.findOne({ where: { username }});
    }
}
