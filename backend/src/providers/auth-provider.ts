import { DataTypes, Model, ModelStatic, Transaction } from "sequelize";
import { SequelizeData } from "../db/db.js";
import UserProvider from "./user-provider.js";
import { Auth, AuthModel } from "../types/auth-type.js";

export default class AuthProvider {

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

    create(auth: Auth, transaction?: Transaction): Promise<AuthModel> {
        return this.authModelStatic.create(auth, { transaction, validate: true });
    }

    findCredentialsByUsername(username: string): Promise<AuthModel | null> {
        return this.authModelStatic.findOne({ where: { username }});
    }
}
