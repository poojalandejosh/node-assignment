import Admin from "./Admin.model";
import Customer from "./Customer.model";
import Account from "./Account.model";
import Transaction from "./Transaction.model";

Admin.hasMany(Customer, { foreignKey: "created_by_admin_id", as: "customers" });
Customer.belongsTo(Admin, { foreignKey: "created_by_admin_id", as: "admin" });

Customer.hasOne(Account, { foreignKey: "customer_id", as: "account" });
Account.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

Account.hasMany(Transaction, { foreignKey: "account_id", as: "transactions" });
Transaction.belongsTo(Account, { foreignKey: "account_id", as: "account" });

export { Admin, Customer, Account, Transaction };
