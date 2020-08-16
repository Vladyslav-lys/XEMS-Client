import {Account} from './accounts';

export class User {
    id: number;
    account: Account;
    login: string;
    password: string;
	isActive: boolean;
	accessLevel: number;
}
