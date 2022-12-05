import { Injectable } from '@nestjs/common';

export type User = {
	userId: number,
	username: string,
	password: string
};

@Injectable()
export class UsersService {
	private readonly users: User[] = [
		{
			userId: 1,
			username: 'daniel',
			password: 'pass123',
		},
		{
			userId: 2,
			username: 'dan12',
			password: 'password123',
		},
	];

	async findOne(username: string): Promise<User | undefined> {
		return this.users.find(user => user.username === username);
	}
}