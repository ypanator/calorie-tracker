import { DataTypes, Model, ModelStatic, Transaction } from "sequelize";
import { SequelizeAuth } from "../db/db.js";
import UserProvider from "./user-provider.js";
import { Auth, AuthModel } from "../types/auth-type.js";

export default class AuthProvider {

    authModelStatic: ModelStatic<AuthModel>;

    constructor(private sequelizeAuth: SequelizeAuth, private userProvider: UserProvider) {
        this.authModelStatic = sequelizeAuth.define("Auth", {
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: { len: [1, 100] }
            },
            password: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { len: [1, 255] } // maybe shorter?
            }
        });

        this.authModelStatic.belongsTo(userProvider.userModelStatic, { foreignKey: "userId" });
    }

    create(auth: Auth, transaction: Transaction): Promise<AuthModel> {
        return this.authModelStatic.create(auth, { transaction, validate: true });
    }

    findCredentialsByUsername(username: string): Promise<AuthModel | null> {
        return this.authModelStatic.findOne({ where: { username }});
    }
}
