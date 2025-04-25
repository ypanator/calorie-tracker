import { DataTypes, Model, ModelStatic, Transaction } from "sequelize";
import { SequelizeAuth } from "../db/db";
import UserProvider from "./user-provider";
import { Auth, AuthModel } from "../types/auth-type";

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
                type: DataTypes.STRING,
                allowNull: false,
                validate: { len: [1, 255] } // maybe shorter?
            }
        });

        this.authModelStatic.belongsTo(userProvider.userModelStatic);
        this.sequelizeAuth.sync();
    }

    async create(auth: Auth, transaction: Transaction): Promise<AuthModel> {
        return this.authModelStatic.create(auth, { transaction: transaction });
    }

    async findCredentialsByUsername(username: string): Promise<AuthModel | null> {
        return this.authModelStatic.findOne({ where: { username }});
    }
}
