import { DataTypes, Model, ModelStatic, Transaction } from "sequelize";
import { SequelizeAuth } from "../db/db";
import { Auth } from "../schemas/auth-schema";

export default class AuthProvider {

    authModel: ModelStatic<AuthModel>;

    constructor(private sequelizeAuth: SequelizeAuth, private userProvider: UserProvider) {
        this.authModel = sequelizeAuth.define("Auth", {
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [1, 100]
                }
            },
            hashedPassword: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    // maybe shorter?
                    len: [1, 255]
                }
            }
        });

        this.authModel.belongsTo(userProvider.userModel);
        this.sequelizeAuth.sync();
    }

    create(auth: AuthAttributes, transaction: Transaction): Promise<AuthModel> {
        return this.authModel.create(auth, { transaction: transaction });
    }

    findCredentialsByUsername(username: string): Promise<AuthModel | null> {
        return this.authModel.findOne({ where: { username } });
    }
}

export interface AuthAttributes {
    id?: number,
    username: string,
    hashedPassword: string,
    userId: number
};

export type AuthModel = Model<AuthAttributes> & AuthAttributes;