import { AccessLevel } from "../_enums/accessLevel";
import { Identifiable } from "./base/identifiable";

export class Authorization implements Identifiable {
    id: number;
    login: string;
    password: string;
	isActive: boolean;
	refreshToken: string;
	refreshTokenExpiryTime: any;
	accessLevel: AccessLevel;
}
